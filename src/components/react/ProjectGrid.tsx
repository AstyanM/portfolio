import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectCard from './ProjectCard';
import ProjectCtaCard from './ProjectCtaCard';
import TagFilterEnhanced from './TagFilterEnhanced';
import type { Tag } from '@/consts';
import { availableTags } from '@/consts';

interface Project {
  slug: string;
  title: string;
  description?: string;
  tags: Tag[];
  href: string;
  coverUrl?: string;
  repoUrl?: string;
  year?: number;
}

interface ProjectGridProps {
  projects: Project[];
  lang: 'fr' | 'en';
  showFilter?: boolean;
  mobileLimit?: number;
  ctaCard?: {
    href: string;
  };
  yearFilter?: number | null;
}

function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

export default function ProjectGrid({ projects, lang, showFilter = true, mobileLimit, ctaCard, yearFilter }: ProjectGridProps) {
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const isMobile = useIsMobile();

  // Calculate tag counts
  const tagCounts = availableTags.reduce((acc, tag) => {
    acc[tag] = projects.filter((p) => p.tags.includes(tag)).length;
    return acc;
  }, {} as Record<Tag, number>);

  // Get tags that are actually used in projects, sorted by usage count (descending)
  const usedTags = availableTags
    .filter((tag) => tagCounts[tag] > 0)
    .sort((a, b) => tagCounts[b] - tagCounts[a]);

  // Apply year filter first
  const yearFilteredProjects = yearFilter 
    ? projects.filter((p) => p.year === yearFilter)
    : projects;

  // Apply tag filter - project must have AT LEAST ONE selected tag (OR logic)
  // Then sort by number of matching tags (most matches first)
  const tagFilteredProjects = selectedTags.length > 0
    ? yearFilteredProjects
        .filter((p) => selectedTags.some(tag => p.tags.includes(tag)))
        .sort((a, b) => {
          const aMatches = selectedTags.filter(tag => a.tags.includes(tag)).length;
          const bMatches = selectedTags.filter(tag => b.tags.includes(tag)).length;
          return bMatches - aMatches; // Sort descending by number of matches
        })
    : yearFilteredProjects;

  const filteredProjects = mobileLimit && isMobile
    ? tagFilteredProjects.slice(0, mobileLimit)
    : tagFilteredProjects;

  return (
    <div>
      {showFilter && usedTags.length > 0 && (
        <TagFilterEnhanced
          tags={usedTags}
          selectedTags={selectedTags}
          onSelectTags={setSelectedTags}
          lang={lang}
          tagCounts={tagCounts}
          totalCount={projects.length}
        />
      )}

      <motion.div
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ProjectCard
                title={project.title}
                description={project.description}
                tags={project.tags}
                slug={project.slug}
                href={project.href}
                coverUrl={project.coverUrl}
                repoUrl={project.repoUrl}
                year={project.year}
                index={index}
                lang={lang}
              />
            </motion.div>
          ))}
          
          {/* CTA Card as last item */}
          {ctaCard && (
            <motion.div
              key="cta-card"
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <ProjectCtaCard 
                href={ctaCard.href}
                lang={lang}
                index={filteredProjects.length}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-foreground-secondary py-12"
        >
          {lang === 'fr'
            ? 'Aucun projet avec ce tag.'
            : 'No projects with this tag.'}
        </motion.p>
      )}
    </div>
  );
}
