import React from 'react';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  const sections = [
    {
      title: 'Features',
      links: [
        { name: 'Image Resize', href: '#' },
        { name: 'Grayscale', href: '#' },
        { name: 'Blur Effect', href: '#' }
      ]
    },
    {
      title: 'Company',
      links: [
        { name: 'About', href: '/about' },
        { name: 'FAQ', href: '/faq' },
        { name: 'Contact', href: '/contact' }
      ]
    },
    {
      title: 'Legal',
      links: [
        { name: 'Privacy Policy', href: '/privacy' },
        { name: 'Terms of Service', href: '/terms' }
      ]
    }
  ];

  return (
    <footer className="bg-primary dark:bg-dark-background border-t dark:border-primary/20 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1">
            <h3 className="text-2xl font-bold mb-4 text-white dark:text-white">PicShifter</h3>
            <p className="text-white/95 dark:text-white/80 mb-4">
              Convert and enhance your images with our powerful processing tools.
              Fast, easy, and free image processing for everyone.
            </p>
          </div>

          {/* Links Sections */}
          {sections.map((section) => (
            <div key={section.title}>
              <h4 className="text-lg font-semibold mb-4 text-white dark:text-white/95">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-white/90 dark:text-white/80 hover:text-mint dark:hover:text-mint/90 
                               transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Privacy & Data Handling */}
        <div className="bg-white/10 dark:bg-dark-background/40 rounded-lg p-4 mt-8">
          <h4 className="font-semibold mb-2 text-white dark:text-white/90">Privacy & Data Handling</h4>
          <p className="text-sm text-white/90 dark:text-white/80">
            PicShifter processes your images in real-time without storing any data. Your uploads are automatically deleted after processing, ensuring complete privacy and security. We don't use cookies or track your usage.
          </p>
        </div>

        {/* Copyright & Trust Badge */}
        <div className="border-t border-white/30 dark:border-white/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/95 dark:text-white/90">
              © {currentYear} PicShifter. All rights reserved.
            </p>
            <div className="flex items-center text-sm text-white/90 dark:text-white/80">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure Processing • No Data Storage • Free Forever
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
