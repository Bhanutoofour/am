import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const region = process.env.AWS_S3_REGION || process.env.AWS_REGION || "";
const bucket = process.env.AWS_S3_BUCKET || "";
const publicBaseUrl =
  process.env.NEXT_PUBLIC_CDN_URL || process.env.AWS_S3_PUBLIC_URL || "";

export function assertS3UploadConfig() {
  const missing = [
    !region && "AWS_S3_REGION",
    !bucket && "AWS_S3_BUCKET",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(`Missing S3 upload configuration: ${missing.join(", ")}`);
  }
}

export function buildS3PublicUrl(key: string) {
  const normalizedKey = key.replace(/^\/+/, "");

  if (publicBaseUrl) {
    return `${publicBaseUrl.replace(/\/+$/, "")}/${normalizedKey}`;
  }

  return `https://${bucket}.s3.${region}.amazonaws.com/${normalizedKey}`;
}

export function createS3Client() {
  assertS3UploadConfig();

  return new S3Client({
    region,
    credentials:
      process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
}

export async function uploadFileToS3({
  file,
  key,
}: {
  file: File;
  key: string;
}) {
  const client = createS3Client();
  const bytes = await file.arrayBuffer();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(bytes),
      ContentType: file.type || "application/octet-stream",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );

  return {
    key,
    url: buildS3PublicUrl(key),
  };
}
