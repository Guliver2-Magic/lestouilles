import sharp from "sharp";

/**
 * Optimize image for web delivery
 * - Resize to max width/height while maintaining aspect ratio
 * - Convert to WebP format for better compression
 * - Apply quality compression
 */
export async function optimizeImage(
  imageBuffer: Buffer,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: "webp" | "jpeg" | "png";
  } = {}
): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 85,
    format = "webp",
  } = options;

  let pipeline = sharp(imageBuffer);

  // Get image metadata
  const metadata = await pipeline.metadata();

  // Resize if image is larger than max dimensions
  if (
    metadata.width &&
    metadata.height &&
    (metadata.width > maxWidth || metadata.height > maxHeight)
  ) {
    pipeline = pipeline.resize(maxWidth, maxHeight, {
      fit: "inside",
      withoutEnlargement: true,
    });
  }

  // Convert to specified format with quality
  if (format === "webp") {
    pipeline = pipeline.webp({ quality });
  } else if (format === "jpeg") {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true });
  } else if (format === "png") {
    pipeline = pipeline.png({ quality, compressionLevel: 9 });
  }

  const optimizedBuffer = await pipeline.toBuffer();

  const mimeTypes = {
    webp: "image/webp",
    jpeg: "image/jpeg",
    png: "image/png",
  };

  return {
    buffer: optimizedBuffer,
    mimeType: mimeTypes[format],
    ext: format,
  };
}

/**
 * Optimize product image specifically
 * - Fixed dimensions for product cards
 * - WebP format for best compression
 */
export async function optimizeProductImage(
  imageBuffer: Buffer
): Promise<{ buffer: Buffer; mimeType: string; ext: string }> {
  return optimizeImage(imageBuffer, {
    maxWidth: 800,
    maxHeight: 800,
    quality: 85,
    format: "webp",
  });
}
