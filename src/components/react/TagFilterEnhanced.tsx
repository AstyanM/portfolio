import { motion, AnimatePresence } from 'framer-motion';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Tag } from '@/consts';
import { ui } from '@/i18n/ui';

interface TagFilterEnhancedProps {
  tags: readonly Tag[];
  selectedTags: Tag[];
  onSelectTags: (tags: Tag[]) => void;
  lang: 'fr' | 'en';
  tagCounts: Record<Tag, number>;
  totalCount: number;
}

// Catégorisation des tags
const tagCategories = {
  techniques: ['Deep Learning', 'Traitement du Signal', 'Vision par Ordinateur', 'Simulation'] as const,
  domains: ['Santé', 'Web', 'Sécurité', 'Architecture'] as const,
  types: ['Hardware', 'Recherche', 'Embarqué'] as const,
};

export default function TagFilterEnhanced({
  tags,
  selectedTags,
  onSelectTags,
  lang,
  tagCounts,
  totalCount,
}: TagFilterEnhancedProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const t = ui[lang];

  const categoryLabels = {
    fr: {
      techniques: 'Techniques',
      domains: 'Domaines',
      types: 'Type de réalisation',
      showMore: 'Afficher tous les filtres',
      showLess: 'Réduire les filtres',
    },
    en: {
      techniques: 'Techniques',
      domains: 'Domains',
      types: 'Type',
      showMore: 'Show all filters',
      showLess: 'Show less',
    },
  };

  const translateTag = (tag: Tag): string => {
    const key = `tag.${tag}` as keyof typeof t;
    return t[key] || tag;
  };

  const labels = categoryLabels[lang];

  // Filter tags by category and exclude those with 0 count
  const getTagsForCategory = (category: readonly Tag[]) => {
    return category.filter(tag => tags.includes(tag as Tag) && tagCounts[tag as Tag] > 0);
  };

  const categorizedTags = {
    techniques: getTagsForCategory(tagCategories.techniques),
    domains: getTagsForCategory(tagCategories.domains),
    types: getTagsForCategory(tagCategories.types),
  };

  // Top 5 tags for collapsed view
  const topTags = tags.slice(0, 5);

  // Handlers
  const handleClearAll = () => {
    onSelectTags([]);
  };

  const handleToggleTag = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      // Remove tag
      onSelectTags(selectedTags.filter(t => t !== tag));
    } else {
      // Add tag
      onSelectTags([...selectedTags, tag]);
    }
  };

  const isAllSelected = selectedTags.length === 0;

  return (
    <div className="mb-8 py-6 px-6 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/8 to-accent/10 border-2 border-accent/20 shadow-xl shadow-black/5 dark:shadow-black/20 backdrop-blur-sm">
      {/* Mobile: Simple wrap */}
      <div className="md:hidden">
        <div className="flex flex-wrap gap-2 justify-center">
          <motion.button
            onClick={handleClearAll}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
              isAllSelected
                ? 'bg-accent text-white border-accent'
                : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            {t['projects.filter.all']}
            <span className={`ml-1.5 text-xs ${isAllSelected ? 'opacity-70' : 'opacity-60'}`}>
              ({totalCount})
            </span>
          </motion.button>

          {tags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            return (
              <motion.button
                key={tag}
                onClick={() => handleToggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isSelected
                    ? 'bg-accent text-white border-accent'
                    : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {translateTag(tag)}
                <span className={`ml-1.5 text-xs ${isSelected ? 'opacity-70' : 'opacity-60'}`}>
                  ({tagCounts[tag]})
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Desktop: Categorized with collapse */}
      <div className="hidden md:block">
        {/* Collapsed view */}
        {!isExpanded && (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Filter className="w-4 h-4 text-accent flex-shrink-0" />
              <motion.button
                onClick={handleClearAll}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                  isAllSelected
                    ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                    : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
                }`}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
              >
                {t['projects.filter.all']}
                <span className={`ml-1.5 text-xs ${isAllSelected ? 'opacity-70' : 'opacity-60'}`}>
                  ({totalCount})
                </span>
              </motion.button>
            </div>
            
            <motion.button
              onClick={() => setIsExpanded(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-colors border border-accent/20"
            >
              {labels.showMore}
              <ChevronDown className="w-4 h-4" />
            </motion.button>
          </div>
        )}

        {/* Expanded view */}
        {isExpanded && (
          <div className="space-y-4">
            {/* Header with collapse button */}
            <div className="flex items-center justify-between pb-3 border-b border-accent/10">
              <div className="flex items-center gap-3">
                <Filter className="w-4 h-4 text-accent flex-shrink-0" />
                <motion.button
                  onClick={handleClearAll}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    isAllSelected
                      ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                      : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
                  }`}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {t['projects.filter.all']}
                  <span className={`ml-1.5 text-xs ${isAllSelected ? 'opacity-70' : 'opacity-60'}`}>
                    ({totalCount})
                  </span>
                </motion.button>
              </div>
              
              <motion.button
                onClick={() => setIsExpanded(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-accent hover:bg-accent/10 transition-colors border border-accent/20"
              >
                {labels.showLess}
                <ChevronUp className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Techniques */}
            {categorizedTags.techniques.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
                  {labels.techniques}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorizedTags.techniques.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                            : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {translateTag(tag)}
                        <span className={`ml-1.5 text-xs ${isSelected ? 'opacity-70' : 'opacity-60'}`}>
                          ({tagCounts[tag]})
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Domains */}
            {categorizedTags.domains.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
                  {labels.domains}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorizedTags.domains.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                            : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {translateTag(tag)}
                        <span className={`ml-1.5 text-xs ${isSelected ? 'opacity-70' : 'opacity-60'}`}>
                          ({tagCounts[tag]})
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Types */}
            {categorizedTags.types.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-foreground-secondary uppercase tracking-wider mb-2">
                  {labels.types}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categorizedTags.types.map((tag) => {
                    const isSelected = selectedTags.includes(tag);
                    return (
                      <motion.button
                        key={tag}
                        onClick={() => handleToggleTag(tag)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                          isSelected
                            ? 'bg-accent text-white border-accent shadow-lg shadow-accent/20'
                            : 'bg-background-secondary border-border text-foreground hover:border-accent hover:text-accent'
                        }`}
                        whileTap={{ scale: 0.95 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {translateTag(tag)}
                        <span className={`ml-1.5 text-xs ${isSelected ? 'opacity-70' : 'opacity-60'}`}>
                          ({tagCounts[tag]})
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
