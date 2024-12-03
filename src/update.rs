use anyhow::Result;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::{request::send_request, response::handle_response};

#[skip_serializing_none]
#[derive(Deserialize, Serialize, Debug)]
struct RequestBody {
    short: Box<str>,
    url: Box<str>,
    expiration: Option<Box<str>>,
    expiration_ttl: Option<Box<str>>,
}

pub(crate) fn update(
    endpoint: Box<str>,
    short: Box<str>,
    url: Box<str>,
    token: Box<str>,
    expiration: Option<Box<str>>,
    expiration_ttl: Option<Box<str>>,
) -> Result<()> {
    let body_struct = RequestBody {
        short: short.clone(),
        url: url.clone(),
        expiration,
        expiration_ttl,
    };
    let response = send_request::<()>(
        "update",
        &endpoint,
        Some(&token),
        Some(&serde_json::to_string(&body_struct)?),
        None,
        None,
    )?;
    handle_response::<()>(response)?.unwrap();
    println!("Short Link {} updated to: {}", short, url);
    Ok(())
}
