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
  return `/${lang}${cleanPath || '/'}`;
}

export function getProjectsPath(lang: Lang): string {
  return lang === 'fr' ? `/${lang}/projets` : `/${lang}/projects`;
}

export function getProjectPath(slug: string, lang: Lang): string {
  return lang === 'fr' ? `/${lang}/projets/${slug}` : `/${lang}/projects/${slug}`;
}

// Get alternate language
export function getAlternateLang(lang: Lang): Lang {
  return lang === 'fr' ? 'en' : 'fr';
}
