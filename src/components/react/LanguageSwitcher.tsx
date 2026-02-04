import { Globe } from 'lucide-react';
import type { Lang } from '@/i18n/ui';
import { getAlternateLang } from '@/i18n/utils';

interface LanguageSwitcherProps {
  lang: Lang;
  currentPath: string;
}

export default function LanguageSwitcher({ lang, currentPath }: LanguageSwitcherProps) {
  const alternateLang = getAlternateLang(lang);

  // Build the alternate URL by swapping the locale
  const getAlternateUrl = () => {
    const base = import.meta.env.BASE_URL.replace(/\/$/, '');
    
    // Remove base path first, then current locale prefix
    let pathWithoutBase = currentPath;
    if (pathWithoutBase.startsWith(base)) {
      pathWithoutBase = pathWithoutBase.slice(base.length);
    }
    const pathWithoutLocale = pathWithoutBase.replace(/^\/(fr|en)/, '');

    // Handle projects/projets path difference based on TARGET language
    let newPath = pathWithoutLocale;
    // If going TO French (from EN), convert projects → projets
    if (alternateLang === 'fr' && pathWithoutLocale.startsWith('/projects')) {
      newPath = pathWithoutLocale.replace('/projects', '/projets');
    } 
    // If going TO English (from FR), convert projets → projects
    else if (alternateLang === 'en' && pathWithoutLocale.startsWith('/projets')) {
      newPath = pathWithoutLocale.replace('/projets', '/projects');
    }

    return `${base}/${alternateLang}${newPath || '/'}`;
  };

  const alternateUrl = getAlternateUrl();

  return (
    <a
      href={alternateUrl}
      data-astro-prefetch="viewport"
      className="flex items-center gap-1.5 px-3 py-3 md:py-1.5 rounded-lg bg-background-secondary border border-border hover:border-accent transition-colors text-sm font-medium text-foreground-secondary hover:text-foreground active:scale-95"
      title={`Switch to ${alternateLang === 'fr' ? 'Français' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{alternateLang}</span>
    </a>
  );
}
