interface Env {
    tokens: string;
    kv: KVNamespace;
    domain: string;
}

interface Data {
    url?: string;
    length?: number;
    number?: boolean;
    capital?: boolean;
    lowercase?: boolean;
    expiration?: number;
    expirationTtl?: number;
}

export const onRequestPost = async (context: { request: Request, env: Env }) => {
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
    if (!data.url || !/^https?:\/\//.test(data.url)) {
        console.log('URL 不合法');
        return genResponse({ ok: false, msg: "Invalid URL" }, 400);
    }
    console.log('URL 合法');
    // 规范化数据
    data.length = data.length ?? 6;
    data.number = data.number ?? true;
    data.capital = data.capital ?? true;
    data.lowercase = data.lowercase ?? true;
    // 检查 expiration 和 expirationTtl 是否同时存在
    if (data.expiration && data.expirationTtl) {
        return genResponse({ ok: false, msg: "Provide either expiration or expirationTtl, not both" }, 400);
    }
    // 设置默认值
    if (!data.expiration && !data.expirationTtl) {
        data.expirationTtl = 2592000; // 30 天
    }
    // 检查 expirationTtl 是否小于 60
    if (data.expirationTtl && data.expirationTtl < 60) {
        return genResponse({ ok: false, msg: "expirationTtl must be at least 60 seconds" }, 400);
    }

    // 生成合法的随机字符串
    let caracteres = '';
    if (data.number) caracteres += '0123456789';
    if (data.capital) caracteres += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (data.lowercase) caracteres += 'abcdefghijklmnopqrstuvwxyz';
    let shortLink = '';
    while (true) {
        shortLink += caracteres[Math.floor(Math.random() * caracteres.length)];
        // 检查是否达到指定长度
        if (shortLink.length < data.length) continue;
        // 检查前缀是否合法
        let prefix = shortLink.slice(0, 1).toLowerCase();
        if (prefix === 'p') {
            shortLink = '';
            continue;
        }
        prefix = shortLink.slice(0, 2).toLowerCase();
        if (prefix === 'av' || prefix === 'bv' || prefix === 'cv' || prefix === 'yt') {
            shortLink = '';
            continue;
        }
        // 检查是否已存在
        if (await context.env.kv.get(shortLink)) continue;
        break;
    }

    // 存储数据
    const metadata = { url: data.url.slice(0, 992) };
    // 判断是否设置了过期时间
    if (data.expiration) {
        await context.env.kv.put(shortLink, data.url, { expiration: data.expiration, metadata: metadata });
    }
    if (data.expirationTtl) {
        await context.env.kv.put(shortLink, data.url, { expirationTtl: data.expirationTtl, metadata: metadata });
    }

    // 返回结果
    let domain = context.env.domain;
    if (data.lowercase === false && data.capital === true) {
        domain = domain.toUpperCase();
    }
    const shortUrl = `${domain}/${shortLink}`;

    return genResponse({ ok: true, msg: "Good", data: { short: shortUrl } }, 200);
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