const path = require("path");

/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: [],
  async rewrites() {
    return [
      {
        source: "/:path*",
        destination: process.env.NEXT_PUBLIC_API_ENDPOINT,
      },
    ];
  },
};
