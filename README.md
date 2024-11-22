# CF_Short_Link

## 部署指南

1. Fork 本项目
2. 去 Cloudflare Pages 创建一个项目，把你 Fork 的项目设置为存储库
3. 设置，绑定里，添加一个 kv 数据库，数据库的名称必须是 `kv`
4. 添加环境变量。
5. 构建配置(可选，用于构建 web 面板，不构建不影响 API)，框架预设选择 Vue，剩下保持默认，然后保存即可。
6. 在部署里，重试最新的部署，如果你修改配置前就已经部署了的话。

环境变量如下

|名称|描述|例子|
|:-|:-|:-|
|domain|你的域名，全小写，不要携带协议头|b0.by|
|tokens|是一个数组，里面包含你允许的 token|["TheTokenHere","iQv1qzkLLrjFdVfThxUMn76Tfu9EAnkXgo9E07F8iZx"]|

tokens 不建议用太奇怪的字符，长度建议 43 位大小写字母数字（因为这样刚好是 128 bit 凑个整）

## API

### 请求头

请求通常包含

|请求头|值|
|:-|:-|
|Authorization|Bearer TheTokenHere|
|Content-Type|application/json（建议包含）|

`Authorization` 在大多数时候都要携带，总是携带目前不会导致错误。

`Content-Type` 只建议在请求体是 `JSON` 时携带，但无论是否携带应该都不会导致错误。

### 通用响应

|名字|类型|描述|是否存在|
|:-|:-|:-|:-|
|ok|boolean|请求是否成功|总是|
|msg|string|请求相关信息|总是|
|data|string|请求成功时的响应|不一定|

200 响应

请求成功

400 响应

请求中包含无效的选项字段。

403 响应

`Authorization` 请求头有误或无权限。

404 响应

没有此短链接

429 响应

触发了速率限制，具体的响应可能由 cloudflare 提供。

1101 响应

你传入的参数爆掉了服务端。这时传回的错误码和内容由 cloudflare 提供，它可能是任何内容。

### msg 的内容

|名字|描述|
|:-|:-|
|Rate limit exceeded|触发了速率限制|
|Invalid URL|无效的 URL|
|Provide either expiration or expirationTtl, not both|提供 `expiration` 或 `expirationTtl`，但不能同时提供|
|expirationTtl must be at least 60 seconds|`expirationTtl` 必须至少为 60 秒|
|Forbidden|禁止访问|
|Good|请求成功|
|Updated|短链接已更新|
|Deleted|短链接已删除|
|Not Found|短链接不存在|
|Provide either url, expiration or expirationTtl|URL, expiration 和 expirationTtl 都不存在|
|Provide short|缺少 `short` 字段|
|Provide q|`q` 没有值|
|Invalid JSON|你传的不是 JSON，但应该传 JSON|
|expiration must be greater than the current time|你来自过去|
|length must be less than 512|你没事吧|

---

### 获取短链接的长连接

GET /api/v1/get?q=short

**请求参数**

|名字|类型|描述|默认值|
|:-|:-|:-|:-|
|q|string|必填：需要获取长链接的短链接|无|

该 API 不会检查 `Authorization`

该 API 可以不用携带 `Content-Type`

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
|data.url|string|长链接|

### 列出短链接

GET /api/v1/list?q=nekos.chat&c=nextCursor

**请求参数**

|名字|类型|描述|默认值|
|:-|:-|:-|:-|
|q|string|可选：长链接中包含的查询字符串|无|
|c|string|可选：分页游标|无|

分页游标的值由上一次请求 list 的 `data.cursor` 提供，用于获取下一页的结果。

**响应示例**

200 响应

```json
{
    "ok": true,
    "msg": "Good",
    "data": {
        "cursor": "nextCursor",
        "list_complete": false,
        "links": [
            {
                "short": {
                    "key": "123Abc",
                    "noHttps": "b0.by/123Abc",
                    "full": "https://b0.by/123Abc"
                },
                "url": "http://www.reallylong.link",
                "expiration": 123456
            },
            {
                "short": {
                    "key": "456Def",
                    "noHttps": "b0.by/456Def",
                    "full": "https://b0.by/456Def"
                },
                "url": "http://www.anotherlong.link",
                "expiration": 654321
            }
        ]
    }
}
```

|名字|类型|描述|
|:-|:-|:-|
|data.cursor|string|分页游标|
|data.list_complete|boolean|列表是否完整|
|data.links[].short.key|string|短链接键|
|data.links[].short.noHttps|string|不含协议头的短链接|
|data.links[].short.full|string|完整短链接|
|data.links[].url|string|长链接|
|data.links[].expiration|number|过期时间戳|

当长链接大于等于 1022 个字符（ACSII），`data.links[].url` 将不存在。

当设置了查询字符串时，`links` 可能是空数组。

当 `list_complete` 为 `true` 时，`cursor` 不存在。

`links` 数组单次最多返回 1000 条，但无论是不是最后一页，返回的内容都可能少于 1000 条。

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
    "msg": "Good",
    "data": {
        "short": "b0.by/123Abc"
    }
}
```

|名字|类型|描述|
|:-|:-|:-|
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

当 `expiration` 和 `expirationTtl` 同时未指定时，`expirationTtl` 值为 2592000（30 天）

`expiration` 和 `expirationTtl` 不能同时有值

`expirationTtl` 不得小于 60

`url` 字段不得省略协议（http:// 或 https://）

**响应示例**

200 响应

只有默认响应的内容

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

只有默认响应的内容
