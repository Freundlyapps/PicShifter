import { Metadata } from 'next';
import MDXLayout from '../components/MDXLayout';
import Terms from '../content/terms.mdx';

export const metadata: Metadata = {
  title: 'Terms of Service | PicShifter',
  description: 'PicShifter terms of service - Learn about our usage rules and policies.',
};

export default function TermsPage() {
  return (
    <MDXLayout>
      <Terms />
    </MDXLayout>
  );
}
