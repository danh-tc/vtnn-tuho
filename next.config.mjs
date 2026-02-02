/** @type {import('next').NextConfig} */

const repoName = "vtnn-tuho";
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  basePath: isProd ? `/${String(repoName)}` : "",
  assetPrefix: isProd ? `/${String(repoName)}/` : "",
};

export default nextConfig;
