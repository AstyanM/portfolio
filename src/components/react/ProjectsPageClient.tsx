import { useState } from 'react';
import ProjectFilters from './ProjectFilters';
import ProjectGrid from './ProjectGrid';
import type { Tag } from '@/consts';
import { availableTags } from '@/consts';

interface ProjectsPageClientProps {
  years: { year: number; count: number }[];
  projects: any[];
  lang: 'fr' | 'en';
}

export default function ProjectsPageClient({ years, projects, lang }: ProjectsPageClientProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

  // Calculate tag counts from all projects
  const tagCounts = availableTags.reduce((acc, tag) => {
    acc[tag] = projects.filter((p) => p.tags.includes(tag)).length;
    return acc;
  }, {} as Record<Tag, number>);

  // Get tags that are actually used
  const usedTags = availableTags
    .filter((tag) => tagCounts[tag] > 0)
    .sort((a, b) => tagCounts[b] - tagCounts[a]);

  return (
    <>
      <ProjectFilters
        years={years}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        tags={usedTags}
        selectedTags={selectedTags}
        onSelectTags={setSelectedTags}
        lang={lang}
        tagCounts={tagCounts}
        totalCount={projects.length}
      />
      <ProjectGrid
        projects={projects}
        lang={lang}
        showFilter={false}
        yearFilter={selectedYear}
        selectedTags={selectedTags}
        onSelectTags={setSelectedTags}
      />
    </>
  );
}
