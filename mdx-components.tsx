import type { MDXComponents } from 'mdx/types'
import { HTMLAttributes, DetailedHTMLProps } from 'react'

type HeadingProps = DetailedHTMLProps<HTMLAttributes<HTMLHeadingElement>, HTMLHeadingElement>
type ParagraphProps = DetailedHTMLProps<HTMLAttributes<HTMLParagraphElement>, HTMLParagraphElement>
type ListProps = DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>
type ListItemProps = DetailedHTMLProps<HTMLAttributes<HTMLLIElement>, HTMLLIElement>

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: (props: HeadingProps) => (
      <h1 
        {...props}
        className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100"
        itemProp="headline"
      />
    ),
    h2: (props: HeadingProps) => (
      <h2 
        {...props}
        className="text-2xl font-semibold mb-4 mt-8 text-gray-800 dark:text-gray-200"
        itemProp="name"
      />
    ),
    h3: (props: HeadingProps) => (
      <h3 
        {...props}
        className="text-xl font-semibold mb-3 mt-6 text-gray-800 dark:text-gray-200"
      />
    ),
    p: (props: ParagraphProps) => (
      <p 
        {...props}
        className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed"
        itemProp="text"
      />
    ),
    ul: (props: ListProps) => (
      <ul 
        {...props}
        className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300"
        itemScope
        itemProp="itemListElement"
      />
    ),
    li: (props: ListItemProps) => (
      <li 
        {...props}
        className="mb-2"
        itemProp="item"
      />
    ),
    article: ({ children, ...props }) => (
      <article 
        {...props}
        className="prose prose-lg max-w-none dark:prose-invert"
        itemScope
        itemType="http://schema.org/Article"
      >
        {children}
      </article>
    ),
    ...components,
  }
}
