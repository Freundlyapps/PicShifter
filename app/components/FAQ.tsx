'use client';
import React from 'react';

export default function FAQ() {
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
    <section className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {faqs.map((faq, index) => (
          <div 
            key={index}
            className="bg-primary/10 dark:bg-dark-background/40 backdrop-blur-sm rounded-lg p-6 
                       hover:bg-primary/20 dark:hover:bg-dark-background/60 transition-colors duration-200"
          >
            <h3 className="font-semibold text-lg mb-2 text-text dark:text-white">
              {faq.question}
            </h3>
            <p className="text-text dark:text-white">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
