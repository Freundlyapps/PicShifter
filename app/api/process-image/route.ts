import { NextResponse } from 'next/server';
import sharp from 'sharp';

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'tiff' | 'svg';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const operation = formData.get('operation') as string;
    const outputFormat = (formData.get('outputFormat') as string || 'webp').toLowerCase() as OutputFormat;
    
    // Get resize dimensions if provided
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let processedImage = sharp(buffer);

    // Handle input formats
    const isInputSvg = file.name.toLowerCase().endsWith('.svg');

    // Convert SVG to PNG for processing
    if (isInputSvg) {
      processedImage = sharp(await processedImage.png().toBuffer());
    }

    // Apply the requested operation
    switch (operation) {
      case 'resize':
        processedImage = processedImage.resize(width, height, {
          fit: 'fill',
          withoutEnlargement: false,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        });
        break;

      case 'grayscale':
        processedImage = processedImage.grayscale();
        break;

      case 'blur':
        processedImage = processedImage.blur(3);
        break;

      default:
        // If no operation specified, just convert format
        break;
    }

    // Set output format options based on format
    let formatOptions = {};
    switch (outputFormat) {
      case 'jpeg':
        formatOptions = { quality: 85 };
        break;
      case 'webp':
        formatOptions = { quality: 85 };
        break;
      case 'avif':
        formatOptions = { quality: 85 };
        break;
      case 'png':
        formatOptions = { compressionLevel: 9 };
        break;
      case 'tiff':
        formatOptions = { 
          compression: 'lzw',
          quality: 100,
          squash: false,
          resolutionUnit: 'inch',
          xres: 300,
          yres: 300
        };
        break;
    }

    // Convert to the requested format with appropriate options
    let processedBuffer: Buffer;
    
    // If output format is SVG, keep as PNG
    if (outputFormat === 'svg') {
      processedBuffer = await processedImage.png(formatOptions).toBuffer();
    } 
    // Special handling for TIFF output
    else if (outputFormat === 'tiff') {
      // First convert to PNG to ensure proper processing
      const pngBuffer = await processedImage.png().toBuffer();
      
      // Then convert to TIFF with proper options
      processedBuffer = await sharp(pngBuffer)
        .tiff({
          ...formatOptions,
          bitdepth: 8,  // Ensure 8-bit depth for better compatibility
          tile: false,  // Disable tiling for better compatibility
          pyramid: false  // Disable pyramid for better compatibility
        })
        .toBuffer();
    }
    else {
      switch (outputFormat) {
        case 'png':
          processedBuffer = await processedImage.png(formatOptions).toBuffer();
          break;
        case 'jpeg':
          processedBuffer = await processedImage.jpeg(formatOptions).toBuffer();
          break;
        case 'webp':
          processedBuffer = await processedImage.webp(formatOptions).toBuffer();
          break;
        case 'avif':
          processedBuffer = await processedImage.avif(formatOptions).toBuffer();
          break;
        default:
          processedBuffer = await processedImage.webp(formatOptions).toBuffer();
      }
    }

    // Convert processed buffer to base64
    const base64Image = processedBuffer.toString('base64');
    const mimeTypes = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      avif: 'image/avif',
      tiff: 'image/tiff',
      svg: 'image/svg+xml'
    };
    
    // For SVG output, use PNG mime type since we kept it as PNG
    const contentType = outputFormat === 'svg' ? mimeTypes.png : mimeTypes[outputFormat];
    const dataUrl = `data:${contentType};base64,${base64Image}`;

    return NextResponse.json({ 
      success: true,
      processedImage: dataUrl
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
