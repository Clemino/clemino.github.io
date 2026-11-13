/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // Each course is published under clemino.github.io/<course>/; pnpm dev stays at the root.
  basePath: process.env.NODE_ENV === "production" ? `/${process.env.COURSE ?? "admin"}` : undefined,
  trailingSlash: true,
}

export default nextConfig
