import { Metadata } from 'next';
import MDXLayout from '../components/MDXLayout';
import FAQ from '../content/faq.mdx';

export const metadata: Metadata = {
  title: 'FAQ | PicShifter',
  description: 'Frequently asked questions about PicShifter - Learn about supported formats, security, and how to use our image processing tools.',
};

export default function FAQPage() {
  return (
    <MDXLayout>
      <FAQ />
    </MDXLayout>
  );
}
