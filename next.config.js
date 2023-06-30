/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["xsgames.co", "arweave.net", "ipfs.io", "lens.infura-ipfs.io", "test.com"],
    
  },
  eslint: {
    ignoreDuringBuilds:true
  },
  typescript: {
    ignoreBuildErrors:true
  }
};

module.exports = nextConfig
