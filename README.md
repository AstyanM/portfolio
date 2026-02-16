<p align="center">
  <img src="public/favicon.svg" width="80" alt="AM Logo" />
</p>

<h1 align="center">Astyan Martin — Portfolio</h1>

<p align="center">
  <img alt="Astro" src="https://img.shields.io/badge/Astro_5-BC52EE?logo=astro&logoColor=fff">
  <img alt="React" src="https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=000">
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?logo=tailwindcss&logoColor=fff">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff">
  <img alt="GitHub Pages" src="https://img.shields.io/badge/GitHub_Pages-222?logo=github&logoColor=fff">
</p>

<p align="center">
  Bilingual (EN/FR) portfolio website showcasing engineering and research projects<br>in deep learning, signal processing, embedded systems and web development.
</p>

<p align="center">
  <a href="https://astyanm.github.io/portfolio/"><strong>View Live Site &rarr;</strong></a>
</p>

---

## Features

- **Bilingual** — Full English/French support with locale-prefixed routing and language switcher
- **Dark / Light mode** — Class-based theming with system preference detection
- **Project showcase** — Grid and timeline views with tag-based filtering
- **Rich markdown** — LaTeX equations (KaTeX), syntax highlighting (Shiki), video embedding, figure captions
- **Project detail pages** — Table of contents, reading progress bar, image lightbox, appendices with bibliography and downloadable documents
- **Animations** — Scroll-triggered animations and typewriter effect via framer-motion, with `prefers-reduced-motion` support
- **Optimized images** — Sharp-based image processing at build time
- **RSS feed** — Auto-generated project feed

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | Astro 5, React 19 |
| Language | TypeScript |
| Styling | Tailwind CSS 3.4, CSS custom properties |
| Content | Markdown / MDX, Zod schema validation |
| Math | remark-math, rehype-katex |
| Animations | framer-motion, CSS animations |
| Icons | lucide-react |
| Images | Sharp |
| Deployment | GitHub Pages, GitHub Actions |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
git clone https://github.com/AstyanM/portfolio.git
cd portfolio
npm install
```

### Development

```bash
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Project Structure

```
src/
├── assets/projects/         # Project images (optimized at build)
├── components/
│   ├── astro/               # Server-rendered components
│   └── react/               # Interactive client components
├── content/
│   ├── config.ts            # Zod content schemas
│   └── projects/{en,fr}/    # Bilingual project markdown files
├── i18n/
│   ├── ui.ts                # Translation strings (60+ keys)
│   └── utils.ts             # i18n helper functions
├── layouts/
│   ├── BaseLayout.astro     # Main layout (ViewTransitions)
│   └── ProjectLayout.astro  # Project detail layout
├── pages/
│   ├── en/                  # English routes
│   ├── fr/                  # French routes
│   ├── index.astro          # Root redirect
│   ├── 404.astro            # Error page
│   └── rss.xml.ts           # RSS feed
├── plugins/                 # Custom rehype plugins
├── styles/global.css        # Theme variables & prose styles
└── consts.ts                # Available tags
```

## Adding a Project

1. Create a markdown file in both `src/content/projects/fr/` and `src/content/projects/en/` with the **same filename**
2. Add frontmatter:

```yaml
---
title: "Project Title"          # required
lang: en                        # en | fr
description: "Full project summary"
cardDescription: "Short one-liner for project cards"
date: "2024-06-15"
year: 2024
tags: ["Deep Learning", "Web"]  # from src/consts.ts
cover: "./cover.jpg"
teamSize: 3
liveUrl: https://example.com
repoUrl: https://github.com/...
repoPrivate: false
draft: false
conclusion: "Closing remarks displayed in a separate section."
impact:
  - value: "95%"
    label: "Accuracy"
appendix:
  sources:
    - authors: "Doe, J."
      year: 2023
      title: "Paper Title"
      publisher: "Journal"
      url: https://...
  documents:
    - title: "Report"
      url: "/docs/report.pdf"
      type: pdf
---
```

3. Place images in `src/assets/projects/{slug}/`

## Deployment

The site deploys automatically to GitHub Pages on push to `main` via `.github/workflows/deploy.yml`.

```js
// astro.config.mjs
site: 'https://astyanm.github.io'
base: '/portfolio/'
```

## Author

**Astyan Martin** — Engineering student

- [GitHub](https://github.com/AstyanM)
- [Portfolio](https://astyanm.github.io/portfolio/)
