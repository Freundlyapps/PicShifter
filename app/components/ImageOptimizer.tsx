'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface PreviewImage {
  url: string;
  size: number;
  width: number;
  height: number;
}

export default function ImageOptimizer() {
  const [originalImage, setOriginalImage] = useState<PreviewImage | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<PreviewImage | null>(null);
  const [quality, setQuality] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const processImage = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new (window as any).Image() as HTMLImageElement;
      img.onload = () => {
        setOriginalImage({
          url: event.target?.result as string,
          size: file.size,
          width: img.width,
          height: img.height,
        });
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    setCurrentFile(file);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith('image/')) {
      alert('Please drop an image file (JPEG, PNG, WebP, or AVIF)');
      return;
    }

    await processImage(file);
  }, [processImage]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await processImage(file);
  }, [processImage]);

  const optimizeImage = useCallback(async () => {
    if (!currentFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('operation', 'optimize');
      formData.append('quality', quality.toString());
      formData.append('outputFormat', 'webp');

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to optimize image');

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process image');
      }

      const img = new (window as any).Image() as HTMLImageElement;
      img.onload = () => {
        setOptimizedImage({
          url: result.processedImage,
          size: result.processedSize,
          width: img.width,
          height: img.height,
        });
      };
      img.src = result.processedImage;
    } catch (error) {
      console.error('Error optimizing image:', error);
      alert('Failed to optimize image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [currentFile, quality]);

  const downloadOptimizedImage = useCallback(() => {
    if (!optimizedImage) return;

    const link = document.createElement('a');
    link.href = optimizedImage.url;
    link.download = 'optimized-image.webp';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [optimizedImage]);

  return (
    <div className="max-w-6xl mx-auto">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${!originalImage ? 'cursor-pointer' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!originalImage ? (
          <div>
            <p className="text-gray-600 mb-4">Drag and drop an image here, or</p>
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Quality: {quality}%</p>
              <input
                type="range"
                min="1"
                max="100"
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-64"
              />
            </div>
            <button
              onClick={optimizeImage}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Optimize Image'}
            </button>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {originalImage && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Original Image */}
          <div className="border rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">Original</h2>
            <div className="relative aspect-video mb-4">
              <Image
                src={originalImage.url}
                alt="Original"
                fill
                className="object-contain"
              />
            </div>
            <p className="text-sm text-gray-600">
              Size: {(originalImage.size / 1024).toFixed(2)} KB
              <br />
              Dimensions: {originalImage.width} x {originalImage.height}
            </p>
          </div>

          {/* Optimized Image */}
          {optimizedImage && (
            <div className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-4">Optimized</h2>
              <div className="relative aspect-video mb-4">
                <Image
                  src={optimizedImage.url}
                  alt="Optimized"
                  fill
                  className="object-contain"
                />
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Size: {(optimizedImage.size / 1024).toFixed(2)} KB
                <br />
                Dimensions: {optimizedImage.width} x {optimizedImage.height}
              </p>
              <button
                onClick={downloadOptimizedImage}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download Optimized Image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
