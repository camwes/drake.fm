import type { NextConfig } from "next";
import path from "path";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repoName = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "drake.fm";
const basePath = isGitHubActions ? `/${repoName}` : "";

// Pin Turbopack's workspace root to the dock monorepo root so it sees both
// drake-fm and the shared @drake/ui package. Without an explicit root,
// Turbopack guesses (and gets it wrong in a pnpm workspace).
const dockRoot = path.resolve(process.cwd(), "..", "..");

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: basePath,
  turbopack: { root: dockRoot },
};

export default nextConfig;
