/** @type {import('next').NextConfig} */
const nextConfig = {
  // El historial entre equipos estaba en la portada: los links viejos (/?a=river&b=boca) siguen funcionando.
  async redirects() {
    return [
      { source: "/", has: [{ type: "query", key: "a" }], destination: "/historiales", permanent: true },
      { source: "/", has: [{ type: "query", key: "b" }], destination: "/historiales", permanent: true },
    ];
  },
};

export default nextConfig;
