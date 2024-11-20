interface Env {
    tokens: string;
    kv: KVNamespace;
}

interface Data {
    url?: string;
    short?: string;
    expiration?: number;
    expirationTtl?: number;
}

const onRequestPut = async (context: { request: Request, env: Env }) => {
    // 鉴权
    const token = context.request.headers.get('Authorization');
    const tokens: string[] = JSON.parse(context.env.tokens);
    console.log('得到 token', token);
    if (!token || !tokens.includes(token.replace('Bearer ', ''))) {
        console.log('鉴权失败');
        return genResponse({ ok: false, msg: "Forbidden" }, 403);
    }
    console.log('鉴权通过');

    // 规范用户输入
    const data: Data = await context.request.json();
    console.log('得到数据', data);
    // 检查 URL 是否合法
    if (data.url && !/^https?:\/\//.test(data.url)) {
        console.log('URL 不合法');
        return genResponse({ ok: false, msg: "Invalid URL" }, 400);
    }
    console.log('URL 合法');
    // 检查 url, expiration 和 expirationTtl 是否都不存在
    if (!data.url && !data.expiration && !data.expirationTtl) {
        console.log('URL, expiration 和 expirationTtl 都不存在');
        return genResponse({ ok: false, msg: "Provide either url, expiration or expirationTtl" }, 400);
    }
    // 检查 expiration 和 expirationTtl 是否同时存在
    if (data.expiration && data.expirationTtl) {
        return genResponse({ ok: false, msg: "Provide either expiration or expirationTtl, not both" }, 400);
    }
    // 检查 expiration 是否小于当前时间
    if (data.expiration && data.expiration < Date.now()) {
        return genResponse({ ok: false, msg: "expiration must be greater than the current time" }, 400);
    }
    // 设置默认值
    if (!data.expiration && !data.expirationTtl) {
        data.expirationTtl = 2592000; // 30 天
    }
    // 检查 expirationTtl 是否小于 60
    if (data.expirationTtl && data.expirationTtl < 60) {
        return genResponse({ ok: false, msg: "expirationTtl must be at least 60 seconds" }, 400);
    }

    // 准备更新数据
    const shortLink = data.short;
    let url = data.url;
    if (!url) {
        url = await context.env.kv.get(shortLink);
        if (!url) {
            return genResponse({ ok: false, msg: "Not Found" }, 404);
        }
    }

    // 更新数据
    const metadata = url.slice(0, 1022);
    // 判断是否设置了过期时间
    if (data.expiration) {
        await context.env.kv.put(shortLink, url, { expiration: data.expiration, metadata: metadata });
    }
    if (data.expirationTtl) {
        await context.env.kv.put(shortLink, url, { expirationTtl: data.expirationTtl, metadata: metadata });
    }

    // 返回结果
    return genResponse({ ok: true, msg: "Good" }, 200);
}

function genResponse(context: { ok: boolean, msg: string, data?: { short: string } }, status: number) {
    return new Response(JSON.stringify(context), {
        status: status,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        }
    });
}

const onRequestOptions = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'PUT',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'PUT',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}

export { onRequestPut, onRequestOptions };