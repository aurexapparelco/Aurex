import type { NextConfig } from "next";

const s3Hostname =
  process.env.AWS_S3_BUCKET && process.env.AWS_REGION
    ? `${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com`
    : undefined;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      ...(s3Hostname
        ? [{ protocol: "https" as const, hostname: s3Hostname }]
        : []),
    ],
  },
};

export default nextConfig;
