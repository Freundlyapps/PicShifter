import React from 'react';
import Header from './components/Header';
import FAQ from './components/FAQ';
import UploadZone from './components/UploadZone';
import Features from './components/Features';
import Footer from './components/Footer';
import SpecializedTools from './components/SpecializedTools';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-background dark:bg-dark-background">
      <Header />
      <FAQ />
      <SpecializedTools />
      
      <section id="upload-section" className="flex-grow py-12 bg-background dark:bg-dark-background">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8 text-text dark:text-white">
              Upload Your Image
            </h2>
            <UploadZone />
          </div>
        </div>
      </section>

      <Features />
      <Footer />
    </main>
  )
}
