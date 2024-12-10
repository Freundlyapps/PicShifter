import { Metadata } from 'next';
import MDXLayout from '../components/MDXLayout';
import About from '../content/about.mdx';

export const metadata: Metadata = {
  title: 'About PicShifter | Fast, Free Image Processing',
  description: 'Learn about PicShifter - your go-to platform for fast, free, and secure image processing. Convert, resize, and enhance images directly in your browser.',
};

export default function AboutPage() {
  return (
    <MDXLayout>
      <About />
    </MDXLayout>
  );
}
