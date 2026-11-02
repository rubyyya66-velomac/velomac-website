import sharp from "sharp";

export const maxAdminImageBytes = 5 * 1024 * 1024;

export class AdminImageValidationError extends Error {}

export async function validateAdminRasterImage(filename: string, mime: string, bytes: Buffer) {
  if (!bytes.length || bytes.length > maxAdminImageBytes) throw new AdminImageValidationError("Choose a non-empty image under 5 MB.");
  const extension = filename.toLowerCase().match(/\.(jpe?g|png|webp)$/)?.[1];
  const expected = extension === "jpg" || extension === "jpeg" ? "jpeg" : extension;
  if (!expected || mime !== `image/${expected}`) throw new AdminImageValidationError("The file type must match a JPG, JPEG, PNG or WebP image.");
  try {
    const image = sharp(bytes, {limitInputPixels: 40_000_000, failOn: "warning"});
    const metadata = await image.metadata();
    if (metadata.format !== expected || !metadata.width || !metadata.height) throw new Error("Format mismatch");
    if ((metadata.pages || 1) > 1) throw new AdminImageValidationError("Please use a still image rather than an animated or multi-page image.");
    // Decode to reject corrupt/truncated files; preserve the original full-quality bytes in storage.
    await image.clone().resize({width: 1, height: 1, fit: "inside"}).toBuffer();
    return { width: metadata.autoOrient?.width || metadata.width, height: metadata.autoOrient?.height || metadata.height };
  } catch (error) {
    if (error instanceof AdminImageValidationError) throw error;
    throw new AdminImageValidationError("Image could not be decoded. Choose a valid still JPG, PNG or WebP image with no more than 40 megapixels.");
  }
}
