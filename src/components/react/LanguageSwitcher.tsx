import { motion } from 'framer-motion';
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
    // Handle base path
    const basePath = import.meta.env.BASE_URL;
    const pathWithoutBase = currentPath.startsWith(basePath) 
      ? '/' + currentPath.slice(basePath.length) 
      : currentPath;
      
    // Remove current locale prefix and add new one
    const pathWithoutLocale = pathWithoutBase.replace(/^\/(fr|en)/, '');

    // Handle projects/projets path difference
    let newPath = pathWithoutLocale;
    if (lang === 'fr' && pathWithoutLocale.startsWith('/projets')) {
      newPath = pathWithoutLocale.replace('/projets', '/projects');
    } else if (lang === 'en' && pathWithoutLocale.startsWith('/projects')) {
      newPath = pathWithoutLocale.replace('/projects', '/projets');
    }

    return `${basePath}/${alternateLang}${newPath || '/'}`.replace(/\/+/g, '/');
  };

  return (
    <motion.a
      href={getAlternateUrl()}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-background-secondary border border-border hover:border-accent transition-colors text-sm font-medium text-foreground-secondary hover:text-foreground"
      whileTap={{ scale: 0.95 }}
      title={`Switch to ${alternateLang === 'fr' ? 'Français' : 'English'}`}
    >
      <Globe className="w-4 h-4" />
      <span className="uppercase">{alternateLang}</span>
    </motion.a>
  );
}
