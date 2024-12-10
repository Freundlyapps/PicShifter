import { Metadata } from 'next';
import Contact from '../content/contact.mdx';
import MDXLayout from '../components/MDXLayout';

export const metadata: Metadata = {
  title: 'Contact Us | PicShifter',
  description: 'Get in touch with the PicShifter team. We value your feedback and suggestions.',
};

export default function ContactPage() {
  return (
    <MDXLayout>
      <Contact />
    </MDXLayout>
  );
}
