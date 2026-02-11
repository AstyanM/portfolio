import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import LanguageSwitcher from './LanguageSwitcher';
import type { Lang } from '@/i18n/ui';
import { ui } from '@/i18n/ui';
import { getProjectsPath } from '@/i18n/utils';

interface HeaderProps {
  lang: Lang;
  currentPath: string;
}

export default function Header({ lang, currentPath }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentHash, setCurrentHash] = useState('');

  // Local state that updates on navigation (props don't update with transition:persist)
  const [activeLang, setActiveLang] = useState(lang);
  const [activePath, setActivePath] = useState(currentPath);

  const t = ui[activeLang];
  const projectsPath = getProjectsPath(activeLang);
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');

  const navItems = [
    { label: t['nav.home'], href: `${base}/${activeLang}` },
    { label: t['nav.projects'], href: projectsPath },
    { label: t['nav.contact'], href: `${base}/${activeLang}#contact` },
  ];

  // Listen for Astro page navigations to update lang/path
  useEffect(() => {
    const handlePageLoad = () => {
      const newPath = window.location.pathname;
      const langMatch = newPath.match(/\/(en|fr)(\/|$)/);
      const newLang = (langMatch ? langMatch[1] : 'en') as Lang;
      setActiveLang(newLang);
      setActivePath(newPath);
      setCurrentHash(window.location.hash);
      setIsMobileMenuOpen(false);
    };

    document.addEventListener('astro:after-swap', handlePageLoad);
    return () => document.removeEventListener('astro:after-swap', handlePageLoad);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    const handleHashChange = () => {
      setCurrentHash(window.location.hash);
    };

    // Set initial hash
    setCurrentHash(window.location.hash);

    // Observe contact section to update hash when scrolling
    const contactSection = document.getElementById('contact');
    let observer: IntersectionObserver | null = null;

    if (contactSection) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setCurrentHash('#contact');
            } else {
              setCurrentHash('');
            }
          });
        },
        {
          threshold: 0.3,
          rootMargin: '-80px 0px 0px 0px',
        }
      );

      observer.observe(contactSection);
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      observer?.disconnect();
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activePath]);

  const isActive = (href: string) => {
    // Check if it's a hash link (like #contact)
    if (href.includes('#')) {
      const hrefHash = href.split('#')[1];
      return currentHash === `#${hrefHash}`;
    }

    // For home page
    if (href === `${base}/${activeLang}`) {
      return (activePath === `${base}/${activeLang}` || activePath === `${base}/${activeLang}/`) && !currentHash;
    }

    return activePath.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        isScrolled || isMobileMenuOpen ? 'glass border-border' : 'bg-transparent border-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8" aria-label={activeLang === 'fr' ? 'Navigation principale' : 'Main navigation'}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href={`${base}/${activeLang}`}
            className="text-xl font-bold font-display bg-foreground text-background px-3 py-1 rounded-full hover:bg-accent hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            AM
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <ul className="flex items-center gap-6">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`relative text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? 'text-foreground'
                        : 'text-foreground-secondary hover:text-foreground'
                    }`}
                  >
                    {item.label}
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <LanguageSwitcher lang={activeLang} currentPath={activePath} />
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher lang={activeLang} currentPath={activePath} />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-3 rounded-lg hover:bg-background-secondary active:scale-95 transition-all"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-foreground" />
              ) : (
                <Menu className="w-5 h-5 text-foreground" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden backdrop-blur-2xl bg-background/95 -mx-4 px-4 rounded-b-2xl border-b border-border shadow-2xl"
            >
              <ul className="py-4 space-y-2">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive(item.href)
                          ? 'bg-accent/10 text-accent'
                          : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
                      }`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
