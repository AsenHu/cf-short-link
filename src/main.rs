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
