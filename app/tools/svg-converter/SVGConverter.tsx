'use client'

import { useState, useRef } from 'react'
import SVGUploadZone from './SVGUploadZone'
import { HexColorPicker } from 'react-colorful'
import { Canvg } from 'canvg'

type Preset = 'detailed' | 'smooth' | 'artistic'

interface ConversionSettings {
  preset: Preset
  color: string
  background: string
  blackOnWhite: boolean
  maxSize: number
  maintainAspectRatio: boolean
}

const presetDescriptions = {
  detailed: 'Best for high-fidelity image conversion',
  smooth: 'Balanced option for most images',
  artistic: 'Creates stylized results with enhanced contrast'
}

const presetConfigs = {
  detailed: {
    quality: 1,
    smoothing: 0
  },
  smooth: {
    quality: 0.8,
    smoothing: 0.2
  },
  artistic: {
    quality: 0.6,
    smoothing: 0.4
  }
}

export default function SVGConverter() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showBgColorPicker, setShowBgColorPicker] = useState(false)
  const [settings, setSettings] = useState<ConversionSettings>({
    preset: 'smooth',
    color: '#000000',
    background: '#ffffff',
    blackOnWhite: true,
    maxSize: 1024,
    maintainAspectRatio: true
  })
  const [previewSvg, setPreviewSvg] = useState<string | null>(null)
  const [originalImageSize, setOriginalImageSize] = useState<{ width: number; height: number } | null>(null)
  const [convertedSvg, setConvertedSvg] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const calculateNewDimensions = (width: number, height: number, maxSize: number) => {
    if (width <= maxSize && height <= maxSize) {
      return { width, height }
    }

    if (width > height) {
      const newWidth = maxSize
      const newHeight = Math.round((height * maxSize) / width)
      return { width: newWidth, height: newHeight }
    } else {
      const newHeight = maxSize
      const newWidth = Math.round((width * maxSize) / height)
      return { width: newWidth, height: newHeight }
    }
  }

  const handleFilesSelected = async (files: File[]) => {
    setIsProcessing(true)
    setError(null)
    setConvertedSvg(null)

    try {
      const file = files[0]
      if (!file) throw new Error('No file selected')

      const reader = new FileReader()
      
      reader.onload = async (e) => {
        try {
          if (!e.target?.result) throw new Error('Failed to read file')
          
          const img = new Image()
          img.src = e.target.result as string
          
          await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve()
            img.onerror = () => reject(new Error('Failed to load image'))
          })

          setOriginalImageSize({ width: img.width, height: img.height })

          const newDimensions = settings.maintainAspectRatio 
            ? calculateNewDimensions(img.width, img.height, settings.maxSize)
            : { width: settings.maxSize, height: settings.maxSize }

          const canvas = canvasRef.current
          if (!canvas) throw new Error('Canvas not available')
          
          canvas.width = newDimensions.width
          canvas.height = newDimensions.height
          
          const ctx = canvas.getContext('2d')
          if (!ctx) throw new Error('Could not get canvas context')

          // Clear the canvas first
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          
          const preset = presetConfigs[settings.preset]
          ctx.filter = `blur(${preset.smoothing}px)`
          ctx.drawImage(img, 0, 0, newDimensions.width, newDimensions.height)

          // Create a properly formatted SVG string with explicit background and foreground colors
          const svgString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
            <svg xmlns="http://www.w3.org/2000/svg" width="${newDimensions.width}" height="${newDimensions.height}" viewBox="0 0 ${newDimensions.width} ${newDimensions.height}" style="background-color: ${settings.background}">
              <defs>
                <filter id="imageProcessing">
                  <feColorMatrix type="matrix" values="
                    ${settings.blackOnWhite ? '1.2 0 0 0 0' : '1 0 0 0 0'}
                    0 ${settings.blackOnWhite ? '1.2 0 0 0' : '1 0 0 0 0'}
                    0 0 ${settings.blackOnWhite ? '1.2 0 0 0' : '1 0 0 0 0'}
                    0 0 0 1 0"
                  />
                  ${settings.preset === 'artistic' ? '<feColorMatrix type="saturate" values="1.2"/>' : ''}
                </filter>
              </defs>
              <rect width="100%" height="100%" fill="${settings.background}"/>
              <g fill="${settings.color}">
                <image
                  x="0"
                  y="0"
                  width="${newDimensions.width}"
                  height="${newDimensions.height}"
                  href="${canvas.toDataURL('image/png')}"
                  preserveAspectRatio="none"
                  filter="url(#imageProcessing)"
                  style="mix-blend-mode: multiply;"
                />
              </g>
            </svg>`

          try {
            // Create a new canvas for the final render
            const finalCanvas = document.createElement('canvas')
            finalCanvas.width = newDimensions.width
            finalCanvas.height = newDimensions.height
            const finalCtx = finalCanvas.getContext('2d')
            if (!finalCtx) throw new Error('Could not get final canvas context')

            // Create and render Canvg instance
            const v = await Canvg.from(finalCtx, svgString, {
              enableRedraw: false,
              ignoreMouse: true,
              ignoreAnimation: true,
            })
            await v.render()

            setPreviewSvg(svgString)
            setConvertedSvg(svgString)
          } catch (canvgError) {
            console.error('Canvg error:', canvgError)
            throw new Error('Failed to render SVG. Please try a different image or preset.')
          }
        } catch (err) {
          console.error('Conversion error:', err)
          setError(err instanceof Error ? err.message : 'Failed to convert image')
        }
      }

      reader.onerror = () => {
        setError('Failed to read the image file')
      }

      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Conversion error:', err)
      setError(err instanceof Error ? err.message : 'An error occurred during conversion')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (!convertedSvg) return

    const blob = new Blob([convertedSvg], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'converted-image.svg'
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <canvas ref={canvasRef} className="hidden" />
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SVGUploadZone
              onFilesSelected={handleFilesSelected}
              accept={['.jpg', '.jpeg', '.png', '.gif', '.bmp']}
              maxFiles={1}
              maxSize={10 * 1024 * 1024} // 10MB
              isProcessing={isProcessing}
              text="Drag & drop your image here or click to browse"
              processingText="Converting to SVG..."
            />

            {error && (
              <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 rounded-lg">
                {error}
              </div>
            )}

            {convertedSvg && (
              <button
                onClick={handleDownload}
                className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Download SVG
              </button>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                Conversion Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Preset Style
                  </label>
                  <select
                    value={settings.preset}
                    onChange={(e) => setSettings({ ...settings, preset: e.target.value as Preset })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    {Object.entries(presetDescriptions).map(([key, desc]) => (
                      <option key={key} value={key}>
                        {key.charAt(0).toUpperCase() + key.slice(1)} - {desc}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum Size (pixels)
                  </label>
                  <input
                    type="number"
                    value={settings.maxSize}
                    onChange={(e) => setSettings({ ...settings, maxSize: Math.max(1, parseInt(e.target.value)) })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600"
                    min="1"
                    max="4096"
                  />
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.maintainAspectRatio}
                      onChange={(e) => setSettings({ ...settings, maintainAspectRatio: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Maintain aspect ratio
                    </span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SVG Color
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(!showColorPicker)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 flex items-center"
                    >
                      <div
                        className="w-6 h-6 rounded mr-2"
                        style={{ backgroundColor: settings.color }}
                      />
                      {settings.color}
                    </button>
                    {showColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => setShowColorPicker(false)}
                        />
                        <HexColorPicker
                          color={settings.color}
                          onChange={(color) => setSettings({ ...settings, color })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Color
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setShowBgColorPicker(!showBgColorPicker)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 flex items-center"
                    >
                      <div
                        className="w-6 h-6 rounded mr-2"
                        style={{ backgroundColor: settings.background }}
                      />
                      {settings.background}
                    </button>
                    {showBgColorPicker && (
                      <div className="absolute z-10 mt-2">
                        <div
                          className="fixed inset-0"
                          onClick={() => setShowBgColorPicker(false)}
                        />
                        <HexColorPicker
                          color={settings.background}
                          onChange={(background) => setSettings({ ...settings, background })}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={settings.blackOnWhite}
                      onChange={(e) => setSettings({ ...settings, blackOnWhite: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Enhance contrast (recommended for black & white images)
                    </span>
                  </label>
                </div>
              </div>
            </div>

            {previewSvg && originalImageSize && (
              <div>
                <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
                  Preview
                </h3>
                <div 
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-hidden"
                  style={{
                    maxHeight: '400px',
                    position: 'relative',
                    backgroundColor: settings.background
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      paddingBottom: `${(originalImageSize.height / originalImageSize.width) * 100}%`,
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        overflow: 'hidden'
                      }}
                      dangerouslySetInnerHTML={{ __html: previewSvg }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Convert JPG, PNG, GIF, and BMP images to SVG format</li>
            <li>Multiple conversion presets for different image types</li>
            <li>Customizable SVG and background colors</li>
            <li>Control output image size with aspect ratio preservation</li>
            <li>Live preview of the converted SVG</li>
            <li>Client-side conversion - no data uploaded to servers</li>
            <li>Enhanced contrast options for black & white images</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
