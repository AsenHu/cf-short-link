use std::fmt::Write;

use anyhow::Result;
use chrono::DateTime;
use minus::Pager;

use crate::{
    new_request,
    response::{ListData, Response},
};

pub(crate) fn list(
    endpoint: Box<str>,
    token: Box<str>,
    query: Option<Box<str>>,
    cursor: Option<Box<str>>,
) -> Result<()> {
    println!("Sending request, sit tight.");
    let response = new_request!(
        list,
        endpoint,
        token,
        query.unwrap_or_default(),
        cursor.unwrap_or_default()
    )
    .into_string()?;
    let response: Response<ListData> = serde_json::from_str(&response)?;
    if response.ok {
        let data = response.data.unwrap();
        println!("Success!");
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
        minus::page_all(pager)?
    } else {
        println!("Failed.");
        println!("The short link does not match any URL.");
    }
    Ok(())
}
