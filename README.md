# Portfolio - Astyan Martin

Personal portfolio showcasing engineering projects, built with Astro 5 and React 19.

**Live site:** [astyanm.github.io/portfolio](https://astyanm.github.io/portfolio/)

## Features

- **Bilingual** - Full English/French support with locale-prefixed routing and language switcher
- **Dark/Light mode** - Class-based theming with system preference detection
- **Project showcase** - Grid and timeline views with tag-based filtering
- **Rich markdown** - LaTeX equations (KaTeX), syntax highlighting (Shiki), video embedding, figure captions
- **Project detail pages** - Table of contents, reading progress bar, image lightbox, appendices with bibliography and downloadable documents
- **Animations** - Scroll-triggered animations and typewriter effect (framer-motion), with `prefers-reduced-motion` support
- **Optimized images** - Sharp-based image processing at build time

## Tech Stack

| Category       | Technologies                               |
| -------------- | ------------------------------------------ |
| Framework      | Astro 5, React 19                          |
| Styling        | Tailwind CSS 3.4, CSS custom properties    |
| Content        | Markdown/MDX, Zod schema validation        |
| Math           | remark-math, rehype-katex                  |
| Animations     | framer-motion, CSS animations              |
| Icons          | lucide-react                               |
| Deployment     | GitHub Pages, GitHub Actions               |

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
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
│   ├── ui.ts                # Translation strings
│   └── utils.ts             # i18n helper functions
├── layouts/
│   ├── BaseLayout.astro     # Main layout (ViewTransitions)
│   └── ProjectLayout.astro  # Project detail layout
├── pages/
│   ├── en/                  # English routes
│   ├── fr/                  # French routes
│   ├── index.astro          # Root redirect
│   └── 404.astro            # Error page
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
description: "Short summary"
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

The site deploys automatically to GitHub Pages on push to `main` via the workflow in `.github/workflows/deploy.yml` (Node 20, `npm ci && npm run build`).

Configuration in `astro.config.mjs`:
```js
site: 'https://astyanm.github.io'
base: '/portfolio/'
```
