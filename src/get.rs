use anyhow::Result;

use crate::{
    request::send_request,
    response::{handle_response, GetData},
};

pub(crate) fn get(endpoint: Box<str>, short: Box<str>) -> Result<()> {
    let response = send_request::<GetData>("get", &endpoint, None, None, Some(&short), None)?;
    let data = handle_response(response)?.unwrap();
    println!("URL Found: {}", data.url);
    Ok(())
}
