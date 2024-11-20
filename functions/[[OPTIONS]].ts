export const onRequestOptions = async () => {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '86400'
        }
    });
}