const sharp = require('sharp');
const path = require('path');

const publicDir = path.join(__dirname, '../public');

// Using the downloaded logo file directly
const sourceImage = "c:/Users/sdxxx/Downloads/DALL·E 2024-12-14 10.54.45 -A modern and minimalistic logo for a web app named 'PicShifter' designed as a favicon .png";

async function generateFavicons() {
  try {
    // Generate android-chrome icons
    await sharp(sourceImage)
      .resize(512, 512, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'android-chrome-512x512.png'));

    await sharp(sourceImage)
      .resize(192, 192, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'android-chrome-192x192.png'));

    // Generate apple-touch-icon
    await sharp(sourceImage)
      .resize(180, 180, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));

    // Generate favicon-32x32
    await sharp(sourceImage)
      .resize(32, 32, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon-32x32.png'));

    // Generate favicon-16x16
    await sharp(sourceImage)
      .resize(16, 16, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png()
      .toFile(path.join(publicDir, 'favicon-16x16.png'));

    console.log('All favicon files generated successfully!');
  } catch (error) {
    console.error('Error generating favicons:', error);
  }
}

generateFavicons().catch(console.error);
