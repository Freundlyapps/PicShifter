import React from 'react';

export default function Features() {
  const features = [
    {
      title: 'Resize Images',
      description: 'Automatically resize your images while maintaining aspect ratio'
    },
    {
      title: 'Grayscale Conversion',
      description: 'Convert your images to grayscale with a single click'
    },
    {
      title: 'Blur Effect',
      description: 'Apply a subtle blur effect to your images'
    }
  ];

  return (
    <section className="py-12 bg-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-text dark:text-white">
          Image Processing Features
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="bg-white dark:bg-dark-background border-2 p-6 rounded-lg 
                         shadow-md dark:shadow-none
                         hover:shadow-lg transition-all duration-300 
                         hover:border-mint border-transparent
                         dark:border-primary/20 dark:hover:border-mint"
            >
              <h3 className="text-xl font-semibold mb-3 text-primary dark:text-mint">
                {feature.title}
              </h3>
              <p className="text-text dark:text-white/80">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
