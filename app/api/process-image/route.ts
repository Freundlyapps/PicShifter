import { NextResponse } from 'next/server';
import sharp from 'sharp';

type OutputFormat = 'png' | 'jpeg' | 'webp' | 'avif' | 'tiff' | 'svg';

const isSvgContent = (buffer: Buffer): boolean => {
  const content = buffer.toString().trim().toLowerCase();
  return content.startsWith('<?xml') || content.startsWith('<svg');
};

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const operation = formData.get('operation') as string;
    const outputFormat = (formData.get('outputFormat') as string || 'webp').toLowerCase() as OutputFormat;
    
    const width = formData.get('width') ? parseInt(formData.get('width') as string) : undefined;
    const height = formData.get('height') ? parseInt(formData.get('height') as string) : undefined;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isInputSvg = file.name.toLowerCase().endsWith('.svg') || isSvgContent(buffer);

    if (isInputSvg && outputFormat === 'svg' && operation === 'convert') {
      return NextResponse.json({
        success: true,
        processedImage: `data:image/svg+xml;base64,${buffer.toString('base64')}`,
        previewImage: `data:image/svg+xml;base64,${buffer.toString('base64')}`
      });
    }

    let processedImage = sharp(buffer);
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
        break;
    }

    // Create a clone of the processed image for preview
    const processedBuffer = await processedImage.clone().toBuffer();
    const previewBuffer = await sharp(processedBuffer)
      .png({ compressionLevel: 9 })
      .toBuffer();

    // Generate the actual output in requested format
    let processedOutputBuffer: Buffer;

    // Generate the actual output in requested format
    if (outputFormat === 'tiff') {
      processedOutputBuffer = await sharp(processedBuffer)
        .tiff({
          compression: 'lzw',
          quality: 100,
          resolutionUnit: 'inch',
          xres: 300,
          yres: 300,
          bitdepth: 8
        })
        .toBuffer();
    } else if (outputFormat === 'jpeg') {
      processedOutputBuffer = await sharp(processedBuffer)
        .jpeg({ quality: 85 })
        .toBuffer();
    } else if (outputFormat === 'webp') {
      processedOutputBuffer = await sharp(processedBuffer)
        .webp({ quality: 85 })
        .toBuffer();
    } else if (outputFormat === 'avif') {
      processedOutputBuffer = await sharp(processedBuffer)
        .avif({ quality: 85 })
        .toBuffer();
    } else if (outputFormat === 'png') {
      processedOutputBuffer = await sharp(processedBuffer)
        .png({ compressionLevel: 9 })
        .toBuffer();
    } else {
      // Default to PNG if format not supported
      processedOutputBuffer = await sharp(processedBuffer)
        .png({ compressionLevel: 9 })
        .toBuffer();
    }

    // Get the appropriate MIME types
    const mimeTypes = {
      png: 'image/png',
      jpeg: 'image/jpeg',
      webp: 'image/webp',
      avif: 'image/avif',
      tiff: 'image/tiff',
      svg: 'image/svg+xml'
    };
    
    const contentType = mimeTypes[outputFormat];
    
    return NextResponse.json({ 
      success: true,
      processedImage: `data:${contentType};base64,${processedOutputBuffer.toString('base64')}`,
      previewImage: `data:image/png;base64,${previewBuffer.toString('base64')}`
    });

  } catch (error) {
    console.error('Image processing error:', error);
    return NextResponse.json(
      { error: 'Failed to process image' },
      { status: 500 }
    );
  }
}
