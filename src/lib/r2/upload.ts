import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

// ===========================================
// R2 Client Configuration
// ===========================================

function getR2Client(): S3Client {
  const endpoint = process.env.R2_ENDPOINT;
  
  if (!endpoint) {
    throw new Error("R2_ENDPOINT is not configured");
  }
  
  return new S3Client({
    region: "auto",
    endpoint: endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

// ===========================================
// Upload Functions
// ===========================================

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  file: Buffer,
  key: string,
  contentType: string
): Promise<string> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME!;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await client.send(command);

  // Return the public URL
  const publicUrl = process.env.R2_PUBLIC_URL;
  return `${publicUrl}/${key}`;
}

/**
 * Upload an audio file (MP3)
 */
export async function uploadAudioFile(
  file: Buffer,
  filename: string
): Promise<{ fileKey: string; url: string }> {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileKey = `audio/${timestamp}-${sanitizedFilename}`;

  const url = await uploadToR2(file, fileKey, "audio/mpeg");

  return { fileKey, url };
}

/**
 * Upload a cover image
 */
export async function uploadCoverImage(
  file: Buffer,
  filename: string,
  contentType: string = "image/jpeg"
): Promise<{ fileKey: string; url: string }> {
  const timestamp = Date.now();
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_");
  const fileKey = `covers/${timestamp}-${sanitizedFilename}`;

  const url = await uploadToR2(file, fileKey, contentType);

  return { fileKey, url };
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(key: string): Promise<void> {
  const client = getR2Client();
  const bucket = process.env.R2_BUCKET_NAME!;

  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  await client.send(command);
}

/**
 * Generate a presigned URL for direct upload (optional - for client-side uploads)
 */
export function getPublicUrl(fileKey: string): string {
  const publicUrl = process.env.R2_PUBLIC_URL || process.env.NEXT_PUBLIC_R2_PUBLIC_URL;
  return `${publicUrl}/${fileKey}`;
}
