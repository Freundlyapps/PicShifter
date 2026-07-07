import { NextResponse } from 'next/server';
import sharp from 'sharp';
import JSZip from 'jszip';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll('images') as File[];
    const width = parseInt(formData.get('width') as string);
    const height = parseInt(formData.get('height') as string);
    const format = (formData.get('format') as string) || 'png';

    if (!files.length) {
      return NextResponse.json(
        { error: 'No image files provided' },
        { status: 400 }
      );
    }

    if (isNaN(width) || isNaN(height) || width < 1 || height < 1) {
      return NextResponse.json(
        { error: 'Invalid dimensions provided' },
        { status: 400 }
      );
    }

    const zip = new JSZip();

    // Process each image
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const buffer = Buffer.from(await file.arrayBuffer());
      
      let sharpInstance = sharp(buffer)
        .resize(width, height, {
          fit: 'fill',
          withoutEnlargement: false,
          background: { r: 255, g: 255, b: 255, alpha: 1 }
        });

      // Apply format-specific options
      switch (format) {
        case 'jpeg':
          sharpInstance = sharpInstance.jpeg({ quality: 85 });
          break;
        case 'webp':
          sharpInstance = sharpInstance.webp({ quality: 85 });
          break;
        case 'avif':
          sharpInstance = sharpInstance.avif({ quality: 85 });
          break;
        case 'png':
        default:
          sharpInstance = sharpInstance.png({ compressionLevel: 9 });
          break;
      }

      const resizedImageBuffer = await sharpInstance.toBuffer();

      // Add the resized image to the zip file with appropriate extension
      const filename = file.name.replace(/\.[^/.]+$/, "") + `_resized.${format}`;
      zip.file(filename, resizedImageBuffer);
    }

    // Generate zip file
    const zipBuffer = await zip.generateAsync({
      type: "nodebuffer",
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    });

    // Return the zip file
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename=resized-images.zip'
      }
    });

  } catch (error) {
    console.error('Error processing images:', error);
    return NextResponse.json(
      { error: 'Failed to process images' },
      { status: 500 }
    );
  }
}
