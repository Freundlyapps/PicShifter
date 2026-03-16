'use client';
import React, { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-gradient-to-r from-primary/90 to-mint dark:from-primary dark:to-mint/90 text-white">
      <div className="container mx-auto px-4">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center text-background dark:text-dark-text hover:text-white dark:hover:text-white transition-colors">
            <Image
              src="/favicon-32x32.png"
              alt="PicShifter Logo"
              width={32}
              height={32}
              className="w-8 h-8"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/tools/image-resizer" className="text-background/90 dark:text-dark-text hover:text-white dark:hover:text-white transition-colors">
              Resize
            </Link>
            <Link href="/tools/image-optimizer" className="text-background/90 dark:text-dark-text hover:text-white dark:hover:text-white transition-colors">
              Optimize
            </Link>
            <Link href="/tools/image-converter" className="text-background/90 dark:text-dark-text hover:text-white dark:hover:text-white transition-colors">
              Convert
            </Link>
          </div>

          {/* Right Side Controls */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-background dark:text-dark-text hover:text-white hover:bg-white/10 dark:hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <nav className="py-4 border-t border-background/20 dark:border-dark-text/20">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/tools/image-resizer" 
                className="text-background/90 dark:text-dark-text hover:text-white dark:hover:text-white transition-colors px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Resize
              </Link>
              <Link 
                href="/tools/image-optimizer" 
                className="text-background/90 dark:text-dark-text hover:text-white dark:hover:text-white transition-colors px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Optimize
              </Link>
              <Link 
                href="/tools/image-converter" 
                className="text-background/90 dark:text-dark-text hover:text-white dark:hover:text-white transition-colors px-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Convert
              </Link>
            </div>
          </nav>
        </div>

        {/* Header Content */}
        <div className="py-8 text-center">
          <p className="text-4xl md:text-5xl font-bold mb-4 text-background dark:text-dark-text">PicShifter</p>
          <p className="text-xl mb-4 text-background dark:text-dark-text">
            Convert and Enhance Your Images Instantly 
          </p>
          {/* Trust Message */}
          <p className="text-sm mb-4 bg-background/90 dark:bg-dark-background/40 backdrop-blur-sm rounded-lg p-3 inline-block text-primary dark:text-dark-text">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Stateless & Secure: Your images are processed on-the-fly and never stored
            </span>
          </p>
        </div>
      </div>
    </header>
  );
}
