use anyhow::Result;

use crate::{
    request::{send_request, RequestMethod::Delete},
    response::{handle_response, Response},
};

pub(crate) fn delete(endpoint: Box<str>, short: Box<str>, token: Box<str>) -> Result<()> {
    let body = format!(r#"{{"short":"{}"}}"#, short);
    let response: Response<()> =
        send_request(Delete, &endpoint, Some(&token), Some(&body), None, None)?;
    handle_response(response)?;
    println!("Deleted short link: {}", short);
    Ok(())
}
