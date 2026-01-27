import { motion } from 'framer-motion';
import type { Tag } from '@/consts';
import { ui } from '@/i18n/ui';

interface TagFilterProps {
  tags: readonly Tag[];
  selectedTag: Tag | null;
  onSelectTag: (tag: Tag | null) => void;
  lang: 'fr' | 'en';
  tagCounts: Record<Tag, number>;
  totalCount: number;
}

export default function TagFilter({
  tags,
  selectedTag,
  onSelectTag,
  lang,
  tagCounts,
  totalCount,
}: TagFilterProps) {
  const t = ui[lang];

  const translateTag = (tag: Tag): string => {
    const key = `tag.${tag}` as keyof typeof t;
    return t[key] || tag;
  };

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
        <span className={`ml-1.5 ${selectedTag === null ? 'text-white/70' : 'text-foreground-secondary/70'}`}>
          ({totalCount})
        </span>
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
          {translateTag(tag)}
          <span className={`ml-1.5 ${selectedTag === tag ? 'text-white/70' : 'text-foreground-secondary/70'}`}>
            ({tagCounts[tag]})
          </span>
        </motion.button>
      ))}
    </div>
  );
}
