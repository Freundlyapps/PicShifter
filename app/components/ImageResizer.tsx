"use client";

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

const presetSizes = [
  { label: 'Small (320x240)', width: 320, height: 240 },
  { label: 'Medium (640x480)', width: 640, height: 480 },
  { label: 'Large (1024x768)', width: 1024, height: 768 },
  { label: 'Instagram Post', width: 1080, height: 1080 },
  { label: 'Facebook Cover', width: 820, height: 312 },
  { label: 'Thumbnail', width: 150, height: 150 },
];

const outputFormats = [
  { value: 'png', label: 'PNG - High quality, supports transparency' },
  { value: 'jpeg', label: 'JPEG - Smaller file size, best for photos' },
  { value: 'webp', label: 'WebP - Modern format, good compression' },
  { value: 'avif', label: 'AVIF - Next-gen format, best compression' },
];

export default function ImageResizer() {
  const [files, setFiles] = useState<File[]>([]);
  const [width, setWidth] = useState<number | ''>('');
  const [height, setHeight] = useState<number | ''>('');
  const [format, setFormat] = useState('png');
  const [loading, setLoading] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [previews, setPreviews] = useState<string[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(prevFiles => [...prevFiles, ...acceptedFiles]);
    setMessage(null);
    
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviews(prev => [...prev, e.target?.result as string]);
      };
      reader.readAsDataURL(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': []
    },
    maxSize: 10485760 // 10MB
  });

  const handlePresetClick = (preset: { width: number; height: number }) => {
    setWidth(preset.width);
    setHeight(preset.height);
  };

  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleResize = async () => {
    if (!files.length || !width || !height) {
      setMessage('Please upload images and enter dimensions.');
      return;
    }

    setLoading(true);
    setDownloadUrl(null);
    setMessage('Resizing...');

    const formData = new FormData();
    files.forEach((file) => formData.append('images', file));
    formData.append('width', String(width));
    formData.append('height', String(height));
    formData.append('format', format);

    try {
      const response = await fetch('/api/resize-images', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to resize images');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      setMessage('Images resized successfully!');
    } catch (error: unknown) {
      console.error('Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setMessage(`Error resizing images: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <section aria-labelledby="upload-section">
        <h2 id="upload-section" className="text-2xl font-bold mb-4 text-text dark:text-white">Upload Images</h2>
        <div
          {...getRootProps()}
          className={`mb-4 p-6 border-2 border-dashed rounded-lg cursor-pointer text-center transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-400 dark:border-gray-600'}`}
          role="button"
          tabIndex={0}
          aria-label="Upload images by clicking or dragging and dropping"
        >
          <input {...getInputProps()} aria-label="File upload input" />
          {isDragActive ? (
            <p className="text-text dark:text-white">Drop the images here...</p>
          ) : (
            <div className="space-y-2">
              <p className="text-text dark:text-white">Drag 'n' drop images here, or click to select files</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">Maximum file size: 10MB</p>
            </div>
          )}
        </div>
      </section>

      {previews.length > 0 && (
        <section aria-label="Image previews" className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square relative overflow-hidden rounded-lg">
                  <Image
                    src={preview}
                    alt={`Preview of image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label={`Remove image ${index + 1}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      <section aria-labelledby="preset-sizes" className="mb-8">
        <h2 id="preset-sizes" className="text-2xl font-bold mb-4 text-text dark:text-white">Preset Sizes</h2>
        <div className="flex flex-wrap gap-2">
          {presetSizes.map((preset) => (
            <button
              key={preset.label}
              onClick={() => handlePresetClick(preset)}
              className="bg-gray-200 dark:bg-gray-700 text-text dark:text-white py-2 px-4 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              aria-label={`Set dimensions to ${preset.label}`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section aria-labelledby="custom-dimensions" className="mb-8">
        <h2 id="custom-dimensions" className="text-2xl font-bold mb-4 text-text dark:text-white">Custom Dimensions</h2>
        <div className="flex flex-col space-y-2 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-1">
            <label htmlFor="width" className="block text-sm font-medium text-text dark:text-white mb-1">Width (pixels)</label>
            <input
              id="width"
              type="number"
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-text dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              aria-label="Width in pixels"
            />
          </div>
          <div className="flex-1">
            <label htmlFor="height" className="block text-sm font-medium text-text dark:text-white mb-1">Height (pixels)</label>
            <input
              id="height"
              type="number"
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-text dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
              min="1"
              aria-label="Height in pixels"
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="output-format" className="mb-8">
        <h2 id="output-format" className="text-2xl font-bold mb-4 text-text dark:text-white">Output Format</h2>
        <select
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded text-text dark:text-white bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary focus:border-transparent"
          aria-label="Select output format"
        >
          {outputFormats.map((format) => (
            <option key={format.value} value={format.value} className="dark:bg-gray-800">
              {format.label}
            </option>
          ))}
        </select>
      </section>

      <section aria-label="Actions" className="space-y-4">
        <button
          onClick={handleResize}
          disabled={loading || !files.length}
          className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-busy={loading}
        >
          {loading ? 'Resizing...' : 'Resize Images'}
        </button>

        {message && (
          <p 
            className={`text-center ${message.includes('Error') ? 'text-red-500' : 'text-green-500'}`}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        )}

        {downloadUrl && (
          <div className="text-center">
            <a
              href={downloadUrl}
              download="resized-images.zip"
              className="inline-block bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-600 transition-colors"
              aria-label="Download resized images"
            >
              Download Resized Images
            </a>
          </div>
        )}
      </section>
    </div>
  );
}
