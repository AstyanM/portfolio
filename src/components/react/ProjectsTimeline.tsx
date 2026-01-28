import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface ProjectsTimelineProps {
  years: { year: number; count: number }[];
  selectedYear: number | null;
  onSelectYear: (year: number | null) => void;
  lang: 'fr' | 'en';
}

export default function ProjectsTimeline({ years, selectedYear, onSelectYear, lang }: ProjectsTimelineProps) {
  const content = {
    fr: {
      allYears: 'Toutes les années',
      projects: 'projets',
      project: 'projet'
    },
    en: {
      allYears: 'All years',
      projects: 'projects',
      project: 'project'
    }
  };

  const t = content[lang];

  return (
    <div className="mb-6 py-8 px-6 rounded-2xl bg-gradient-to-br from-accent/10 via-purple-500/8 to-accent/10 border-2 border-accent/20 shadow-xl shadow-black/5 dark:shadow-black/20 overflow-visible backdrop-blur-sm">
      {/* Mobile: Year buttons */}
      <div className="md:hidden space-y-3">
        {/* First line: All years */}
        <div className="flex justify-center">
          <motion.button
            onClick={() => onSelectYear(null)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
              selectedYear === null
                ? 'bg-accent text-white shadow-lg shadow-accent/20 border-accent'
                : 'bg-background-secondary text-foreground border-border hover:border-accent/50'
            }`}
          >
            {t.allYears}
          </motion.button>
        </div>
        
        {/* Second line: Year buttons */}
        <div className="flex justify-center gap-3 flex-wrap">
          {years.map((item) => (
            <motion.button
              key={item.year}
              onClick={() => onSelectYear(item.year === selectedYear ? null : item.year)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 border ${
                selectedYear === item.year
                  ? 'bg-accent text-white shadow-lg shadow-accent/20 border-accent'
                  : 'bg-background-secondary text-foreground border-border hover:border-accent/50'
              }`}
            >
              {item.year}
              <span className="ml-2 text-xs opacity-70">
                ({item.count})
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Desktop: Timeline */}
      <div className="hidden md:flex items-center gap-4 lg:gap-6">
        {/* All Years Button */}
        <motion.button
          onClick={() => onSelectYear(null)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`flex-shrink-0 px-5 py-2.5 rounded-lg font-medium transition-all duration-300 border ${
            selectedYear === null
              ? 'bg-accent text-white shadow-lg shadow-accent/20 border-accent'
              : 'bg-background-secondary text-foreground border-border hover:border-accent/50 hover:text-accent'
          }`}
        >
          {t.allYears}
        </motion.button>

        {/* Timeline Container */}
        <div className="flex-1 relative min-w-[200px] max-w-[600px] my-8">
          <div className="relative h-1 bg-accent/20 rounded-full">
            {/* Year Markers */}
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
                    {/* Year Point */}
                    <motion.div
                      whileHover={{ scale: 1.15 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 ${
                        isSelected
                          ? 'bg-accent border-accent shadow-lg shadow-accent/50'
                          : 'bg-background border-accent/40 hover:border-accent hover:bg-accent/20'
                      }`}
                    />

                    {/* Tooltip */}
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-[100]">
                      <div className="bg-foreground text-background px-3 py-2 rounded-lg shadow-2xl whitespace-nowrap text-sm font-medium">
                        <div className="text-center">
                          <div className="font-bold">{item.year}</div>
                          <div className="text-xs mt-0.5 opacity-90">
                            {item.count} {item.count === 1 ? t.project : t.projects}
                          </div>
                        </div>
                        {/* Arrow */}
                        <div className="absolute top-full left-1/2 -translate-x-1/2">
                          <div className="border-[5px] border-transparent border-t-foreground" />
                        </div>
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Year Labels */}
        <div className="flex items-center gap-3">
          {years.map((item) => (
            <motion.button
              key={`label-${item.year}`}
              onClick={() => onSelectYear(item.year === selectedYear ? null : item.year)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 border flex flex-col items-center ${
                selectedYear === item.year
                  ? 'bg-accent text-white shadow-lg shadow-accent/20 border-accent'
                  : 'bg-background-secondary text-foreground border-border hover:border-accent/50 hover:text-accent'
              }`}
            >
              <span>{item.year}</span>
              <span className="text-xs opacity-70 mt-0.5">
                ({item.count})
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
