import { ui, defaultLang, type Lang } from './ui';


// Helper to ensure base URL always ends with a slash
const getBaseUrl = () => {
  const base = import.meta.env.BASE_URL;
  return base.endsWith('/') ? base : `${base}/`;
};

export function getLangFromUrl(url: URL): Lang {
  // Handle base path for GitHub Pages
  const basePath = import.meta.env.BASE_URL;
  // Ensure we strip the base correctly regardless of trailing slash
  const pathname = url.pathname.replace(basePath, '/').replace(/\/+/g, '/');
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
  // base (with slash) + lang + path
  return `${getBaseUrl()}${lang}${cleanPath || '/'}`.replace(/\/+/g, '/');
}

export function getProjectsPath(lang: Lang): string {
  const path = lang === 'fr' ? `${lang}/projets` : `${lang}/projects`; // No leading slash
  return `${getBaseUrl()}${path}`.replace(/\/+/g, '/');
}

export function getProjectPath(slug: string, lang: Lang): string {
  const path = lang === 'fr' ? `${lang}/projets/${slug}` : `${lang}/projects/${slug}`;
  return `${getBaseUrl()}${path}`.replace(/\/+/g, '/');
}

// Get alternate language
export function getAlternateLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}
