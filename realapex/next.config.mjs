/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { webpack }) => {
    // Required by WalletConnect / wagmi.
    config.externals.push("pino-pretty", "lokijs", "encoding");
    // react-pdf pulls in `canvas` for Node — not needed in the browser bundle.
    config.resolve.alias.canvas = false;
    // RainbowKit's Base Account connector optionally imports @x402/* payment
    // modules we don't use; ignore that namespace so the bundle resolves.
    config.plugins.push(
      new webpack.IgnorePlugin({ resourceRegExp: /^@x402\// }),
    );
    return config;
  },
};

export default nextConfig;
