import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export type UploadResult = {
  url: string;
  publicId: string;
  format: string;
  resourceType: string;
};

/**
 * Sube un Buffer o Stream a Cloudinary.
 * Para imágenes usa resource_type "image", para PDFs/docs usa "auto".
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder?: string;
    filename?: string;
    resourceType?: "image" | "video" | "raw" | "auto";
  } = {}
): Promise<UploadResult> {
  const { folder = "uploads", filename, resourceType = "auto" } = options;

  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
    };
    if (filename) {
      uploadOptions.public_id = `${folder}/${filename.replace(/\.[^/.]+$/, "")}`;
      delete uploadOptions.folder;
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error || !result) return reject(error ?? new Error("Upload failed"));
        resolve({
          url: result.secure_url,
          publicId: result.public_id,
          format: result.format,
          resourceType: result.resource_type,
        });
      }
    );
    stream.end(buffer);
  });
}

/**
 * Elimina un recurso de Cloudinary por su public_id.
 */
export async function deleteFromCloudinary(
  publicId: string,
  resourceType: "image" | "video" | "raw" | "auto" = "image"
): Promise<void> {
  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType === "auto" ? "image" : resourceType,
  });
}

export default cloudinary;
