declare module '*.mdx' {
  import type { ReactElement } from 'react';
  const component: () => ReactElement;
  export default component;
}
