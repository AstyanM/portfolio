import {visit} from 'unist-util-visit';

/**
 * Rehype plugin to prepend the base URL to image sources in markdown content
 * This ensures images work correctly when deployed to GitHub Pages with a base path
 */
export function rehypeBaseUrl(config) {
  return (tree) => {
    // Get base URL from config, default to empty string
    const base = config?.base?.replace(/\/$/, '') || '';
    
    // Only process if we have a base URL (not empty or just '/')
    if (!base || base === '') {
      return;
    }

    visit(tree, 'element', (node) => {
      // Handle img tags
      if (node.tagName === 'img' && node.properties && node.properties.src) {
        const src = node.properties.src;
        // Only prepend base to relative URLs starting with /
        if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')) {
          node.properties.src = `${base}${src}`;
        }
      }

      // Handle video tags (for video content in markdown)
      if (node.tagName === 'video' && node.properties && node.properties.src) {
        const src = node.properties.src;
        if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')) {
          node.properties.src = `${base}${src}`;
        }
      }

      // Handle source tags inside video/picture elements
      if (node.tagName === 'source' && node.properties && node.properties.src) {
        const src = node.properties.src;
        if (typeof src === 'string' && src.startsWith('/') && !src.startsWith('//')) {
          node.properties.src = `${base}${src}`;
        }
      }
    });
  };
}
