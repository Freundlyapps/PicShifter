'use client';
import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary to-mint dark:from-primary/80 dark:to-mint/80 dark:bg-dark-background text-white relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PicShifter</h1>
          <p className="text-xl mb-4 text-white dark:text-white/90">
          Convert and Enhance Your Images Instantly 
          </p>
          {/* Trust Message */}
          <p className="text-sm mb-4 bg-white/10 dark:bg-dark-background/40 backdrop-blur-sm rounded-lg p-3 inline-block">
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
