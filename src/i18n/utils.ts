import { ui, defaultLang, type Lang } from './ui';


export function getLangFromUrl(url: URL): Lang {
  // Handle base path for GitHub Pages
  const basePath = import.meta.env.BASE_URL;
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
  return `${import.meta.env.BASE_URL}/${lang}${cleanPath || '/'}`.replace(/\/+/g, '/');
}

export function getProjectsPath(lang: Lang): string {
  const path = lang === 'fr' ? `/${lang}/projets` : `/${lang}/projects`;
  return `${import.meta.env.BASE_URL}/${path}`.replace(/\/+/g, '/');
}

export function getProjectPath(slug: string, lang: Lang): string {
  const path = lang === 'fr' ? `/${lang}/projets/${slug}` : `/${lang}/projects/${slug}`;
  return `${import.meta.env.BASE_URL}/${path}`.replace(/\/+/g, '/');
}

// Get alternate language
export function getAlternateLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}
