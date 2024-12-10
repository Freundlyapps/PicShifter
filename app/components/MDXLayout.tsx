import React from 'react';
import Link from 'next/link';

interface MDXLayoutProps {
  children: React.ReactNode;
}

export default function MDXLayout({ children }: MDXLayoutProps) {
  return (
    <main 
      className="min-h-screen bg-white dark:bg-gray-900"
      itemScope 
      itemType="http://schema.org/WebPage"
    >
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8 flex items-center">
          <Link 
            href="/" 
            className="flex items-center text-mint hover:text-mint/80 transition-colors"
            aria-label="Return to homepage"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-6 w-6 mr-2" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" 
              />
            </svg>
            <span className="text-lg font-semibold">Home</span>
          </Link>
        </div>
        <article 
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-white prose-p:text-gray-300 prose-a:text-mint hover:prose-a:text-mint/80 prose-strong:text-white prose-ul:text-gray-300"
          itemProp="mainEntity" 
          itemScope 
          itemType="http://schema.org/Article"
        >
          {children}
        </article>
      </div>
    </main>
  );
}
