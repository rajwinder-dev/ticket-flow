export interface Env {
  API_URL: string;
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // If the path starts with /api, proxy it to the target backend API
    if (url.pathname.startsWith('/api')) 
      const targetUrl = `${env.API_URL}${url.pathname}${url.search}`;
      
      // Clone the request with the new URL target
      const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        body: request.body,
        redirect: 'manual'
      });

      try {
        return await fetch(proxyRequest);
      } catch (error) {
        return new Response('Proxy Error', { status: 502 });
      }
    }

    // Default Fallback
    return new Response('Proxy is running. Forward requests through /api', { status: 200 });
  },
};
