import { motion } from 'framer-motion';
import type { Tag } from '@/consts';
import { ui } from '@/i18n/ui';

interface TagFilterProps {
  tags: readonly Tag[];
  selectedTag: Tag | null;
  onSelectTag: (tag: Tag | null) => void;
  lang: 'fr' | 'en';
}

export default function TagFilter({
  tags,
  selectedTag,
  onSelectTag,
  lang,
}: TagFilterProps) {
  const t = ui[lang];

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      <motion.button
        onClick={() => onSelectTag(null)}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === null
            ? 'bg-accent text-white'
            : 'bg-background-secondary border border-border text-foreground-secondary hover:border-accent hover:text-accent'
          }`}
        whileTap={{ scale: 0.95 }}
      >
        {t['projects.filter.all']}
      </motion.button>

      {tags.map((tag) => (
        <motion.button
          key={tag}
          onClick={() => onSelectTag(tag)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedTag === tag
              ? 'bg-accent text-white'
              : 'bg-background-secondary border border-border text-foreground-secondary hover:border-accent hover:text-accent'
            }`}
          whileTap={{ scale: 0.95 }}
        >
          {tag}
        </motion.button>
      ))}
    </div>
  );
}
