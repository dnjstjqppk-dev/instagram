export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    // Apply security headers
    const newHeaders = new Headers(response.headers);
    newHeaders.set("X-Frame-Options", "SAMEORIGIN");
    newHeaders.set("X-Content-Type-Options", "nosniff");
    newHeaders.set("Referrer-Policy", "strict-origin-when-cross-origin");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: newHeaders,
    });
  }
};

