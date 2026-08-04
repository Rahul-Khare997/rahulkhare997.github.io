/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static HTML export — required for GitHub Pages, which serves files only.
  output: 'export',
  // The default image loader needs a server; Pages has none.
  images: { unoptimized: true },
  // Emit `about/index.html` rather than `about.html` so Pages resolves
  // extensionless URLs consistently.
  trailingSlash: true,
};

export default nextConfig;
