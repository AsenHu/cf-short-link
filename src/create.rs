use anyhow::{bail, Result};
use serde::{Deserialize, Serialize};
use serde_with::skip_serializing_none;

use crate::{
    new_request,
    response::{CreateData, Response},
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
    println!("Sending request, sit tight.");
    let body_struct = RequestBody {
        url: short_link,
        length,
        number,
        capital,
        lowercase,
        expiration,
        expiration_ttl,
    };
    let response = new_request!(
        create,
        endpoint,
        token,
        serde_json::to_string(&body_struct)?,
        ""
    )
    .into_string()?;
    let response: Response<CreateData> = serde_json::from_str(&response)?;
    if response.ok {
        println!("Success!");
        println!("Short Link created: {}", response.data.unwrap().short)
    } else {
        println!("Failed.");
        bail!("{}", response.msg);
    }
    Ok(())
}
