use anyhow::Result;

use crate::{
    new_request,
    response::{GetData, Response},
};

pub(crate) fn get(endpoint: Box<str>, short: Box<str>) -> Result<()> {
    println!("Sending request, sit tight.");
    let response = new_request!(get, endpoint, "", short, "").into_string()?;
    let response: Response<GetData> = serde_json::from_str(&response)?;
    if response.ok {
        println!("Success!");
        println!("URL Found: {}", response.data.unwrap().url)
    } else {
        println!("Failed.");
        println!("The short link does not match any URL.");
    }
    Ok(())
}
