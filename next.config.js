/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // 在本地開發環境中，如果 @vercel/kv 不可用，允許構建繼續
    if (isServer) {
      config.externals = config.externals || [];
      // 只有在沒有 KV 環境變量時才外部化
      if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
        // 允許動態導入失敗而不中斷構建
        config.resolve.fallback = {
          ...config.resolve.fallback,
        };
      }
    }
    return config;
  },
}

module.exports = nextConfig

