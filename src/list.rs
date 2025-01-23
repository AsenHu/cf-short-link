use std::fmt::Write;

use anyhow::Result;
use chrono::DateTime;
use minus::Pager;

use crate::{
    request::{send_request, RequestMethod::List},
    response::{handle_response, ListData, Response},
};

pub(crate) fn list(
    endpoint: Box<str>,
    token: Box<str>,
    query: Option<Box<str>>,
    cursor: Option<Box<str>>,
) -> Result<()> {
    let response: Response<ListData> = send_request(
        List,
        &endpoint,
        Some(&token),
        None,
        query.as_deref(),
        cursor.as_deref(),
    )?;
    let data = handle_response(response)?.unwrap();
    println!(
        "Current cursor: {}",
        data.cursor.unwrap_or(Box::from("null"))
    );
    println!("List complete: {}", data.list_complete);
    let mut pager = Pager::new();
    for i in data.links {
        writeln!(pager, "============================================")?;
        writeln!(pager, "Short Link:")?;
        writeln!(pager, "    {}", i.short.no_https)?;
        writeln!(pager, "Original Link:")?;
        writeln!(pager, "    {}", i.url.unwrap_or(Box::from("null")))?;
        let time = DateTime::from_timestamp(i.expiration.unwrap_or_default() as i64, 0)
            .unwrap_or_default()
            .format("%Y-%m-%dT%H:%M:%SZ");
        writeln!(pager, "Expire at: {}", time)?;
        writeln!(pager, "============================================")?;
        for _ in 0..2 {
            writeln!(pager)?
        }
    }
    minus::page_all(pager)?;
    Ok(())
}
