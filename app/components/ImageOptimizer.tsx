'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import JSZip from 'jszip';

interface PreviewImage {
  url: string;
  size: number;
  width: number;
  height: number;
}

interface OptimizedImage {
  name: string;
  originalSize: number;
  optimizedSize: number;
  originalUrl: string;
  optimizedUrl: string;
}

export default function ImageOptimizer() {
  const [mode, setMode] = useState<'single' | 'bulk'>('single');
  const [originalImage, setOriginalImage] = useState<PreviewImage | null>(null);
  const [optimizedImage, setOptimizedImage] = useState<PreviewImage | null>(null);
  const [bulkImages, setBulkImages] = useState<OptimizedImage[]>([]);
  const [quality, setQuality] = useState(80);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [totalFiles, setTotalFiles] = useState(0);

  const processImage = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new window.Image();
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

  const processBulkImages = useCallback(async (files: File[]) => {
    setIsProcessing(true);
    setBulkImages([]);
    setProgress(0);

    try {
      const optimizedImages: OptimizedImage[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('operation', 'optimize');
        formData.append('quality', quality.toString());
        formData.append('outputFormat', 'webp');

        const response = await fetch('/api/process-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) continue;

        const result = await response.json();
        if (result.success) {
          optimizedImages.push({
            name: file.name,
            originalSize: result.originalSize,
            optimizedSize: result.processedSize,
            originalUrl: URL.createObjectURL(file),
            optimizedUrl: result.processedImage,
          });
        }

        setProgress(((i + 1) / files.length) * 100);
      }

      setBulkImages(optimizedImages);
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Failed to process some images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [quality]);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    if (mode === 'single') {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please drop an image file (JPEG, PNG, WebP, or AVIF)');
        return;
      }
      await processImage(file);
    } else {
      setTotalFiles(files.length);
      await processBulkImages(files);
    }
  }, [mode, processImage, processBulkImages]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (mode === 'single') {
      await processImage(files[0]);
    } else {
      setTotalFiles(files.length);
      await processBulkImages(files);
    }
  }, [mode, processImage, processBulkImages]);

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

      const img = new window.Image();
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

  const downloadOptimizedImage = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = `optimized-${filename}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadAllImages = useCallback(async () => {
    try {
      const zip = new JSZip();
      
      // Create a folder for the optimized images
      const folder = zip.folder("optimized-images");
      if (!folder) throw new Error("Failed to create zip folder");

      // Add each image to the zip file
      for (const image of bulkImages) {
        const response = await fetch(image.optimizedUrl);
        const blob = await response.blob();
        folder.file(`optimized-${image.name}`, blob);
      }

      // Generate and download the zip file
      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = "optimized-images.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error creating zip file:', error);
      alert('Failed to create zip file. Please try again.');
    }
  }, [bulkImages]);

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Mode Toggle */}
      <div className="flex justify-center space-x-4 mb-8">
        <button
          onClick={() => {
            setMode('single');
            setBulkImages([]);
            setOriginalImage(null);
            setOptimizedImage(null);
          }}
          className={`px-4 py-2 rounded-lg ${
            mode === 'single'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Single Image
        </button>
        <button
          onClick={() => {
            setMode('bulk');
            setOriginalImage(null);
            setOptimizedImage(null);
          }}
          className={`px-4 py-2 rounded-lg ${
            mode === 'bulk'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Bulk Optimize
        </button>
      </div>

      {/* Quality Slider */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <label className="text-gray-700">Quality: {quality}%</label>
          <input
            type="range"
            min="1"
            max="100"
            value={quality}
            onChange={(e) => setQuality(Number(e.target.value))}
            className="w-64"
          />
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${!originalImage && bulkImages.length === 0 ? 'cursor-pointer' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {!originalImage && bulkImages.length === 0 ? (
          <div>
            <p className="text-gray-600 mb-4">
              Drag and drop {mode === 'bulk' ? 'images' : 'an image'} here, or
            </p>
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/*"
                multiple={mode === 'bulk'}
                onChange={handleFileChange}
              />
            </label>
          </div>
        ) : mode === 'single' ? (
          <div className="space-y-4">
            <button
              onClick={optimizeImage}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Optimize Image'}
            </button>
          </div>
        ) : null}
      </div>

      {/* Processing Progress */}
      {isProcessing && mode === 'bulk' && (
        <div className="mb-8">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-center mt-2 text-gray-600">
            Processing: {Math.round(progress)}% ({Math.ceil((progress / 100) * totalFiles)} of {totalFiles} files)
          </p>
        </div>
      )}

      {/* Single Image Preview */}
      {mode === 'single' && originalImage && (
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
                onClick={() => downloadOptimizedImage(optimizedImage.url, 'image.webp')}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Download Optimized Image
              </button>
            </div>
          )}
        </div>
      )}

      {/* Bulk Images Preview */}
      {mode === 'bulk' && bulkImages.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Optimized Images</h2>
            <button
              onClick={downloadAllImages}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Download All as ZIP
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bulkImages.map((image, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="relative aspect-video mb-4">
                  <Image
                    src={image.optimizedUrl}
                    alt={image.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-2">{image.name}</p>
                <p className="text-sm text-gray-600 mb-4">
                  Original: {(image.originalSize / 1024).toFixed(2)} KB
                  <br />
                  Optimized: {(image.optimizedSize / 1024).toFixed(2)} KB
                  <br />
                  Saved:{' '}
                  {(((image.originalSize - image.optimizedSize) / image.originalSize) * 100).toFixed(1)}%
                </p>
                <button
                  onClick={() => downloadOptimizedImage(image.optimizedUrl, image.name)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
