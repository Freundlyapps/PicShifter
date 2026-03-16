import { NextResponse } from 'next/server';
import sharp from 'sharp';
import potrace from 'potrace';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

interface ConvertRequest {
  preset: 'original' | 'detailed' | 'smooth' | 'artistic' | 'posterize';
  color: string;
  background: string;
  blackOnWhite: boolean;
  maxSize: number;
  maintainAspectRatio: boolean;
  autoDetect: boolean;
}

const presetOptions: Record<string, Partial<potrace.PotraceOptions>> = {
  detailed: {
    turdSize: 2,
    alphaMax: 1,
    optCurve: true,
    optTolerance: 0.2,
  },
  smooth: {
    turdSize: 5,
    alphaMax: 1.0,
    optCurve: true,
    optTolerance: 0.5,
  },
  artistic: {
    turdSize: 10,
    alphaMax: 1.3,
    optCurve: true,
    optTolerance: 1.0,
  },
};

function traceToPaths(filePath: string, options: potrace.PotraceOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.trace(filePath, options, (err: Error | null, svg?: string) => {
      if (err) reject(err);
      else if (svg) resolve(svg);
      else reject(new Error('Potrace returned empty result'));
    });
  });
}

function posterizeToPaths(filePath: string, options: potrace.PosterizeOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    potrace.posterize(filePath, options, (err: Error | null, svg?: string) => {
      if (err) reject(err);
      else if (svg) resolve(svg);
      else reject(new Error('Posterize returned empty result'));
    });
  });
}

async function detectDominantColors(imageBuffer: Buffer): Promise<{ isDark: boolean; fgColor: string; bgColor: string }> {
  // Sample the image stats to determine if it's predominantly dark or light
  const stats = await sharp(imageBuffer).stats();
  const avgBrightness = (stats.channels[0].mean + stats.channels[1].mean + stats.channels[2].mean) / 3;
  const isDark = avgBrightness < 128;

  // Get dominant color from corners (likely background) and center (likely foreground)
  const metadata = await sharp(imageBuffer).metadata();
  const w = metadata.width || 100;
  const h = metadata.height || 100;

  // Sample a 10% strip from edges for background color
  const edgeSample = await sharp(imageBuffer)
    .extract({ left: 0, top: 0, width: Math.max(1, Math.round(w * 0.1)), height: h })
    .stats();
  const bgR = Math.round(edgeSample.channels[0].mean);
  const bgG = Math.round(edgeSample.channels[1].mean);
  const bgB = Math.round(edgeSample.channels[2].mean);
  const bgColor = `#${bgR.toString(16).padStart(2, '0')}${bgG.toString(16).padStart(2, '0')}${bgB.toString(16).padStart(2, '0')}`;

  // For foreground, use the opposite brightness
  const fgColor = isDark ? '#ffffff' : '#000000';

  return { isDark, fgColor, bgColor };
}

export async function POST(request: Request) {
  let tmpPath: string | null = null;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const settingsJson = formData.get('settings') as string;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const MAX_BYTES = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'File too large. Maximum 10MB.' }, { status: 413 });
    }

    const settings: ConvertRequest = JSON.parse(settingsJson);
    const arrayBuffer = await file.arrayBuffer();
    let imageBuffer = Buffer.from(arrayBuffer);

    // Get original dimensions
    const metadata = await sharp(imageBuffer).metadata();
    const origWidth = metadata.width || 512;
    const origHeight = metadata.height || 512;

    // Resize if needed
    const maxSize = Math.min(Math.max(settings.maxSize, 1), 4096);
    let targetWidth = origWidth;
    let targetHeight = origHeight;

    if (settings.maintainAspectRatio) {
      if (origWidth > maxSize || origHeight > maxSize) {
        if (origWidth > origHeight) {
          targetWidth = maxSize;
          targetHeight = Math.round((origHeight * maxSize) / origWidth);
        } else {
          targetHeight = maxSize;
          targetWidth = Math.round((origWidth * maxSize) / origHeight);
        }
      }
    } else {
      targetWidth = maxSize;
      targetHeight = maxSize;
    }

    // Pre-process with sharp: resize and convert to PNG for potrace
    imageBuffer = await sharp(imageBuffer)
      .resize(targetWidth, targetHeight, { fit: 'fill' })
      .png()
      .toBuffer();

    // Auto-detect colors if requested
    let color = settings.color;
    let background = settings.background;
    let blackOnWhite = settings.blackOnWhite;

    if (settings.autoDetect) {
      const detected = await detectDominantColors(imageBuffer);
      color = detected.fgColor;
      background = detected.bgColor;
      blackOnWhite = !detected.isDark;
    }

    // Write to temp file — potrace's Jimp integration breaks with raw buffers
    // in webpack-bundled environments due to instanceof checks failing
    const tmpName = `potrace-${randomBytes(8).toString('hex')}.png`;
    tmpPath = join(tmpdir(), tmpName);
    await writeFile(tmpPath, imageBuffer);

    let svg: string;

    if (settings.preset === 'original') {
      // Original colors mode — embeds the image in SVG preserving all colors exactly
      const base64 = imageBuffer.toString('base64');
      svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${targetWidth}" height="${targetHeight}" viewBox="0 0 ${targetWidth} ${targetHeight}">
  <image width="${targetWidth}" height="${targetHeight}" href="data:image/png;base64,${base64}"/>
</svg>`;

      return NextResponse.json({
        success: true,
        svg,
        width: targetWidth,
        height: targetHeight,
        originalWidth: origWidth,
        originalHeight: origHeight,
      });
    } else if (settings.preset === 'posterize') {
      // Multi-tone posterize mode — preserves more of the original appearance
      const posterizeOptions: potrace.PosterizeOptions = {
        steps: 4,
        fillStrategy: 'dominant',
        rangeDistribution: 'auto',
        color: color,
        background: background,
        blackOnWhite: blackOnWhite,
        threshold: -1, // auto
      };
      svg = await posterizeToPaths(tmpPath, posterizeOptions);
    } else {
      // Single-color trace mode
      const preset = presetOptions[settings.preset] || presetOptions.smooth;
      const traceOptions: potrace.PotraceOptions = {
        ...preset,
        color: color,
        background: background,
        blackOnWhite: blackOnWhite,
        threshold: settings.preset === 'artistic' ? 100 : 128,
      };
      svg = await traceToPaths(tmpPath, traceOptions);
    }

    return NextResponse.json({
      success: true,
      svg,
      width: targetWidth,
      height: targetHeight,
      originalWidth: origWidth,
      originalHeight: origHeight,
      detectedColors: settings.autoDetect ? { color, background, blackOnWhite } : undefined,
    });
  } catch (error) {
    console.error('SVG conversion error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'SVG conversion failed' },
      { status: 500 }
    );
  } finally {
    // Clean up temp file
    if (tmpPath) {
      unlink(tmpPath).catch(() => {});
    }
  }
}
