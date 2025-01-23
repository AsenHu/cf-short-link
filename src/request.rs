use crate::response::Response;
use anyhow::{bail, Result};
use serde::de::DeserializeOwned;

#[derive(Debug)]
pub(crate) enum RequestMethod {
    Create,
    Delete,
    Get,
    List,
    Update,
}

pub(crate) fn send_request<T>(
    method: RequestMethod,
    endpoint: &str,
    token: Option<&str>,
    body: Option<&str>,
    query: Option<&str>,
    cursor: Option<&str>,
) -> Result<Response<T>>
where
    T: DeserializeOwned,
{
    let base_url = format!("{}/api/v1", endpoint.trim_end_matches("/"));
    println!("Sending request, sit tight.");
    if matches!(
        method,
        RequestMethod::Create | RequestMethod::Delete | RequestMethod::List | RequestMethod::Update
    ) {
        if token.is_none() {
            bail!("Token is required for {:?} requests", method);
        }
    }
    if matches!(method, RequestMethod::Get | RequestMethod::List) {
        if query.is_none() {
            bail!("Query is required for {:?} requests", method);
        }
    }
    let mut request_builder = match method {
        RequestMethod::Create => ureq::post(&format!("{}/create", base_url)),
        RequestMethod::Delete => ureq::delete(&format!("{}/delete", base_url)),
        RequestMethod::Get | RequestMethod::List => {
            let seg = match method {
                RequestMethod::Get => "get",
                RequestMethod::List => "list",
                _ => unreachable!(),
            };
            ureq::get(&format!("{}/{}", base_url, seg))
        }
        RequestMethod::Update => ureq::put(&format!("{}/update", base_url)),
    };
    request_builder = request_builder.set("Content-Type", "application/json");
    if let Some(token) = token {
        request_builder = request_builder.set("Authorization", &format!("Bearer {}", token));
    }
    if let Some(query) = query {
        request_builder = request_builder.query("q", query);
    }
    if let RequestMethod::List = method {
        if cursor.is_none() {
            bail!("Cursor is required for {:?} requests", method);
        }
        if let Some(cursor) = cursor {
            request_builder = request_builder.query("c", cursor);
        }
    }
    let response =
        if let RequestMethod::Create | RequestMethod::Delete | RequestMethod::Update = method {
            if body.is_none() {
                bail!("Body is required for {:?} requests", method);
            }
            request_builder.send_string(body.unwrap())
        } else {
            request_builder.call()
        };
    let response = match response {
        Ok(r) => r,
        Err(ureq::Error::Status(_, r)) => r,
        Err(e) => bail!(e),
    };
    let response_body = response.into_string()?;
    Ok(serde_json::from_str(&response_body)?)
}
