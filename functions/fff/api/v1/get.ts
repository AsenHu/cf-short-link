interface Env {
    kv: KVNamespace;
}

const onRequestGet = async (context: { request: Request, env: Env }) => {
    // 从 URL 中获取查询参数 q 的值
    const q = new URL(context.request.url).searchParams.get('q');
    console.log(q);

    // 检查 q 是否存在
    if (!q) {
        return genResponse({ ok: false, msg: "Provide q" }, 400);
    }

    // 检查前缀是否是 p
    let prefix = q?.slice(0, 1).toLowerCase();
    if (prefix === 'p') {
        // 如果是 p，返回 https://asen.page/ + p 后面的部分
        return genResponse({ ok: true, msg: "Good", data: { url: 'https://asen.page/' + q.slice(1) + '/' } }, 200);
    }

    // 检查前缀是否是 av
    prefix = q?.slice(0, 2).toLowerCase();
    if (prefix === 'av') {
        // 如果是 av，返回 https://www.bilibili.com/video/
        return genResponse({ ok: true, msg: "Good", data: { url: 'https://www.bilibili.com/video/av' + q.slice(2) + '/' } }, 200);
    }

    // 检查前缀是否是 bv
    if (prefix === 'bv') {
        // 如果是 bv，返回 https://www.bilibili.com/video/BV
        return genResponse({ ok: true, msg: "Good", data: { url: 'https://www.bilibili.com/video/BV' + q.slice(2) + '/' } }, 200);
    }

    // 检查前缀是否是 cv
    if (prefix === 'cv') {
        // 如果是 cv，返回 https://www.bilibili.com/read/cv
        return genResponse({ ok: true, msg: "Good", data: { url: 'https://www.bilibili.com/read/cv' + q.slice(2) + '/' } }, 200);
    }

    // 检查前缀是否是 yt
    if (prefix === 'yt') {
        // 如果是 yt，返回 https://www.youtube.com/watch?v=
        return genResponse({ ok: true, msg: "Good", data: { url: 'https://www.youtube.com/watch?v=' + q.slice(2) } }, 200);
    }

    // 正常重定向
    const link = await context.env.kv.get(q);
    if (link) {
        return genResponse({ ok: true, msg: "Good", data: { url: link } }, 200);
    }

    return genResponse({ ok: false, msg: "Not Found" }, 404);
}

function genResponse(context: { ok: boolean, msg: string, data?: { url: string } }, status: number) {
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
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}

export { onRequestGet, onRequestOptions };