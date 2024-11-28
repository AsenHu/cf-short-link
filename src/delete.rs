use anyhow::{bail, Result};

use crate::{new_request, response::Response};

pub(crate) fn delete(endpoint: Box<str>, short: Box<str>, token: Box<str>) -> Result<()> {
    println!("Sending request, sit tight.");
    let response = new_request!(
        delete,
        endpoint,
        token,
        format!(r#"{{"short":"{}"}}"#, short),
        ""
    )
    .into_string()?;
    let response: Response<()> = serde_json::from_str(&response)?;
    if response.ok {
        println!("Success!");
        println!("Deleted short link: {}", short);
    } else {
        println!("Failed.");
        bail!("{}", response.msg);
    }
    Ok(())
}
