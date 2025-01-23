use anyhow::Result;

use crate::{
    request::{send_request, RequestMethod::Get},
    response::{handle_response, GetData, Response},
};

pub(crate) fn get(endpoint: Box<str>, short: Box<str>) -> Result<()> {
    let response: Response<GetData> = send_request(Get, &endpoint, None, None, Some(&short), None)?;
    let data = handle_response(response)?.unwrap();
    println!("URL Found: {}", data.url);
    Ok(())
}
