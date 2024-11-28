use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug)]
pub struct Response<T> {
    pub ok: bool,
    pub msg: Box<str>,
    pub data: Option<T>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct CreateData {
    pub short: Box<str>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct GetData {
    pub url: Box<str>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ListData {
    pub cursor: Option<Box<str>>,
    pub list_complete: bool,
    pub links: Box<[Link]>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Link {
    pub short: Short,
    pub url: Option<Box<str>>,
    pub expiration: Option<u64>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Short {
    pub key: Box<str>,
    #[serde(rename = "noHttps")]
    pub no_https: Box<str>,
    pub full: Box<str>,
}
