interface Env {
    tokens: string[];
    kv: KVNamespace;
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
    if (!token || !context.env.tokens.includes(token.replace('Bearer ', ''))) {
        return new Response(JSON.stringify({ ok: false, msg: "Forbidden" }), {
            status: 403
        });
    }

    // 规范用户输入
    const data: Data = await context.request.json();
    // 检查 URL 是否合法
    if (!data.url || !/^https?:\/\//.test(data.url)) {
        return new Response(JSON.stringify({ ok: false, msg: "Invalid URL" }), {
            status: 400
        });
    }
    // 规范化数据
    data.length = data.length ?? 6;
    data.number = data.number ?? true;
    data.capital = data.capital ?? true;
    data.lowercase = data.lowercase ?? true;
    // 检查 expiration 和 expirationTtl 是否同时存在
    if (data.expiration && data.expirationTtl) {
        return new Response(JSON.stringify({ ok: false, msg: "Provide either expiration or expirationTtl, not both" }), {
            status: 400
        });
    }
    // 设置默认值
    if (!data.expiration && !data.expirationTtl) {
        data.expirationTtl = 2592000; // 30 天
    }
    // 检查 expirationTtl 是否小于 60
    if (data.expirationTtl && data.expirationTtl < 60) {
        return new Response(JSON.stringify({ ok: false, msg: "expirationTtl must be at least 60 seconds" }), {
            status: 400
        });
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
    // 判断是否设置了过期时间
    if (data.expiration) {
        await context.env.kv.put(shortLink, data.url, { expiration: data.expiration });
    }
    if (data.expirationTtl) {
        await context.env.kv.put(shortLink, data.url, { expirationTtl: data.expirationTtl });
    }

    // 返回结果
    const domain = data.lowercase === false && data.capital === true ? 'B0.BY' : 'b0.by';
    const shortUrl = `${domain}/${shortLink}`;

    return new Response(JSON.stringify({
        ok: true,
        msg: "Good",
        data: {
            short: shortUrl
        }
    }), {
        status: 200
    });
}