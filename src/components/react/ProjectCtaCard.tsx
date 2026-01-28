import { motion } from 'framer-motion';
import { ArrowRight, Folder } from 'lucide-react';

interface ProjectCtaCardProps {
  href: string;
  lang: 'fr' | 'en';
  index?: number;
}

export default function ProjectCtaCard({ href, lang, index = 0 }: ProjectCtaCardProps) {
  const content = {
    fr: {
      title: 'Découvrir tous mes projets',
      description: 'Explorez l\'ensemble de mes réalisations techniques et innovations',
      cta: 'Voir tous les projets'
    },
    en: {
      title: 'Discover all my projects',
      description: 'Explore all my technical achievements and innovations',
      cta: 'View all projects'
    }
  };

  const t = content[lang];

  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group block h-full"
    >
      <article className="h-full rounded-xl border-2 border-dashed border-accent/30 bg-gradient-to-br from-accent/5 to-purple-500/5 overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10 flex flex-col items-center justify-center p-8 min-h-[400px]">
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-accent/20 group-hover:scale-110">
          <Folder className="w-10 h-10 text-accent" />
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold text-foreground text-center mb-3 group-hover:text-accent transition-colors">
          {t.title}
        </h3>
        
        <p className="text-foreground-secondary text-center mb-6 max-w-xs">
          {t.description}
        </p>

        {/* CTA Button */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white rounded-lg group-hover:bg-accent-hover group-hover:scale-105 transition-all duration-300 font-medium shadow-lg shadow-accent/20">
          {t.cta}
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </div>
      </article>
    </motion.a>
  );
}
