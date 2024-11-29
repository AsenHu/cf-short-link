use clap::{ArgAction, Parser, Subcommand};

#[derive(Parser, Debug)]
#[clap(subcommand_required = true, arg_required_else_help = true)]
#[command(version, about = "Short Link Command Line Interface")]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,
    /// Backend Endpoint
    #[arg(short, long)]
    pub endpoint: Box<str>,
}

#[derive(Subcommand, Debug)]
pub enum Commands {
    #[command(about = "Get the long link corresponding to the short link")]
    Get { arg: Box<str> },

    #[command(about = "List short links")]
    List {
        /// Authorization Bearer Token
        #[arg(short, long)]
        token: Box<str>,
        /// Query string
        #[arg(long)]
        query: Option<Box<str>>,
        /// Cursor
        #[arg(long)]
        cursor: Option<Box<str>>,
    },

    #[command(about = "Create a short link")]
    Create {
        arg: Box<str>,
        /// Authorization Bearer Token
        #[arg(short, long)]
        token: Box<str>,
        /// Short link length
        #[arg(long)]
        length: Option<Box<str>>,
        /// Disable including numbers in the short link.
        #[arg(long, action = ArgAction::SetFalse)]
        number: Option<bool>,
        /// Disable including capital letters in the short link.
        #[arg(long, action = ArgAction::SetFalse)]
        capital: Option<bool>,
        /// Disable including lowercase letters in the short link.
        #[arg(long, action = ArgAction::SetFalse)]
        lowercase: Option<bool>,
        /// Expiration timestamp
        #[arg(long)]
        expiration: Option<Box<str>>,
        /// Expiration TTL
        #[arg(long)]
        expiration_ttl: Option<Box<str>>,
    },

    #[command(about = "Update a short link")]
    Update {
        arg: Box<str>,
        /// Authorization Bearer Token
        #[arg(short, long)]
        token: Box<str>,
        /// New URL
        #[arg(long)]
        url: Box<str>,
        /// Expiration timestamp
        #[arg(long)]
        expiration: Option<Box<str>>,
        /// Expiration TTL
        #[arg(long)]
        expiration_ttl: Option<Box<str>>,
    },

    #[command(about = "Delete a short link")]
    Delete {
        arg: Box<str>,
        /// Authorization Bearer Token
        #[arg(short, long)]
        token: Box<str>,
    },
}
