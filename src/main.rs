mod cli;
mod request;
mod response;
macro_rules! import_modules {
    ($($mod_name:ident),*) => {
        $(
            mod $mod_name;
            use $mod_name::$mod_name;
        )*
    };
}
import_modules!(create, delete, get, list, update);

use std::process::ExitCode;

use anyhow::Result;
use clap::{CommandFactory, FromArgMatches as _};
use cli::{Cli, Commands};

fn main() -> Result<ExitCode> {
    let mut cmd = Cli::command();
    cmd.build();
    let args = Cli::from_arg_matches(&cmd.clone().get_matches())?;
    let endpoint = args.endpoint;
    match args.command {
        Commands::Get { arg } => get(endpoint, arg)?,
        Commands::List {
            token,
            query,
            cursor,
        } => list(endpoint, token, query, cursor)?,
        Commands::Create {
            arg,
            token,
            length,
            number,
            capital,
            lowercase,
            expiration,
            expiration_ttl,
        } => create(
            endpoint,
            arg,
            token,
            length,
            number,
            capital,
            lowercase,
            expiration,
            expiration_ttl,
        )?,
        Commands::Update {
            arg,
            token,
            url,
            expiration,
            expiration_ttl,
        } => update(endpoint, arg, url, token, expiration, expiration_ttl)?,
        Commands::Delete { arg, token } => delete(endpoint, arg, token)?,
    }
    Ok(ExitCode::SUCCESS)
}

#[macro_export]
macro_rules! new_request {
    ($method:ident, $endpoint:expr, $token:expr, $ext_1:expr, $ext_2:expr) => {{
        let base_url = format!("{}/api/v1", $endpoint.trim_end_matches("/"));
        let url = match stringify!($method) {
            "get" => format!("{}/get", base_url),
            "list" => format!("{}/list", base_url),
            "create" => format!("{}/create", base_url),
            "update" => format!("{}/update", base_url),
            "delete" => format!("{}/delete", base_url),
            _ => anyhow::bail!("Unsupported method: {}", stringify!($method)),
        };
        let request = match stringify!($method) {
            "get" => ureq::get(&url)
                .query("q", &$ext_1)
                .set("Content-Type", "application/json")
                .call(),
            "list" => ureq::get(&url)
                .set("Authorization", &format!("Bearer {}", $token))
                .query("q", &$ext_1)
                .query("c", &$ext_2)
                .set("Content-Type", "application/json")
                .call(),
            "create" => ureq::post(&url)
                .set("Authorization", &format!("Bearer {}", $token))
                .set("Content-Type", "application/json")
                .send_string(&$ext_1),
            "update" => ureq::put(&url)
                .set("Authorization", &format!("Bearer {}", $token))
                .set("Content-Type", "application/json")
                .send_string(&$ext_1),
            "delete" => ureq::delete(&url)
                .set("Authorization", &format!("Bearer {}", $token))
                .set("Content-Type", "application/json")
                .send_string(&$ext_1),
            _ => unreachable!(),
        };
        match request {
            Ok(r) => r,
            Err(ureq::Error::Status(_, r)) => r,
            Err(e) => {
                anyhow::bail!(e);
            }
        }
    }};
}
