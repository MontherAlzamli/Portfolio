'use client';

import { useState, useEffect } from 'react';
import { X, Upload, Trash2, Eye, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import logger from '@/lib/logger';

interface ImageData {
  public_id: string;
  secure_url: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

interface ImageGalleryProps {
  folder?: string;
  onImageSelect?: (imageUrl: string) => void;
  onImageDelete?: (publicId: string) => void;
  showUpload?: boolean;
  showDelete?: boolean;
  maxImages?: number;
}

export default function ImageGallery({
  folder = 'portfolio',
  onImageSelect,
  onImageDelete,
  showUpload = true,
  showDelete = true,
  maxImages = 20,
}: ImageGalleryProps) {
  const [images, setImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);

  // Fetch images from Cloudinary
  useEffect(() => {
    fetchImages();
  }, [folder]);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/images?folder=${folder}&maxResults=${maxImages}`
      );
      const result = await response.json();

      if (result.success) {
        setImages(result.data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      logger.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      Swal.fire({
        title: 'Invalid File Type!',
        text: 'Please select an image file.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    // Validate file size (4MB limit, Vercel rejects request bodies over 4.5MB)
    if (file.size > 4 * 1024 * 1024) {
      Swal.fire({
        title: 'File Too Large!',
        text: 'Please select an image smaller than 4MB.',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
      return;
    }

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        Swal.fire({
          title: 'Success!',
          text: 'Image uploaded successfully!',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6',
        });

        // Add new image to the list
        setImages(prev => [result.data, ...prev]);

        // Trigger callback if provided
        if (onImageSelect) {
          onImageSelect(result.data.secure_url);
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      logger.error('Upload error:', error);
      Swal.fire({
        title: 'Upload Failed!',
        text: error instanceof Error ? error.message : 'Failed to upload image',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
    } finally {
      setUploading(false);
      // Reset file input
      event.target.value = '';
    }
  };

  const handleDeleteImage = async (publicId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      color: '#e2e8f0',
      background: '#1e293b',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/upload?publicId=${publicId}`, {
        method: 'DELETE',
      });

      const deleteResult = await response.json();

      if (deleteResult.success) {
        Swal.fire({
          title: 'Deleted!',
          text: 'Image has been deleted.',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          color: '#e2e8f0',
          background: '#1e293b',
          confirmButtonColor: '#3b82f6',
        });

        // Remove image from list
        setImages(prev => prev.filter(img => img.public_id !== publicId));

        // Trigger callback if provided
        if (onImageDelete) {
          onImageDelete(publicId);
        }
      } else {
        throw new Error(deleteResult.error);
      }
    } catch (error) {
      logger.error('Delete error:', error);
      Swal.fire({
        title: 'Delete Failed!',
        text: error instanceof Error ? error.message : 'Failed to delete image',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDownloadImage = async (image: ImageData) => {
    try {
      // Fetch the image as a blob
      const response = await fetch(image.secure_url);
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;

      // Generate filename from public_id and format
      const filename = `${image.public_id}.${image.format}`;
      link.download = filename;

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Show success message
      Swal.fire({
        title: 'Download Started!',
        text: 'Image download has started',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#3b82f6',
      });
    } catch (error) {
      logger.error('Download error:', error);
      Swal.fire({
        title: 'Download Failed!',
        text: 'Failed to download image',
        icon: 'error',
        color: '#e2e8f0',
        background: '#1e293b',
        confirmButtonColor: '#ef4444',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      {showUpload && (
        <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Upload New Image
          </h3>
          <div className="flex items-center space-x-4">
            <label className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading}
                className="hidden"
                id="image-upload"
              />
              <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-border-primary rounded-lg hover:border-primary-400 transition-colors cursor-pointer">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-400 border-t-transparent mb-2"></div>
                    <span className="text-text-secondary">Uploading...</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-text-secondary mb-2" />
                    <span className="text-text-secondary">
                      Click to upload image
                    </span>
                    <span className="text-xs text-text-secondary mt-1">
                      Max 4MB
                    </span>
                  </div>
                )}
              </div>
            </label>
          </div>
        </div>
      )}

      {/* Images Grid */}
      <div className="bg-background-secondary rounded-xl p-6 border border-border-primary">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Images ({images.length})
        </h3>

        {images.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-text-secondary mb-2">No images found</div>
            <div className="text-sm text-text-secondary">
              Upload your first image to get started
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div key={image.public_id} className="group relative">
                <div className="aspect-square bg-background-primary rounded-lg overflow-hidden border border-border-primary">
                  <img
                    src={image.secure_url}
                    alt={image.public_id}
                    className="w-full h-full object-cover"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedImage(image)}
                      className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                    >
                      <Eye className="h-4 w-4 text-white" />
                    </button>
                    {showDelete && (
                      <button
                        onClick={() => handleDeleteImage(image.public_id)}
                        className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDownloadImage(image)}
                      className="p-2 bg-primary-400/20 rounded-lg hover:bg-primary-400/30 transition-colors"
                    >
                      <Download className="h-4 w-4 text-white" />
                    </button>
                  </div>
                </div>

                {/* Image Info */}
                <div className="mt-2 text-xs text-text-secondary">
                  <div>
                    {image.width} × {image.height}
                  </div>
                  <div>{formatFileSize(image.bytes)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Preview Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-background-secondary rounded-xl max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-border-primary">
              <h3 className="text-lg font-semibold text-text-primary">
                Image Preview
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownloadImage(selectedImage)}
                  className="flex items-center px-3 py-2 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
                <button
                  onClick={() => setSelectedImage(null)}
                  className="p-2 hover:bg-background-primary rounded-lg transition-colors"
                >
                  <X className="h-5 w-5 text-text-secondary" />
                </button>
              </div>
            </div>
            <div className="p-4">
              <img
                src={selectedImage.secure_url}
                alt={selectedImage.public_id}
                className="max-w-full max-h-[70vh] object-contain mx-auto"
              />
              <div className="mt-4 text-sm text-text-secondary text-center">
                <div>
                  {selectedImage.width} × {selectedImage.height}
                </div>
                <div>
                  {formatFileSize(selectedImage.bytes)} •{' '}
                  {selectedImage.format.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
