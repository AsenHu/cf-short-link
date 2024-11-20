interface Env {
    tokens: string;
    kv: KVNamespace;
}

interface Data {
    short?: string;
}

const onRequestDelete = async (context: { request: Request, env: Env }) => {
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
    // 检查 short 是否存在
    if (!data.short) {
        console.log('short 不存在');
        return genResponse({ ok: false, msg: "Provide short" }, 400);
    }
    console.log('short 存在');

    // 删除数据
    await context.env.kv.delete(data.short);

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
            'Allow': 'DELETE',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}

export { onRequestDelete, onRequestOptions };