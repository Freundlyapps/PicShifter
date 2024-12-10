'use client';
import React from 'react';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const faqs = [
    {
      question: "What image formats are supported?",
      answer: "We support PNG, JPEG, WebP, AVIF, TFF and SVG formats"
    },
    {
      question: "Is there a file size limit?",
      answer: "Yes, maximum file size is 10MB per image"
    },
    {
      question: "How many images can I process?",
      answer: "Process unlimited images, one at a time"
    }
  ];

  return (
    <header className="bg-gradient-to-r from-primary to-mint dark:from-primary/80 dark:to-mint/80 dark:bg-dark-background text-white relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">PicShifter</h1>
          <p className="text-xl mb-4 text-white dark:text-white/90">
          Convert and Enhance Your Images Instantly 
          </p>
          {/* Trust Message */}
          <p className="text-sm mb-8 bg-white/10 dark:bg-dark-background/40 backdrop-blur-sm rounded-lg p-3 inline-block">
            <span className="inline-flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Stateless & Secure: Your images are processed on-the-fly and never stored
            </span>
          </p>
        </div>
        
        {/* FAQ Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-white/10 dark:bg-dark-background/40 backdrop-blur-sm rounded-lg p-6 
                         hover:bg-white/20 dark:hover:bg-dark-background/60 transition-colors duration-200"
            >
              <h3 className="font-semibold text-lg mb-2 text-white dark:text-white/90">
                {faq.question}
              </h3>
              <p className="text-white/90 dark:text-white/80">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
