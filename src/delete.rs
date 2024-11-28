use anyhow::Result;

use crate::{request::send_request, response::handle_response};

pub(crate) fn delete(endpoint: Box<str>, short: Box<str>, token: Box<str>) -> Result<()> {
    let body = format!(r#"{{"short":"{}"}}"#, short);
    let response = send_request::<()>("delete", &endpoint, Some(&token), Some(&body), None, None)?;
    handle_response(response)?;
    println!("Deleted short link: {}", short);
    Ok(())
}
