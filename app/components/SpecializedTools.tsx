import Link from 'next/link';
import { FaImage, FaFileImage, FaCompress } from 'react-icons/fa';

const tools = [
  {
    icon: FaCompress,
    title: 'Image Optimizer',
    description: 'Compress and optimize your images while maintaining quality',
    link: '/optimize',
    color: 'bg-blue-500',
  },
  {
    icon: FaFileImage,
    title: 'PDF to Image',
    description: 'Convert PDF pages to high-quality images',
    link: '/pdf-to-image',
    color: 'bg-green-500',
  },
  {
    icon: FaImage,
    title: 'Image Resizer (Single & Bulk)',
    description: 'Resize single or multiple images with custom dimensions in a few clicks.',
    link: '/resize',
    color: 'bg-purple-500',
  },
];

export default function SpecializedTools() {
  return (
    <section className="py-12 bg-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8 text-text dark:text-white">
          Specialized Tools
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.title}
                href={tool.link}
                className="group block p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className={`${tool.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-white`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text dark:text-white group-hover:text-primary">
                  {tool.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {tool.description}
                </p>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  );
}
