import { motion } from 'framer-motion';
import { Calendar, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import type { Tag } from '@/consts';
import { ui } from '@/i18n/ui';

interface YearCount {
  year: number;
  count: number;
}

interface ProjectFiltersProps {
  // Year filter
  years: YearCount[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
  
  // Tag filter
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

const content = {
  fr: {
    allYears: 'Toutes les années',
    yearLabel: 'Période',
    tagsLabel: 'Tags',
    project: 'projet',
    projects: 'projets',
    allTags: 'Tous les tags',
    showMoreTags: 'Afficher tous les filtres',
    showLessTags: 'Réduire',
    techniques: 'Techniques',
    domains: 'Domaines',
    types: 'Type de réalisation',
  },
  en: {
    allYears: 'All years',
    yearLabel: 'Period',
    tagsLabel: 'Tags',
    project: 'project',
    projects: 'projects',
    allTags: 'All tags',
    showMoreTags: 'Show all filters',
    showLessTags: 'Show less',
    techniques: 'Techniques',
    domains: 'Domains',
    types: 'Type',
  },
};

export default function ProjectFilters({
  years,
  selectedYear,
  onSelectYear,
  tags,
  selectedTags,
  onSelectTags,
  lang,
  tagCounts,
  totalCount,
}: ProjectFiltersProps) {
  const t = ui[lang];
  const labels = content[lang];

  const translateTag = (tag: Tag): string => {
    const key = `tag.${tag}` as keyof typeof t;
    return t[key] || tag;
  };

  // Filter tags by category
  const getTagsForCategory = (category: readonly Tag[]) => {
    return category.filter(tag => tags.includes(tag as Tag) && tagCounts[tag as Tag] > 0);
  };

  const categorizedTags = {
    techniques: getTagsForCategory(tagCategories.techniques),
    domains: getTagsForCategory(tagCategories.domains),
    types: getTagsForCategory(tagCategories.types),
  };

  // Handlers
  const handleClearAllTags = () => {
    onSelectTags([]);
  };

  const handleToggleTag = (tag: Tag) => {
    if (selectedTags.includes(tag)) {
      onSelectTags(selectedTags.filter(t => t !== tag));
    } else {
      onSelectTags([...selectedTags, tag]);
    }
  };

  const isAllTagsSelected = selectedTags.length === 0;

  return (
    <div className="mb-8 py-4 px-5 rounded-xl bg-background-secondary/80 border border-border shadow-sm backdrop-blur-sm">
      {/* Mobile: Stacked layout */}
      <div className="md:hidden space-y-4">
        {/* Years */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-3.5 h-3.5 text-foreground-secondary" />
            <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">{labels.yearLabel}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={() => onSelectYear(null)}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                selectedYear === null
                  ? 'bg-accent text-white border-accent'
                  : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
              }`}
            >
              {labels.allYears}
            </motion.button>
            {years.map((item) => (
              <motion.button
                key={item.year}
                onClick={() => onSelectYear(item.year === selectedYear ? null : item.year)}
                whileTap={{ scale: 0.95 }}
                className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                  selectedYear === item.year
                    ? 'bg-accent text-white border-accent'
                    : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                }`}
              >
                {item.year} <span className="opacity-60">({item.count})</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Filter className="w-3.5 h-3.5 text-foreground-secondary" />
            <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">{labels.tagsLabel}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button
              onClick={handleClearAllTags}
              whileTap={{ scale: 0.95 }}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                isAllTagsSelected
                  ? 'bg-accent text-white border-accent'
                  : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
              }`}
            >
              {t['projects.filter.all']}
            </motion.button>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag);
              return (
                <motion.button
                  key={tag}
                  onClick={() => handleToggleTag(tag)}
                  whileTap={{ scale: 0.95 }}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                    isSelected
                      ? 'bg-accent text-white border-accent'
                      : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                  }`}
                >
                  {translateTag(tag)}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop: Timeline + Filters on separate lines */}
      <div className="hidden md:block space-y-3">
        {/* Line 1: Year Timeline */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 flex-shrink-0 w-24">
            <Calendar className="w-3.5 h-3.5 text-foreground-secondary" />
            <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">{labels.yearLabel}</span>
          </div>
          
          <motion.button
            onClick={() => onSelectYear(null)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
              selectedYear === null
                ? 'bg-accent text-white border-accent'
                : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
            }`}
          >
            {labels.allYears}
          </motion.button>

          {/* Timeline */}
          <div className="flex-1 relative min-w-[200px] max-w-[500px] my-2">
            <div className="relative h-0.5 bg-accent/20 rounded-full">
              {years.map((item, index) => {
                const isSelected = selectedYear === item.year;
                const position = (index / (years.length - 1)) * 100;

                return (
                  <div
                    key={item.year}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                    style={{ left: `${position}%` }}
                  >
                    <button
                      onClick={() => onSelectYear(item.year === selectedYear ? null : item.year)}
                      className="group block"
                    >
                      <motion.div
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.95 }}
                        className={`w-3 h-3 rounded-full border-2 transition-colors ${
                          isSelected
                            ? 'bg-accent border-accent shadow-md shadow-accent/30'
                            : 'bg-background border-accent/40 hover:border-accent'
                        }`}
                      />

                      {/* Tooltip */}
                      <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        <div className="bg-foreground text-background px-2 py-1 rounded text-xs font-medium whitespace-nowrap">
                          {item.year} ({item.count})
                        </div>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Year labels */}
          <div className="flex items-center gap-2">
            {years.map((item) => (
              <motion.button
                key={`label-${item.year}`}
                onClick={() => onSelectYear(item.year === selectedYear ? null : item.year)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  selectedYear === item.year
                    ? 'bg-accent text-white border-accent'
                    : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                }`}
              >
                {item.year}
                <span className="ml-1 text-xs opacity-60">({item.count})</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* Line 2: Tag Filters */}
        <div className="pt-3 border-t border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 w-24">
                <Filter className="w-3.5 h-3.5 text-foreground-secondary" />
                <span className="text-xs font-medium text-foreground-secondary uppercase tracking-wide">{labels.tagsLabel}</span>
              </div>
              
              <motion.button
                onClick={handleClearAllTags}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors border ${
                  isAllTagsSelected
                    ? 'bg-accent text-white border-accent'
                    : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                }`}
              >
                {t['projects.filter.all']}
              </motion.button>
            </div>

            {/* Categories */}
            <div className="grid grid-cols-3 gap-4">
              {/* Techniques */}
              {categorizedTags.techniques.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-foreground-secondary uppercase tracking-wider mb-1.5 text-center">
                    {labels.techniques}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {categorizedTags.techniques.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                            isSelected
                              ? 'bg-accent text-white border-accent'
                              : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                          }`}
                        >
                          {translateTag(tag)}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Domains */}
              {categorizedTags.domains.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-foreground-secondary uppercase tracking-wider mb-1.5 text-center">
                    {labels.domains}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {categorizedTags.domains.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                            isSelected
                              ? 'bg-accent text-white border-accent'
                              : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                          }`}
                        >
                          {translateTag(tag)}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Types */}
              {categorizedTags.types.length > 0 && (
                <div>
                  <h3 className="text-[10px] font-semibold text-foreground-secondary uppercase tracking-wider mb-1.5 text-center">
                    {labels.types}
                  </h3>
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {categorizedTags.types.map((tag) => {
                      const isSelected = selectedTags.includes(tag);
                      return (
                        <motion.button
                          key={tag}
                          onClick={() => handleToggleTag(tag)}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className={`px-3 py-1.5 rounded-lg text-sm transition-colors border ${
                            isSelected
                              ? 'bg-accent text-white border-accent'
                              : 'bg-background border-border text-foreground hover:text-accent hover:border-accent'
                          }`}
                        >
                          {translateTag(tag)}
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
