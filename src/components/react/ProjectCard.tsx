import { motion } from 'framer-motion';
import { ArrowUpRight, Github } from 'lucide-react';
import type { Tag } from '@/consts';
import { ui } from '@/i18n/ui';

interface ProjectCardProps {
  title: string;
  description?: string;
  tags: Tag[];
  slug: string;
  href: string;
  coverUrl?: string;
  repoUrl?: string;
  year?: number;
  index?: number;
  lang: 'fr' | 'en';
}

export default function ProjectCard({
  title,
  description,
  tags,
  href,
  coverUrl,
  repoUrl,
  year,
  index = 0,
  lang,
}: ProjectCardProps) {
  const t = ui[lang];

  const translateTag = (tag: Tag): string => {
    const key = `tag.${tag}` as keyof typeof t;
    return t[key] || tag;
  };
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="group block h-full"
    >
      <article className="h-full rounded-xl border border-border bg-background-secondary overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/5">
        {/* Cover Image */}
        {coverUrl ? (
          <div className="aspect-video w-full overflow-hidden bg-background relative">
            <img
              src={coverUrl}
              alt={title}
              width={640}
              height={360}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            {year && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-black/50 text-white/80">
                {year}
              </span>
            )}
            {repoUrl && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(repoUrl, '_blank', 'noopener,noreferrer'); }}
                className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-black/60 text-white hover:bg-accent active:scale-95 transition-all"
                title={lang === 'fr' ? 'Voir le code source' : 'View source code'}
              >
                <Github className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center relative">
            <span className="text-4xl font-bold text-accent/40">
              {title.charAt(0)}
            </span>
            {year && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs font-medium bg-black/50 text-white/80">
                {year}
              </span>
            )}
            {repoUrl && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); window.open(repoUrl, '_blank', 'noopener,noreferrer'); }}
                className="absolute top-2 right-2 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-md bg-black/60 text-white hover:bg-accent active:scale-95 transition-all"
                title={lang === 'fr' ? 'Voir le code source' : 'View source code'}
              >
                <Github className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold font-display text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {title}
            </h3>
            <ArrowUpRight className="w-5 h-5 flex-shrink-0 text-foreground-secondary opacity-100 md:opacity-0 md:-translate-y-1 md:translate-x-1 md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:translate-x-0 transition-all duration-300" />
          </div>

          {description && (
            <p className="text-sm text-foreground-secondary line-clamp-2 mb-4">
              {description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="tag text-xs">
                  {translateTag(tag)}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="tag text-xs">+{tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
      </article>
    </motion.a>
  );
}
