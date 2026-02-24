import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { rehypeFigureCaption } from './src/plugins/rehype-figure-caption.mjs';
import { rehypeVideo } from './src/plugins/rehype-video.mjs';
import { rehypeBaseUrl } from './src/plugins/rehype-base-url.mjs';

const baseUrl = '/portfolio/';

// Configuration Astro
export default defineConfig({
  site: 'https://astyanm.github.io',
  base: baseUrl,
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          fr: 'fr',
        },
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
    remarkPlugins: [remarkMath],
    rehypePlugins: [
      [rehypeKatex, { strict: 'ignore' }],
      rehypeFigureCaption,
      rehypeVideo,
      [rehypeBaseUrl, { base: baseUrl }]
    ],
  },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'fr'],
    routing: {
      prefixDefaultLocale: true,
    },
  },
  prefetch: {
    defaultStrategy: 'viewport',
  },
  image: {
    service: {
      entrypoint: './src/services/image-service.mjs',
    },
  },
});
