use crate::{new_request, response::Response};
use anyhow::{bail, Result};

pub(crate) fn send_request<T>(
    method: &str,
    endpoint: &str,
    token: Option<&str>,
    body: Option<&str>,
    query: Option<&str>,
    cursor: Option<&str>,
) -> Result<Response<T>>
where
    T: serde::de::DeserializeOwned,
{
    let token = token.unwrap_or("");
    let body = body.unwrap_or("");
    let query = query.unwrap_or("");
    let cursor = cursor.unwrap_or("");
    println!("Sending request, sit tight.");
    let response = match method {
        "get" => new_request!(get, endpoint, token, query, ""),
        "list" => new_request!(list, endpoint, token, query, cursor),
        "create" => new_request!(create, endpoint, token, body, ""),
        "update" => new_request!(update, endpoint, token, body, ""),
        "delete" => new_request!(delete, endpoint, token, body, ""),
        _ => bail!("Unsupported method: {}", method),
    }
    .into_string()?;
    Ok(serde_json::from_str(&response)?)
}
