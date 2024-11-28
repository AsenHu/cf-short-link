use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::{new_request, response::Response};

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
    let response = new_request!(
        update,
        endpoint,
        token,
        serde_json::to_string(&body_struct)?,
        ""
    )
    .into_string()?;
    let response: Response<()> = serde_json::from_str(&response)?;
    if response.ok {
        println!("Success!");
        println!("Short Link {} updated to: {}", short, url);
    } else {
        println!("Failed.");
        bail!("{}", response.msg);
    }
    Ok(())
}
