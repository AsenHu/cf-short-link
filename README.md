# CF_Short_Link

## API

请求必须包含

|请求头|值|
|:-|:-|
|Authorization|Bearer TheTokenHere|
|Content-Type|application/json（建议包含）|

响应

|名字|类型|描述|
|:-|:-:|:-|
|ok|boolean|请求是否成功|
|msg|string|请求失败时的错误信息|
|data|string|请求成功时的响应（失败时没有）|

### 创建短链接

POST /api/v1/create

**请求示例**

```json
{
    "url": "http://www.reallylong.link",
    "length": 6,
    "number": true,
    "capital": true,
    "lowercase": true,
    "expiration": 123456,
    "expirationTtl": 60
}
```

|名字|类型|描述|默认值|
|:-|:-|:-|:-|
|url|string|必填：需要缩短的长链接|无|
|length|number|可选：短链接的长度|6|
|number|boolean|可选：是否包含数字|true|
|capital|boolean|可选：是否包含大写字母|true|
|lowercase|boolean|可选：是否包含小写字母|true|
|expiration|number|可选：链接的过期时间戳|无|
|expirationTtl|number|可选：链接的存活时间（秒）|无|

当 `expiration` 和 `expirationTtl` 同时未指定时，`expirationTtl` 值为 2592000（30 天）

`expiration` 和 `expirationTtl` 不能同时有值

`expirationTtl` 不得小于 60

`url` 字段不得省略协议（http:// 或 https://）

服务端返回的短链接长度可能会大于 `length` 值，在该值小于 3 时很可能发生（因为没有足够的短链接了）

**响应示例**

200 响应

```json
{
    "ok": true,
    "msg": "Good"
    "data": {
        "short": "b0.by/123Abc"
    }
}
```

|名字|类型|描述|
|:-|:-:|:-|
|data.short|string|生成的短链接|

当 `lowercase` 为 `false` 并且 `capital` 为 `true` 时，返回的域名也会大写。（以便生成的 QR 码使用数字字母模式，而不是二进制模式）

403 响应

`Authorization` 请求头有误。

```json
{
    "ok": false,
    "msg": "Forbidden"
}
```

400 响应

```json
{
    "ok": false,
    "msg": ""
}
```

请求中包含无效的选项字段。

`msg` 可能的报错有这些。
  - Invalid URL
  - Provide either expiration or expirationTtl, not both
  - expirationTtl must be at least 60 seconds

429 响应

```json
{
    "ok": false,
    "msg": "Rate limit exceeded"
}
```

触发了速率限制，具体的响应可能由 cloudflare 提供。

---

当传入 API 的参数过于奇怪的时候，可能会导致服务端内爆掉。这时传回的错误码和内容由 cloudflare 提供，它可能是任何内容。
