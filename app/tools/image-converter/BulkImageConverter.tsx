'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';

interface PreviewImage {
  url: string;
  size: number;
  width: number;
  height: number;
  name: string;
}

interface WindowWithImage extends Window {
  Image: {
    new(): HTMLImageElement;
  }
}

export default function BulkImageConverter() {
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [convertedImages, setConvertedImages] = useState<PreviewImage[]>([]);
  const [outputFormat, setOutputFormat] = useState<string>('webp');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFiles, setCurrentFiles] = useState<File[]>([]);

  const processImage = useCallback(async (file: File): Promise<PreviewImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const img = new ((window as WindowWithImage).Image)();
        img.onload = () => {
          resolve({
            url: event.target?.result as string,
            size: file.size,
            width: img.width,
            height: img.height,
            name: file.name
          });
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    if (files.length === 0) {
      alert('Please drop image files (JPEG, PNG, WebP, or AVIF)');
      return;
    }

    const processedImages = await Promise.all(files.map(processImage));
    setImages(processedImages);
    setCurrentFiles(files);
  }, [processImage]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const processedImages = await Promise.all(files.map(processImage));
    setImages(processedImages);
    setCurrentFiles(files);
  }, [processImage]);

  const convertImages = useCallback(async () => {
    if (currentFiles.length === 0) return;

    setIsProcessing(true);
    const convertedResults: PreviewImage[] = [];

    try {
      for (const file of currentFiles) {
        const formData = new FormData();
        formData.append('file', file);
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
        await new Promise<void>((resolve) => {
          img.onload = () => {
            convertedResults.push({
              url: result.processedImage,
              size: result.processedSize,
              width: img.width,
              height: img.height,
              name: file.name.replace(/\.[^/.]+$/, '') + '.' + outputFormat
            });
            resolve();
          };
          img.src = result.processedImage;
        });
      }

      setConvertedImages(convertedResults);
    } catch (error) {
      console.error('Error converting images:', error);
      alert('Failed to convert some images. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  }, [currentFiles, outputFormat]);

  const downloadConvertedImage = useCallback((image: PreviewImage) => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const downloadAllImages = useCallback(() => {
    convertedImages.forEach(image => {
      downloadConvertedImage(image);
    });
  }, [convertedImages, downloadConvertedImage]);

  return (
    <div className="bg-card rounded-lg p-6 shadow-sm">
      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center mb-8 transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${images.length === 0 ? 'cursor-pointer' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        {images.length === 0 ? (
          <div>
            <p className="text-gray-600 mb-4">Drag and drop multiple images here, or</p>
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-600">
              Browse Files
              <input
                type="file"
                className="hidden"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                multiple
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
              onClick={convertImages}
              disabled={isProcessing}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isProcessing ? 'Processing...' : 'Convert Images'}
            </button>
          </div>
        )}
      </div>

      {/* Preview Section */}
      {images.length > 0 && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-4">Original: {image.name}</h2>
                <div className="relative aspect-video mb-4">
                  <Image
                    src={image.url}
                    alt={`Original ${index + 1}`}
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600">
                  Size: {(image.size / 1024).toFixed(2)} KB
                  <br />
                  Dimensions: {image.width} x {image.height}
                </p>
              </div>
            ))}
          </div>

          {/* Converted Images */}
          {convertedImages.length > 0 && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Converted Images</h2>
                <button
                  onClick={downloadAllImages}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                >
                  Download All
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {convertedImages.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">Converted: {image.name}</h2>
                    <div className="relative aspect-video mb-4">
                      <Image
                        src={image.url}
                        alt={`Converted ${index + 1}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      Size: {(image.size / 1024).toFixed(2)} KB
                      <br />
                      Dimensions: {image.width} x {image.height}
                    </p>
                    <button
                      onClick={() => downloadConvertedImage(image)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
