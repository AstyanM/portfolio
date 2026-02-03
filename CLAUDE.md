# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Project Overview

Astro 5 portfolio website with bilingual support (English/French), hosted on GitHub Pages at `https://astyanm.github.io/portfolio/`.

## Architecture

### Routing & Internationalization
- **Default locale**: English (`en`)
- **Locales**: `en`, `fr` with prefix routing (`/en/...`, `/fr/...`), `prefixDefaultLocale: true`
- **i18n utilities**: [src/i18n/utils.ts](src/i18n/utils.ts) - `getLangFromUrl()`, `useTranslations()`, `getProjectsPath()`, `getLocalizedPath()`, `getProjectPath()`, `getAlternateLang()`, `getAssetUrl()`
- **UI translations**: [src/i18n/ui.ts](src/i18n/ui.ts) - Add new translation keys here (40+ keys across nav, hero, projects, tags, contact, footer, 404)
- **Project routes differ by locale**: `/fr/projets/[slug]` vs `/en/projects/[slug]`

### Content System
- **Project content**: `src/content/projects/{fr|en}/*.md` - Markdown files with frontmatter (12 bilingual pairs)
- **Content schema**: [src/content/config.ts](src/content/config.ts) - Zod validation:
  - Required: `title`
  - Optional: `description`, `date`, `tags` (from consts.ts), `cover`, `lang` (default `fr`), `draft` (default `false`), `liveUrl`, `repoUrl`, `repoPrivate` (default `false`), `teamSize` (positive int), `year` (2000-2100), `conclusion`
  - `appendix` object: `structure` (description + tree), `sources` (bibliography entries), `documents` (downloadable files with type pdf|zip|doc|other)
- **Available tags**: Defined in [src/consts.ts](src/consts.ts) - Must use these exact values: `Deep Learning`, `Traitement du Signal`, `Vision par Ordinateur`, `Simulation`, `Santé`, `Web`, `Sécurité`, `Architecture`, `Hardware`, `Recherche`, `Embarqué`

### Component Organization
- **Astro components**: `src/components/astro/` - Server-rendered (Appendix, BaseHead, Conclusion, Contact, Footer, HeroBackground, ProjectSpotlight, SimilarProjects, TechStack, Timeline)
- **React components**: `src/components/react/` - Interactive with `client:*` directives (Header, ThemeToggle, LanguageSwitcher, Lightbox, ProjectCard, ProjectCtaCard, ProjectFilters, ProjectGrid, ProjectsPageClient, ProjectsTimeline, ReadingProgress, TableOfContents, TagFilter, TagFilterEnhanced, Typewriter)
- **Layouts**: `src/layouts/` - BaseLayout wraps all pages (with ViewTransitions), ProjectLayout for project detail pages (includes TOC, reading progress, lightbox, conclusion, appendix, similar projects)

### Pages
- `src/pages/index.astro` - Root redirect
- `src/pages/404.astro` - Error page
- `src/pages/{en|fr}/index.astro` - Localized home pages
- `src/pages/en/projects/{index,[...slug]}.astro` - English project listing & detail
- `src/pages/fr/projets/{index,[...slug]}.astro` - French project listing & detail

### Markdown Processing
- **Math**: remark-math + rehype-katex for LaTeX equations
- **Code highlighting**: Shiki with `github-dark` theme, word wrap enabled
- **Figure captions**: Custom [rehype-figure-caption.mjs](src/plugins/rehype-figure-caption.mjs) - Paragraphs starting with "Figure", "Vidéo", or "Video" get `.figure-caption` class
- **Video embedding**: Custom [rehype-video.mjs](src/plugins/rehype-video.mjs) - Converts links to video files into `<video>` elements
- **Base URL rewriting**: Custom [rehype-base-url.mjs](src/plugins/rehype-base-url.mjs) - Prepends `/portfolio/` base path to image/video sources

### Styling
- **CSS variables**: Theme colors defined as RGB triplets in [src/styles/global.css](src/styles/global.css) for Tailwind opacity support
- **Dark mode**: `class` strategy - toggle adds `.dark` to `<html>`
- **Tailwind colors**: Use semantic tokens (`bg-background`, `bg-background-secondary`, `text-foreground`, `text-foreground-secondary`, `border-border`, `text-accent`, `text-accent-hover`)
- **Typography**: Custom `.prose` styles for markdown content in global.css
- **Animations**: fade-in, slide-up, pulse-glow, animate-on-scroll (respects `prefers-reduced-motion`)

### Path Aliases (tsconfig.json)
```
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@assets/*     → src/assets/*
```

### Key Dependencies
- **Framework**: Astro 5, React 19
- **Integrations**: @astrojs/react, @astrojs/tailwind, @astrojs/mdx
- **Styling**: Tailwind CSS 3.4
- **Animations**: framer-motion
- **Icons**: lucide-react
- **Image processing**: Sharp

## Adding a New Project

1. Create markdown file in both `src/content/projects/fr/` and `src/content/projects/en/` with same filename
2. Add frontmatter with required `title`, and optional fields (`description`, `date`, `lang`, `tags` from consts.ts, `cover`, `liveUrl`, `repoUrl`, `repoPrivate`, `teamSize`, `year`, `conclusion`, `appendix`)
3. Place project images in `src/assets/projects/{slug}/`

## GitHub Pages Deployment

Site configured for GitHub Pages with `site: 'https://astyanm.github.io'` and `base: '/portfolio/'` in astro.config.mjs. Deployed via `.github/workflows/deploy.yml`. Uses Sharp for image optimization.
