import { ui, defaultLang, type Lang } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
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
