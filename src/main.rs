mod cli;
mod create;
mod delete;
mod get;
mod list;
mod response;
mod update;

use std::process::ExitCode;

use anyhow::Result;
use clap::{CommandFactory, FromArgMatches as _};
use cli::Cli;

fn main() -> Result<ExitCode> {
    let mut cmd = Cli::command();
    cmd.build();
    let args = Cli::from_arg_matches(&cmd.clone().get_matches())?;
    let endpoint = args.endpoint;
    match args.command {
        cli::Commands::Get { arg } => get::get(endpoint, arg)?,
        cli::Commands::List {
            token,
            query,
            cursor,
        } => list::list(endpoint, token, query, cursor)?,
        cli::Commands::Create {
            arg,
            token,
            length,
            number,
            capital,
            lowercase,
            expiration,
            expiration_ttl,
        } => create::create(
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
        cli::Commands::Update {
            arg,
            token,
            url,
            expiration,
            expiration_ttl,
        } => update::update(endpoint, arg, url, token, expiration, expiration_ttl)?,
        cli::Commands::Delete { arg, token } => delete::delete(endpoint, arg, token)?,
    }
    Ok(ExitCode::SUCCESS)
}

#[macro_export]
macro_rules! new_request {
    ($method:ident, $endpoint:expr, $token:expr, $ext_1:expr, $ext_2:expr) => {{
        let request = match concat!(stringify!($method)) {
            "get" => {
                let url = format!("{}/api/v1/get", $endpoint.trim_end_matches("/"));
                ureq::get(&url)
                    .query("q", &$ext_1)
                    .set("Content-Type", "application/json")
                    .call()
            }
            "list" => {
                let url = format!("{}/api/v1/list", $endpoint.trim_end_matches("/"));
                ureq::get(&url)
                    .set("Authorization", &format!("Bearer {}", $token))
                    .query("q", &$ext_1)
                    .query("c", &$ext_2)
                    .set("Content-Type", "application/json")
                    .call()
            }
            "create" => {
                let url = format!("{}/api/v1/create", $endpoint.trim_end_matches("/"));
                ureq::post(&url)
                    .set("Authorization", &format!("Bearer {}", $token))
                    .set("Content-Type", "application/json")
                    .send_string(&$ext_1)
            }
            "update" => {
                let url = format!("{}/api/v1/update", $endpoint.trim_end_matches("/"));
                ureq::put(&url)
                    .set("Authorization", &format!("Bearer {}", $token))
                    .set("Content-Type", "application/json")
                    .send_string(&$ext_1)
            }
            "delete" => {
                let url = format!("{}/api/v1/delete", $endpoint.trim_end_matches("/"));
                ureq::delete(&url)
                    .set("Authorization", &format!("Bearer {}", $token))
                    .set("Content-Type", "application/json")
                    .send_string(&$ext_1)
            }
            _ => anyhow::bail!("Unsupported method: {}", stringify!($method)),
        };
        match request {
            Ok(response) => response,
            Err(e) => {
                if e.kind() == ureq::ErrorKind::BadStatus {
                    if let Some(response) = e.into_response() {
                        response
                    } else {
                        unreachable!()
                    }
                } else {
                    anyhow::bail!(e);
                }
            }
        }
    }};
}
