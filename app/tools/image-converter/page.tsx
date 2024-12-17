'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface PreviewImage {
  url: string;
  size: number;
  width: number;
  height: number;
}

interface WindowWithImage extends Window {
  Image: {
    new(): HTMLImageElement;
  }
}

export default function ImageConverter() {
  const [originalImage, setOriginalImage] = useState<PreviewImage | null>(null);
  const [convertedImage, setConvertedImage] = useState<PreviewImage | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>('webp');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);

  const processImage = useCallback(async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const img = new ((window as WindowWithImage).Image)();
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

  const convertImage = useCallback(async () => {
    if (!currentFile) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', currentFile);
      formData.append('operation', 'convert');
      formData.append('outputFormat', outputFormat);

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to convert image');

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to process image');
      }

      const img = new ((window as WindowWithImage).Image)();
      img.onload = () => {
        setConvertedImage({
          url: result.processedImage,
          size: result.processedSize,
          width: img.width,
          height: img.height,
        });
      };
      img.src = result.processedImage;
    } catch (error) {
      console.error('Error converting image:', error);
      alert('Failed to convert image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [currentFile, outputFormat]);

  const downloadConvertedImage = useCallback(() => {
    if (!convertedImage) return;

    const link = document.createElement('a');
    link.href = convertedImage.url;
    link.download = `converted-image.${outputFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [convertedImage, outputFormat]);

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Image Converter</h1>
        
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
                <p className="text-gray-600">Output Format:</p>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="border rounded px-3 py-1"
                >
                  <option value="webp">WebP</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="avif">AVIF</option>
                </select>
              </div>
              <button
                onClick={convertImage}
                disabled={isProcessing}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
              >
                {isProcessing ? 'Processing...' : 'Convert Image'}
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

            {/* Converted Image */}
            {convertedImage && (
              <div className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Converted</h2>
                <div className="relative aspect-video mb-4">
                  <Image
                    src={convertedImage.url}
                    alt="Converted"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Size: {(convertedImage.size / 1024).toFixed(2)} KB
                  <br />
                  Dimensions: {convertedImage.width} x {convertedImage.height}
                </p>
                <button
                  onClick={downloadConvertedImage}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Download Converted Image
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
