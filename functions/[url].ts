interface Env {
    kv: KVNamespace;
}

export const onRequestGet = async (context: { request: Request, env: Env }) => {
    const url = new URL(context.request.url).pathname.replace(/^\//, '');
    console.log(url);

    // 检查前缀是否是 p
    let prefix = url.slice(0, 1).toLowerCase();
    if (prefix === 'p') {
        // 如果是 p，重定向到 https://asen.page/ + p 后面的部分
        return Response.redirect('https://asen.page/' + url.slice(1) + '/', 301);
    }

    // 检查前缀是否是 av
    prefix = url.slice(0, 2).toLowerCase();
    if (prefix === 'av') {
        // 如果是 av，重定向到 https://www.bilibili.com/video/av + url 后面的部分
        return Response.redirect('https://www.bilibili.com/video/av' + url.slice(2) + '/', 301);
    }

    // 检查前缀是否是 bv
    if (prefix === 'bv') {
        // 如果是 bv，重定向到 https://www.bilibili.com/video/BV + url 后面的部分
        return Response.redirect('https://www.bilibili.com/video/BV' + url.slice(2) + '/', 301);
    }

    // 检查前缀是否是 cv
    if (prefix === 'cv') {
        // 如果是 cv，重定向到 https://www.bilibili.com/read/cv + url 后面的部分
        return Response.redirect('https://www.bilibili.com/read/cv' + url.slice(2) + '/', 301);
    }

    // 检查前缀是否是 yt
    if (prefix === 'yt') {
        // 如果是 yt，重定向到 https://www.youtube.com/watch?v= + url 后面的部分
        return Response.redirect('https://www.youtube.com/watch?v=' + url.slice(2), 301);
    }

    // 正常重定向
    const link = await context.env.kv.get(url, { cacheTtl: 3600 });
    if (link) {
        return Response.redirect(link, 301);
    }

    return new Response(JSON.stringify({ ok: false, msg: "Not Found" }), {
        status: 404
    });
}