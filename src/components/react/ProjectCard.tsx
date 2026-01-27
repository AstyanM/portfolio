import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import type { Tag } from '@/consts';

interface ProjectCardProps {
  title: string;
  description?: string;
  tags: Tag[];
  slug: string;
  href: string;
  coverUrl?: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  tags,
  href,
  coverUrl,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group block h-full"
    >
      <article className="h-full rounded-xl border border-border bg-background-secondary overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/5">
        {/* Cover Image */}
        {coverUrl ? (
          <div className="aspect-video w-full overflow-hidden bg-background">
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        ) : (
          <div className="aspect-video w-full bg-gradient-to-br from-accent/20 to-purple-500/20 flex items-center justify-center">
            <span className="text-4xl font-bold text-accent/40">
              {title.charAt(0)}
            </span>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-accent transition-colors line-clamp-2">
              {title}
            </h3>
            <ArrowUpRight className="w-5 h-5 flex-shrink-0 text-foreground-secondary opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 transition-all duration-300" />
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
                  {tag}
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
