import { v2 as cloudinary } from 'cloudinary';
import logger from '@/lib/logger';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to upload image with optimization
export const uploadImage = async (
  file: Buffer | string,
  options: {
    folder?: string;
    public_id?: string;
    transformation?: any;
  } = {}
) => {
  try {
    const uploadOptions: any = {
      folder: options.folder || 'portfolio',
      public_id: options.public_id,
      transformation: options.transformation || [
        {
          width: 1200,
          crop: 'fit',
          quality: 'auto',
          format: 'auto',
        },
      ],
      resource_type: 'auto',
    };

    let result;

    // Handle Buffer uploads (from file uploads)
    if (Buffer.isBuffer(file)) {
      // Use upload_stream for buffer uploads
      result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );
        uploadStream.end(file);
      });
    } else {
      // Handle string uploads (from URLs)
      result = await cloudinary.uploader.upload(file, uploadOptions);
    }

    return {
      success: true,
      data: {
        public_id: (result as any).public_id,
        secure_url: (result as any).secure_url,
        width: (result as any).width,
        height: (result as any).height,
        format: (result as any).format,
        bytes: (result as any).bytes,
      },
    };
  } catch (error) {
    logger.error('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
};

// Helper function to delete image
export const deleteImage = async (publicId: string) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: result.result === 'ok',
      data: result,
    };
  } catch (error) {
    logger.error('Cloudinary delete error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed',
    };
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (
  publicId: string,
  options: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string;
    format?: string;
  } = {}
) => {
  return cloudinary.url(publicId, {
    width: options.width,
    height: options.height,
    crop: options.crop || 'fit',
    quality: options.quality || 'auto',
    format: options.format || 'auto',
  });
};

// Helper function to get image info
export const getImageInfo = async (publicId: string) => {
  try {
    const result = await cloudinary.api.resource(publicId);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    logger.error('Cloudinary get info error:', error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to get image info',
    };
  }
};
