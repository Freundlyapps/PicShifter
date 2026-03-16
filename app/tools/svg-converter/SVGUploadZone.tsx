'use client'

import { useState } from 'react'

interface SVGUploadZoneProps {
  onFilesSelected: (files: File[]) => Promise<void>
  accept: string[]
  maxFiles: number
  maxSize: number
  isProcessing: boolean
  text: string
  processingText: string
}

export default function SVGUploadZone({
  onFilesSelected,
  accept,
  maxFiles,
  maxSize,
  isProcessing,
  text,
  processingText
}: SVGUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    if (files.length > maxFiles) {
      alert(`Maximum ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`)
      return
    }

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
        return false
      }
      const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
      if (!accept.includes(fileExtension)) {
        alert(`File ${file.name} is not supported. Supported formats: ${accept.join(', ')}`)
        return false
      }
      return true
    })

    if (validFiles.length > 0) {
      await onFilesSelected(validFiles)
    }
  }

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      if (files.length > maxFiles) {
        alert(`Maximum ${maxFiles} file${maxFiles === 1 ? '' : 's'} allowed`)
        return
      }

      const validFiles = files.filter(file => {
        if (file.size > maxSize) {
          alert(`File ${file.name} is too large. Maximum size is ${maxSize / 1024 / 1024}MB`)
          return false
        }
        const fileExtension = `.${file.name.split('.').pop()?.toLowerCase()}`
        if (!accept.includes(fileExtension)) {
          alert(`File ${file.name} is not supported. Supported formats: ${accept.join(', ')}`)
          return false
        }
        return true
      })

      if (validFiles.length > 0) {
        await onFilesSelected(validFiles)
      }
    }
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${isDragging 
          ? 'border-primary bg-primary/10 dark:bg-primary/5' 
          : 'border-divider dark:border-dark-divider hover:border-primary dark:hover:border-primary/80'}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => { if (!isProcessing) document.getElementById('svgFileInput')?.click() }}
    >
      <div className="text-text dark:text-dark-text">
        <p className="text-lg mb-2">{isProcessing ? processingText : text}</p>
        <p className="text-sm mt-2 opacity-70">
          Supported formats: {accept.join(', ')}
        </p>
      </div>
      <input
        id="svgFileInput"
        type="file"
        className="hidden"
        accept={accept.join(',')}
        onChange={handleFileInput}
        multiple={maxFiles > 1}
      />
    </div>
  )
}
