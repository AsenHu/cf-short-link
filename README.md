# CF_Short_Link

## API

请求通常包含

|请求头|值|
|:-|:-|
|Authorization|Bearer TheTokenHere|
|Content-Type|application/json（建议包含）|

`Authorization` 在大多数时候都要携带，总是携带目前不会导致错误。

`Content-Type` 只建议在请求体是 `JSON` 时携带，但无论是否携带应该都不会导致错误。

### 通用响应

200 响应

|名字|类型|描述|是否存在|
|:-|:-|:-|:-|
|ok|boolean|请求是否成功|总是|
|msg|string|请求相关信息|总是|
|data|string|请求成功时的响应|不一定|

403 响应

`Authorization` 请求头有误或无权限。

```json
{
    "ok": false,
    "msg": "Forbidden"
}
```

|名字|类型|描述|是否存在|
|:-|:-|:-|:-|
|ok|boolean|请求是否成功|总是|
|msg|string|请求相关信息|总是|

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

|名字|类型|描述|是否存在|
|:-|:-|:-|:-|
|ok|boolean|请求是否成功|总是|
|msg|string|请求相关信息|总是|

429 响应

```json
{
    "ok": false,
    "msg": "Rate limit exceeded"
}
```

触发了速率限制，具体的响应可能由 cloudflare 提供。

|名字|类型|描述|是否存在|
|:-|:-|:-|:-|
|ok|boolean|请求是否成功|总是|
|msg|string|请求相关信息|总是|

---

当传入 API 的参数过于奇怪的时候，可能会导致服务端内爆掉。这时传回的错误码和内容由 cloudflare 提供，它可能是任何内容。

### 获取短链接的长连接

GET /api/v1/get?q=<short>

**请求参数**

|名字|类型|描述|默认值|
|:-|:-|:-|:-|
|short|string|必填：需要获取长链接的短链接|无|

该 API 不会检查 `Authorization`

该 API 建议不携带 `Content-Type`

**响应示例**

200 响应

```json
{
    "ok": true,
    "msg": "Good",
    "data": {
        "url": "http://www.reallylong.link"
    }
}
```

|名字|类型|描述|
|:-|:-|:-|
|ok|boolean|请求是否成功|
|msg|string|请求相关信息|
|data.url|string|长链接|

### 列出短链接

GET /api/v1/list

**请求参数**

无

该 API 建议不携带 `Content-Type`

**响应示例**

200 响应

```json
{
    "ok": true,
    "msg": "Good",
    "data": [
        {
            "short": "123Abc",
            "url": "http://www.reallylong.link",
            "expiration": 123456
        },
        {
            "short": "456Def",
            "url": "http://www.anotherlong.link",
            "expiration": 654321
        }
    ]
}
```

|名字|类型|描述|
|:-|:-|:-|
|ok|boolean|请求是否成功|
|msg|string|请求相关信息|
|data[].short|string|短链接|
|data[].url|string|长链接|
|data[].expiration|number|过期时间戳|

### 创建短链接

POST /api/v1/create

**请求体**

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
|:-|:-|:-|
|ok|boolean|请求是否成功|
|msg|string|请求相关信息|
|data.short|string|生成的短链接|

当 `lowercase` 为 `false` 并且 `capital` 为 `true` 时，返回的域名也会大写。（以便生成的 QR 码使用数字字母模式，而不是二进制模式）

### 修改短链接

PUT /api/v1/update

**请求体**

```json
{
    "short": "123Abc",
    "url": "http://www.newlong.link",
    "expiration": 123456,
    "expirationTtl": 60
}
```

|名字|类型|描述|默认值|
|:-|:-|:-|:-|
|short|string|必填：需要修改的短链接|无|
|url|string|可选：新的长链接|无|
|expiration|number|可选：新的过期时间戳|无|
|expirationTtl|number|可选：新的存活时间（秒）|无|

`url` `expiration` `expirationTtl` 至少包含一项。

**响应示例**

200 响应

```json
{
    "ok": true,
    "msg": "Updated"
}
```

|名字|类型|描述|
|:-|:-|:-|
|ok|boolean|请求是否成功|
|msg|string|请求相关信息|

### 删除短链接

DELETE /api/v1/delete

**请求体**

```json
{
    "short": "123Abc"
}
```

|名字|类型|描述|默认值|
|:-|:-|:-|:-|
|short|string|必填：需要删除的短链接|无|

**响应示例**

200 响应

```json
{
    "ok": true,
    "msg": "Deleted"
}
```

|名字|类型|描述|
|:-|:-|:-|
|ok|boolean|请求是否成功|
|msg|string|请求相关信息|
