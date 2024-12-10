import { Metadata } from 'next';
import MDXLayout from '../components/MDXLayout';
import Privacy from '../content/privacy.mdx';

export const metadata: Metadata = {
  title: 'Privacy Policy | PicShifter',
  description: 'PicShifter privacy policy - Learn how we protect your data and ensure secure image processing.',
};

export default function PrivacyPage() {
  return (
    <MDXLayout>
      <Privacy />
    </MDXLayout>
  );
}
