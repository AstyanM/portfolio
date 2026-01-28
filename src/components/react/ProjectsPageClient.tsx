import { useState } from 'react';
import ProjectsTimeline from './ProjectsTimeline';
import ProjectGrid from './ProjectGrid';

interface ProjectsPageClientProps {
  years: { year: number; count: number }[];
  projects: any[];
  lang: 'fr' | 'en';
}

export default function ProjectsPageClient({ years, projects, lang }: ProjectsPageClientProps) {
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  return (
    <>
      <ProjectsTimeline 
        years={years} 
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
        lang={lang} 
      />
      <ProjectGrid 
        projects={projects} 
        lang={lang} 
        showFilter={true}
        yearFilter={selectedYear}
      />
    </>
  );
}
