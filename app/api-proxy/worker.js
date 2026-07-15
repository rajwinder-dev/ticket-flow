export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const backendOrigin = "https://ticketflow-api.devtiven.com"; // 👈 set this

    if (url.pathname.startsWith("/api")) {
      return proxyToBackend(request, backendOrigin, { cors: true });
    }

    if (url.pathname.startsWith("/webhooks/")) {
      return proxyToBackend(request, backendOrigin, { cors: false });
    }
    return proxyToBackend(request, backendOrigin, {cors: false});
  },
};

async function proxyToBackend(request, backendOrigin, { cors }) {
  const url = new URL(request.url);
  const targetUrl = backendOrigin + url.pathname + url.search;

  const newHeaders = new Headers(request.headers);
  newHeaders.set("Host", new URL(backendOrigin).host);
  newHeaders.set("X-Forwarded-Proto", url.protocol.replace(":", ""));
  newHeaders.set("X-Real-IP", request.headers.get("CF-Connecting-IP") || "");

  // Handle CORS preflight without hitting the backend
  if (cors && request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  const modifiedRequest = new Request(targetUrl, {
    method: request.method,
    headers: newHeaders,
    body: ["GET", "HEAD"].includes(request.method) ? null : request.body,
    redirect: "follow",
  });

  try {
    const response = await fetch(modifiedRequest);
    const newResponse = new Response(response.body, response);

    if (cors) {
      newResponse.headers.set("Access-Control-Allow-Origin", "*");
      newResponse.headers.set("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
      newResponse.headers.set("Access-Control-Allow-Headers", "*");
    }

    return newResponse;
  } catch (err) {
    return new Response("Proxy error: " + err.message, { status: 502 });
  }
}
