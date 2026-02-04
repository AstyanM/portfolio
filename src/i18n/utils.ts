import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  // Remove base path first
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let pathname = url.pathname;
  if (pathname.startsWith(base)) {
    pathname = pathname.slice(base.length);
  }
  
  // Now extract language from path without base
  const [, lang] = pathname.split('/');
  if (lang in ui) return lang as Lang;
  return defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]): string {
    return ui[lang][key] || ui[defaultLang][key];
  };
}

export function getLocalizedPath(path: string, lang: Lang): string {
  // Remove any existing locale prefix
  const cleanPath = path.replace(/^\/(fr|en)/, '');
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${lang}${cleanPath || '/'}`;
}

export function getProjectsPath(lang: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return lang === 'fr' ? `${base}/${lang}/projets` : `${base}/${lang}/projects`;
}

export function getProjectPath(slug: string, lang: Lang): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return lang === 'fr' ? `${base}/${lang}/projets/${slug}` : `${base}/${lang}/projects/${slug}`;
}

// Get alternate language
export function getAlternateLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}

// Get the alternate URL for the current page (for hreflang tags)
export function getAlternateUrl(currentUrl: URL, targetLang: Lang, site: URL | undefined): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  let pathname = currentUrl.pathname;

  // Remove base path
  if (pathname.startsWith(base)) {
    pathname = pathname.slice(base.length);
  }

  // Replace /fr/ or /en/ prefix with target lang
  const newPath = pathname.replace(/^\/(fr|en)/, `/${targetLang}`);

  // Handle project route differences: /fr/projets/ <-> /en/projects/
  let finalPath: string;
  if (targetLang === 'fr') {
    finalPath = newPath.replace(/^\/fr\/projects(\/|$)/, '/fr/projets$1');
  } else {
    finalPath = newPath.replace(/^\/en\/projets(\/|$)/, '/en/projects$1');
  }

  const origin = site?.origin || currentUrl.origin;
  return `${origin}${base}${finalPath}`;
}

// Get full URL for public assets (images, etc.) with base path
export function getAssetUrl(path: string): string {
  if (!path) return '';
  // If already absolute URL or data URI, return as is
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  // If relative path starting with /, prepend base URL
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (path.startsWith('/')) {
    return `${base}${path}`;
  }
  return path;
}
