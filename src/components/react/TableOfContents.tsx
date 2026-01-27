import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { List, ChevronDown, ChevronUp } from 'lucide-react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  lang: 'fr' | 'en';
}

export default function TableOfContents({ lang }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TocItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');

  const labels = {
    fr: 'Sommaire',
    en: 'Table of Contents',
  };

  useEffect(() => {
    const article = document.querySelector('article .prose');
    if (!article) return;

    const elements = article.querySelectorAll('h2, h3');
    const items: TocItem[] = [];

    elements.forEach((el, index) => {
      const text = el.textContent || '';
      // Skip empty headings or "Sommaire" / "Table of Contents"
      if (!text.trim() || text.toLowerCase().includes('sommaire') || text.toLowerCase().includes('table of contents')) {
        return;
      }

      // Generate ID if not present
      let id = el.id;
      if (!id) {
        id = text
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim();
        if (!id) id = `heading-${index}`;
        el.id = id;
      }

      items.push({
        id,
        text: text.trim(),
        level: el.tagName === 'H2' ? 2 : 3,
      });
    });

    // Add conclusion section if it exists
    const conclusionHeading = document.querySelector('#conclusion');
    if (conclusionHeading) {
      items.push({
        id: 'conclusion',
        text: conclusionHeading.textContent?.trim() || 'Conclusion',
        level: 2,
      });
    }

    // Add appendix section if it exists
    const appendixHeading = document.querySelector('#appendix');
    if (appendixHeading) {
      items.push({
        id: 'appendix',
        text: appendixHeading.textContent?.trim() || (lang === 'fr' ? 'Annexes' : 'Appendices'),
        level: 2,
      });
    }

    setHeadings(items);
  }, []);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="mb-8 border border-border rounded-lg bg-background-secondary/50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-background-secondary/80 transition-colors rounded-lg"
      >
        <span className="flex items-center gap-2 font-medium text-foreground">
          <List className="w-4 h-4 text-accent" />
          {labels[lang]}
        </span>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-foreground-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-foreground-secondary" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-1">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: heading.level === 3 ? '1rem' : '0' }}
                >
                  <button
                    onClick={() => scrollToHeading(heading.id)}
                    className={`
                      text-left w-full py-1.5 px-2 rounded text-sm transition-all
                      ${activeId === heading.id
                        ? 'text-accent bg-accent/10 font-medium'
                        : 'text-foreground-secondary hover:text-foreground hover:bg-background-secondary'
                      }
                      ${heading.level === 3 ? 'text-xs' : ''}
                    `}
                  >
                    {heading.text}
                  </button>
                </li>
              ))}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </div>
  );
}
