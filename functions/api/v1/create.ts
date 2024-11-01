interface Env {
    TOKEN: string;
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
    const request = context.request;
    const env = context.env;

    // Check if the request has a valid token
    if (request.headers.get('Authorization') || '' != env.TOKEN) {
        return new Response(JSON.stringify({
            ok: false,
            error: "Forbidden"
        }), {
            status: 403,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Check if the request has a valid JSON body
    const data: Data = await request.json();
    if (!data) {
        return new Response(JSON.stringify({
            ok: false,
            error: "Bad Request",
            message: "Invalid option field"
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Check for invalid option field in the request data
    const validOptions = ['url', 'length', 'number', 'capital', 'lowercase', 'expiration', 'expirationTtl'];
    const invalidOptions = Object.keys(data).filter(key => !validOptions.includes(key));

    if (invalidOptions.length > 0) {
        return new Response(JSON.stringify({
            ok: false,
            error: "Bad Request",
            message: "Invalid option field"
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Validate required fields and default values
    if (!data.url || !/^https?:\/\//.test(data.url)) {
        return new Response(JSON.stringify({
            ok: false,
            error: "Bad Request",
            message: "The 'url' field is required and must include the protocol (http:// or https://)"
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    data.length = data.length || 6;
    data.number = data.number !== undefined ? data.number : true;
    data.capital = data.capital !== undefined ? data.capital : true;
    data.lowercase = data.lowercase !== undefined ? data.lowercase : true;

    if (!data.expiration && !data.expirationTtl) {
        data.expirationTtl = 2592000; // 30 days
    }

    if (data.expirationTtl && data.expirationTtl < 60) {
        return new Response(JSON.stringify({
            ok: false,
            error: "Bad Request",
            message: "'expirationTtl' must be at least 60 seconds"
        }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }

    // Create the short link
    let characters = '';
    if (data.lowercase) characters += 'abcdefghijklmnopqrstuvwxyz';
    if (data.capital) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (data.number) characters += '0123456789';

    let shortLink = '';
    let attempts = 0;

    while (attempts < 3) {
        shortLink = '';

        for (let i = 0; i < (data.length || 6); i++) {
            shortLink += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        let prefix = shortLink.substring(0, 1);
        if (['P', 'p'].includes(prefix)) {
            attempts++;
            continue;
        }

        prefix = shortLink.substring(0, 2);
        if (['AV', 'BV', 'YT', 'av', 'bv', 'yt'].includes(prefix)) {
            attempts++;
            continue;
        }

        const existingValue = await env.kv.get(shortLink, 'text');
        if (!existingValue) {
            if (data.expiration) {
                await env.kv.put(shortLink, data.url, {
                    "expiration": data.expiration
                });
            } else {
                await env.kv.put(shortLink, data.url, {
                    "expirationTtl": data.expirationTtl
                });
            }

            // If lowercase is false and capital is true, convert the domain to uppercase
            const domain = (data.lowercase === false && data.capital === true) ? 'B0.BY/' : 'b0.by/';
            shortLink = domain + shortLink;
            break;
        }
        attempts++;
    }

    return new Response(JSON.stringify({
        ok: true,
        shortLink: shortLink
    }), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });

}