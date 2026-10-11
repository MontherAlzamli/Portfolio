'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Check } from 'lucide-react';
import Swal from 'sweetalert2';
import logger from '@/lib/logger';

interface ImageUploadProps {
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string;
  folder?: string;
  className?: string;
  showPreview?: boolean;
}

export default function ImageUpload({
  onImageSelect,
  currentImage,
  folder = 'portfolio',
  className = '',
  showPreview = true,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
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
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      // Simulate progress (in real implementation, you'd track actual upload progress)
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

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

        onImageSelect(result.data.secure_url);
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
      setUploadProgress(0);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleRemoveImage = () => {
    Swal.fire({
      title: 'Remove Image?',
      text: 'Are you sure you want to remove this image?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, remove it!',
      cancelButtonText: 'Cancel',
      color: '#e2e8f0',
      background: '#1e293b',
    }).then(result => {
      if (result.isConfirmed) {
        onImageSelect('');
      }
    });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Current Image Preview */}
      {currentImage && showPreview && (
        <div className="relative">
          <div className="aspect-video bg-background-primary rounded-lg overflow-hidden border border-border-primary">
            <img
              src={currentImage}
              alt="Current"
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={handleRemoveImage}
            className="absolute top-2 right-2 p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive
            ? 'border-primary-400 bg-primary-400/10'
            : 'border-border-primary hover:border-primary-400'
        } ${uploading ? 'pointer-events-none opacity-50' : 'cursor-pointer'}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {uploading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-400 border-t-transparent mx-auto mb-4"></div>
            <div className="text-text-primary font-medium mb-2">
              Uploading...
            </div>
            <div className="w-full bg-background-primary rounded-full h-2 mb-2">
              <div
                className="bg-primary-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
            <div className="text-sm text-text-secondary">{uploadProgress}%</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="flex justify-center mb-4">
              {currentImage ? (
                <Check className="h-8 w-8 text-green-400" />
              ) : (
                <Upload className="h-8 w-8 text-text-secondary" />
              )}
            </div>
            <div className="text-text-primary font-medium mb-2">
              {currentImage ? 'Image uploaded successfully' : 'Upload Image'}
            </div>
            <div className="text-sm text-text-secondary mb-4">
              {currentImage
                ? 'Click to upload a different image'
                : 'Drag and drop or click to select'}
            </div>
            <div className="text-xs text-text-secondary">
              Supports: JPG, PNG, GIF, WebP • Max 4MB
            </div>
          </div>
        )}
      </div>

      {/* Upload Button Alternative */}
      {!currentImage && !uploading && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center px-4 py-3 bg-primary-400 text-white rounded-lg hover:bg-primary-500 transition-colors"
        >
          <ImageIcon className="h-5 w-5 mr-2" />
          Choose Image
        </button>
      )}
    </div>
  );
}
