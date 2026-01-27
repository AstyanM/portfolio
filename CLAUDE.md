# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
```

## Project Overview

Astro 5 portfolio website with bilingual support (French/English), hosted on GitHub Pages. Site URL: `https://astyanmartin.com`

## Architecture

### Routing & Internationalization
- **Default locale**: French (`fr`)
- **Locales**: `fr`, `en` with prefix routing (`/fr/...`, `/en/...`)
- **i18n utilities**: [src/i18n/utils.ts](src/i18n/utils.ts) - `getLangFromUrl()`, `useTranslations()`, `getProjectsPath()`
- **UI translations**: [src/i18n/ui.ts](src/i18n/ui.ts) - Add new translation keys here
- **Project routes differ by locale**: `/fr/projets/[slug]` vs `/en/projects/[slug]`

### Content System
- **Project content**: `src/content/projects/{fr|en}/*.md` - MDX files with frontmatter
- **Content schema**: [src/content/config.ts](src/content/config.ts) - Zod validation with required `title`, `lang`, optional `tags`, `cover`, `liveUrl`, `repoUrl`
- **Available tags**: Defined in [src/consts.ts](src/consts.ts) - Must use these exact values in frontmatter

### Component Organization
- **Astro components**: `src/components/astro/` - Server-rendered (BaseHead, Footer, HeroBackground, Timeline, TechStack)
- **React components**: `src/components/react/` - Interactive with `client:*` directives (Header, ThemeToggle, LanguageSwitcher, ProjectGrid, Lightbox)
- **Layouts**: `src/layouts/` - BaseLayout wraps all pages, ProjectLayout for project detail pages

### Markdown Processing
- **Math**: remark-math + rehype-katex for LaTeX equations
- **Code highlighting**: Shiki with `github-dark` theme
- **Figure captions**: Custom [rehype-figure-caption.mjs](src/plugins/rehype-figure-caption.mjs) - Paragraphs starting with "Figure" get `.figure-caption` class

### Styling
- **CSS variables**: Theme colors defined as RGB triplets in [src/styles/global.css](src/styles/global.css) for Tailwind opacity support
- **Dark mode**: `class` strategy - toggle adds `.dark` to `<html>`
- **Tailwind colors**: Use semantic tokens (`bg-background`, `text-foreground`, `border-border`, `text-accent`)
- **Typography**: Custom `.prose` styles for markdown content in global.css

### Path Aliases (tsconfig.json)
```
@/*           → src/*
@components/* → src/components/*
@layouts/*    → src/layouts/*
@assets/*     → src/assets/*
```

## Adding a New Project

1. Create markdown file in both `src/content/projects/fr/` and `src/content/projects/en/` with same filename
2. Add frontmatter with required `title`, `lang`, and optional fields (`tags` from consts.ts, `date`, `cover`, `liveUrl`, `repoUrl`)
3. Place project images in `src/assets/projects/{slug}/`

## GitHub Pages Deployment

Site configured for GitHub Pages with `site: 'https://astyanmartin.com'` in astro.config.mjs. Uses Sharp for image optimization.
