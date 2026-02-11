# Portfolio Project Overview

## Purpose
Personal portfolio website for Astyan Martin (engineering student), bilingual EN/FR, hosted on GitHub Pages.

## Tech Stack
- **Framework**: Astro 5 + React 19
- **Styling**: Tailwind CSS 3.4 with CSS custom properties (RGB triplets for opacity support)
- **Animations**: framer-motion + CSS animations (scroll-triggered via IntersectionObserver)
- **Icons**: lucide-react
- **Fonts**: Inter (sans), JetBrains Mono (mono)
- **Dark mode**: class strategy (.dark on html)
- **i18n**: Custom utils in src/i18n/ (en/fr with prefix routing)
- **Content**: Markdown with Zod validation, remark-math, rehype-katex, Shiki code highlighting
- **Image processing**: Sharp
- **Deployment**: GitHub Pages via deploy.yml

## Key Commands
- `npm run dev` - Dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Structure
- src/components/astro/ - Server-rendered components (11 files)
- src/components/react/ - Interactive React components (16 files)
- src/layouts/ - BaseLayout, ProjectLayout
- src/pages/ - Localized pages (en/fr)
- src/content/projects/ - Markdown project content (12 bilingual pairs)
- src/styles/global.css - Design tokens, prose styles, animations
- src/i18n/ - Translation system (ui.ts, utils.ts)

## Design System
- Semantic color tokens: background, foreground, border, accent (with secondary variants)
- Light theme default, dark theme via .dark class
- "Vercel/Linear inspired" palette per tailwind.config.mjs
- Glass effect utility, gradient text, scroll animations with stagger system
- Mobile-optimized animations (reduced durations, simplified transforms)
- Respects prefers-reduced-motion

## Platform
- Windows (development)
- Git commands: standard git
- System commands: Windows (dir, etc.) but also has bash-like commands via Git Bash
