'use client';
import React, { useState } from 'react';
import Image from 'next/image';

interface ProcessedImage {
  original: string;
  processed: string;
  preview: string;
  operation: string;
}

const supportedFormats = ['PNG', 'JPEG', 'WebP', 'AVIF', 'TIFF'];

const getMimeType = (format: string): string => {
  const mimeTypes: { [key: string]: string } = {
    'PNG': 'image/png',
    'JPEG': 'image/jpeg',
    'WebP': 'image/webp',
    'AVIF': 'image/avif',
    'TIFF': 'image/tiff'
  };
  return mimeTypes[format] || 'image/png';
};

const getFormatFromMimeType = (mimeType: string): string => {
  const formatMap: { [key: string]: string } = {
    'image/png': 'PNG',
    'image/jpeg': 'JPEG',
    'image/webp': 'WebP',
    'image/avif': 'AVIF',
    'image/tiff': 'TIFF'
  };
  return formatMap[mimeType] || 'PNG';
};

export default function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentImage, setCurrentImage] = useState<ProcessedImage | null>(null);
  const [inputFormat, setInputFormat] = useState('PNG');
  const [outputFormat, setOutputFormat] = useState('WebP');
  const [resizeWidth, setResizeWidth] = useState(800);
  const [resizeHeight, setResizeHeight] = useState(600);
  const [showCustomResize, setShowCustomResize] = useState(false);

  const operations = [
    { id: 'grayscale', label: 'Grayscale' },
    { id: 'blur', label: 'Blur' }
  ];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFiles(files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const generatePreview = async (file: File): Promise<string> => {
    // For TIFF files, we need to convert to a preview-friendly format first
    if (file.type === 'image/tiff') {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('operation', 'preview');
      formData.append('outputFormat', 'jpeg');

      try {
        const response = await fetch('/api/process-image', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Failed to generate preview');
        }

        const result = await response.json();
        return result.previewImage;
      } catch (error) {
        console.error('Preview generation error:', error);
        return URL.createObjectURL(file); // Fallback to direct URL
      }
    }

    // For other formats, use direct URL
    return URL.createObjectURL(file);
  };

  const handleFiles = async (files: File[]) => {
    const file = files[0];
    const acceptedTypes = [
      'image/png', 
      'image/jpeg', 
      'image/webp', 
      'image/avif', 
      'image/tiff'
    ];
    
    if (!acceptedTypes.includes(file.type)) {
      return;
    }

    setIsProcessing(true);
    setInputFormat(getFormatFromMimeType(file.type));

    try {
      const previewUrl = await generatePreview(file);
      const originalUrl = URL.createObjectURL(file);

      setCurrentImage({
        original: originalUrl,
        processed: originalUrl,
        preview: previewUrl,
        operation: ''
      });
    } catch (error) {
      console.error('File handling error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const processImage = async (operation: string, useCustomDimensions = false) => {
    if (!currentImage) return;

    try {
      setIsProcessing(true);

      const response = await fetch(currentImage.original);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob);
      formData.append('operation', operation);
      formData.append('outputFormat', outputFormat.toLowerCase());
      
      if (operation === 'resize' && useCustomDimensions) {
        formData.append('width', resizeWidth.toString());
        formData.append('height', resizeHeight.toString());
      }

      const processResponse = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!processResponse.ok) {
        throw new Error('Failed to process image');
      }

      const result = await processResponse.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setCurrentImage({
        ...currentImage,
        processed: result.processedImage,
        preview: result.previewImage || result.processedImage,
        operation
      });

    } catch (error) {
      console.error('Processing error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = async () => {
    if (!currentImage?.processed) return;
    
    try {
      const mimeType = getMimeType(outputFormat);
      const base64Data = currentImage.processed.split(',')[1];
      const binaryData = atob(base64Data);
      const uint8Array = new Uint8Array(binaryData.length);
      
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }
      
      const processedBlob = new Blob([uint8Array], { type: mimeType });
      const url = URL.createObjectURL(processedBlob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = `processed-image.${outputFormat.toLowerCase()}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Format Selection */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="inputFormat" className="block text-sm font-medium text-text dark:text-dark-text">
            Input 
          </label>
          <select
            id="inputFormat"
            value={inputFormat}
            onChange={(e) => setInputFormat(e.target.value)}
            className="block w-full rounded-md border-divider dark:border-dark-divider 
                     bg-white dark:bg-dark-background text-text dark:text-dark-text
                     shadow-sm focus:border-primary focus:ring-primary"
          >
            {supportedFormats.map(format => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <label htmlFor="outputFormat" className="block text-sm font-medium text-text dark:text-dark-text">
            Output 
          </label>
          <select
            id="outputFormat"
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value)}
            className="block w-full rounded-md border-divider dark:border-dark-divider 
                     bg-white dark:bg-dark-background text-text dark:text-dark-text
                     shadow-sm focus:border-primary focus:ring-primary"
          >
            {supportedFormats.map(format => (
              <option key={format} value={format}>
                {format}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging 
            ? 'border-primary bg-primary/10 dark:bg-primary/5' 
            : 'border-divider dark:border-dark-divider hover:border-primary dark:hover:border-primary/80'}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <div className="text-text dark:text-dark-text">
          <p className="text-lg mb-2">Drag and drop your images here</p>
          <p className="text-sm">or click to select files</p>
          <p className="text-sm mt-2 opacity-70">
            Converting from {inputFormat} to {outputFormat}
          </p>
        </div>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileInput}
        />
      </div>

      {/* Image Preview and Controls */}
      {currentImage && (
        <div className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div className="space-y-2">
              <h3 className="font-semibold text-center text-text dark:text-dark-text">
                Original ({inputFormat})
              </h3>
              <div className="border rounded-lg overflow-hidden border-divider dark:border-dark-divider">
                <div className="relative w-full aspect-square">
                  <Image
                    src={currentImage.original} // Use original URL for the original image
                    alt="Original"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                </div>
              </div>
            </div>

            {/* Processed Image */}
            <div className="space-y-2">
              <h3 className="font-semibold text-center text-text dark:text-dark-text">
                Processed ({outputFormat})
              </h3>
              <div className="relative border rounded-lg overflow-hidden border-divider dark:border-dark-divider group">
                <div className="relative w-full aspect-square">
                  <Image
                    src={currentImage.processed} // Use processed URL for the processed image
                    alt="Processed"
                    fill
                    style={{ objectFit: 'contain' }}
                    unoptimized
                  />
                  <div 
                    onClick={handleDownload}
                    className="absolute inset-0 bg-primary/80 dark:bg-primary/70 opacity-0 
                             group-hover:opacity-100 transition-opacity duration-200 
                             flex flex-col items-center justify-center cursor-pointer"
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-12 w-12 text-white mb-2" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" 
                      />
                    </svg>
                    <span className="text-white font-medium">Download Image</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Operation Controls */}
          <div className="flex flex-wrap gap-2 justify-center">
            {/* Optional Operations */}
            <div className="w-full flex flex-wrap gap-2 justify-center">
              <p className="w-full text-center text-sm text-text dark:text-dark-text opacity-70">
                Optional Effects
              </p>
              {operations.map((op) => (
                <button
                  key={op.id}
                  onClick={() => processImage(op.id)}
                  disabled={isProcessing}
                  className={`px-4 py-2 rounded-md text-white transition-colors
                    ${isProcessing 
                      ? 'bg-divider dark:bg-dark-divider cursor-not-allowed'
                      : 'bg-primary hover:bg-mint dark:hover:bg-mint/90'
                    }`}
                >
                  {op.label}
                </button>
              ))}
              
              {/* Custom Resize Toggle */}
              <button
                onClick={() => setShowCustomResize(!showCustomResize)}
                className={`px-4 py-2 rounded-md text-white transition-colors
                  ${showCustomResize 
                    ? 'bg-mint hover:bg-mint/90 dark:hover:bg-mint/80' 
                    : 'bg-coral hover:bg-coral/90 dark:hover:bg-coral/80'}`}
              >
                Custom Resize
              </button>
            </div>
          </div>

          {/* Custom Resize Options */}
          {showCustomResize && (
            <div className="flex flex-col items-center space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                <div className="space-y-2">
                  <label htmlFor="width" className="block text-sm font-medium text-text dark:text-dark-text">
                    Width (px)
                  </label>
                  <input
                    type="number"
                    id="width"
                    value={resizeWidth}
                    onChange={(e) => setResizeWidth(Number(e.target.value))}
                    className="block w-full rounded-md border-divider dark:border-dark-divider 
                             bg-white dark:bg-dark-background text-text dark:text-dark-text
                             shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="height" className="block text-sm font-medium text-text dark:text-dark-text">
                    Height (px)
                  </label>
                  <input
                    type="number"
                    id="height"
                    value={resizeHeight}
                    onChange={(e) => setResizeHeight(Number(e.target.value))}
                    className="block w-full rounded-md border-divider dark:border-dark-divider 
                             bg-white dark:bg-dark-background text-text dark:text-dark-text
                             shadow-sm focus:border-primary focus:ring-primary"
                  />
                </div>
                <button
                  onClick={() => processImage('resize', true)}
                  disabled={isProcessing}
                  className="col-span-2 px-4 py-2 rounded-md text-white 
                           bg-mint hover:bg-mint/90 dark:hover:bg-mint/80 
                           transition-colors disabled:bg-divider dark:disabled:bg-dark-divider"
                >
                  Apply Custom Resize
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
