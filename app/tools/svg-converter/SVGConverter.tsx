'use client'

import { useState, useEffect } from 'react'
import SVGUploadZone from './SVGUploadZone'
import { HexColorPicker } from 'react-colorful'

type Preset = 'original' | 'detailed' | 'smooth' | 'artistic' | 'posterize'

interface ConversionSettings {
  preset: Preset
  color: string
  background: string
  blackOnWhite: boolean
  maxSize: number
  maintainAspectRatio: boolean
  autoDetect: boolean
}

const presetDescriptions: Record<Preset, string> = {
  original: 'Keep all original colors exactly as they are',
  smooth: 'Vector trace — balanced for most images',
  detailed: 'Vector trace — maximum path detail',
  artistic: 'Vector trace — stylized with enhanced contrast',
  posterize: 'Vector trace — multi-tone layers',
}

export default function SVGConverter() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [showBgColorPicker, setShowBgColorPicker] = useState(false)
  const [settings, setSettings] = useState<ConversionSettings>({
    preset: 'original',
    color: '#000000',
    background: '#ffffff',
    blackOnWhite: true,
    maxSize: 1024,
    maintainAspectRatio: true,
    autoDetect: true
  })
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [svgDimensions, setSvgDimensions] = useState<{ width: number; height: number } | null>(null)
  const [convertedSvg, setConvertedSvg] = useState<string | null>(null)
  const [currentFile, setCurrentFile] = useState<File | null>(null)

  // Clean up object URL on unmount or change
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  const handleFilesSelected = async (files: File[]) => {
    const file = files[0]
    if (!file) return
    setCurrentFile(file)
    setError(null)
    setConvertedSvg(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)
    setSvgDimensions(null)
    await convertFile(file)
  }

  const convertFile = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setConvertedSvg(null)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('settings', JSON.stringify(settings))

      const response = await fetch('/api/svg-convert', {
        method: 'POST',
        body: formData,
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'SVG conversion failed')
      }

      setSvgDimensions({ width: result.width, height: result.height })
      setConvertedSvg(result.svg)

      // If auto-detect was used, update the color pickers to show detected values
      if (settings.autoDetect && result.detectedColors) {
        setSettings(prev => ({
          ...prev,
          color: result.detectedColors.color,
          background: result.detectedColors.background,
          blackOnWhite: result.detectedColors.blackOnWhite,
        }))
      }

      // Render preview safely via <img> to prevent XSS
      const blob = new Blob([result.svg], { type: 'image/svg+xml' })
      setPreviewUrl(URL.createObjectURL(blob))
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

  const isTraceMode = settings.preset !== 'original'
  const showManualColors = isTraceMode && !settings.autoDetect && settings.preset !== 'posterize'

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <SVGUploadZone
              onFilesSelected={handleFilesSelected}
              accept={['.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp']}
              maxFiles={1}
              maxSize={10 * 1024 * 1024} // 10MB
              isProcessing={isProcessing}
              text="Drag & drop your image here or click to browse"
              processingText="Converting to SVG vectors..."
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
                    onChange={(e) => setSettings({ ...settings, maxSize: Math.max(1, parseInt(e.target.value) || 1) })}
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

                {isTraceMode && settings.preset !== 'posterize' && (
                  <div>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={settings.autoDetect}
                        onChange={(e) => setSettings({ ...settings, autoDetect: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        Auto-detect colors from image
                      </span>
                    </label>
                  </div>
                )}

                {showManualColors && (
                  <>
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
                          Black on white (uncheck for white on black)
                        </span>
                      </label>
                    </div>
                  </>
                )}
              </div>
            </div>

            {previewUrl && svgDimensions && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Preview
                  </h3>
                  {currentFile && !isProcessing && (
                    <button
                      onClick={() => convertFile(currentFile)}
                      className="text-sm px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                    >
                      Re-convert
                    </button>
                  )}
                </div>
                <div
                  className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 overflow-hidden"
                  style={{
                    maxHeight: '400px',
                    position: 'relative',
                    backgroundColor: (settings.preset === 'posterize' || settings.preset === 'original') ? 'transparent' : settings.background
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Converted SVG preview"
                    style={{
                      width: '100%',
                      maxHeight: '368px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4 text-sm text-gray-600 dark:text-gray-400">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100">Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Real vector tracing — converts raster pixels into editable SVG paths</li>
            <li>Auto-detect colors — preserves your image&apos;s color scheme automatically</li>
            <li>Posterize mode — multi-tone output for images with gradients and detail</li>
            <li>Multiple conversion presets for different image types</li>
            <li>Control output image size with aspect ratio preservation</li>
            <li>Live preview of the converted SVG</li>
            <li>Output is fully editable in Illustrator, Figma, and Inkscape</li>
            <li>Scales to any size without quality loss</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
