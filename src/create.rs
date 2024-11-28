use anyhow::Result;
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::{
    request::send_request,
    response::{handle_response, CreateData},
};

#[skip_serializing_none]
#[derive(Deserialize, Serialize, Debug)]
struct RequestBody {
    url: Box<str>,
    length: Option<Box<str>>,
    number: Option<bool>,
    capital: Option<bool>,
    lowercase: Option<bool>,
    expiration: Option<Box<str>>,
    expiration_ttl: Option<Box<str>>,
}

pub(crate) fn create(
    endpoint: Box<str>,
    short_link: Box<str>,
    token: Box<str>,
    length: Option<Box<str>>,
    number: Option<bool>,
    capital: Option<bool>,
    lowercase: Option<bool>,
    expiration: Option<Box<str>>,
    expiration_ttl: Option<Box<str>>,
) -> Result<()> {
    let body_struct = RequestBody {
        url: short_link,
        length,
        number,
        capital,
        lowercase,
        expiration,
        expiration_ttl,
    };
    let response = send_request::<CreateData>(
        "create",
        &endpoint,
        Some(&token),
        Some(&serde_json::to_string(&body_struct)?),
        None,
        None,
    )?;
    let data = handle_response(response)?.unwrap();
    println!("Short Link created: {}", data.short);
    Ok(())
}
