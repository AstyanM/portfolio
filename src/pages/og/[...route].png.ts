import { getCollection } from 'astro:content';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { APIRoute } from 'astro';

export async function getStaticPaths() {
  const projects = await getCollection('projects');
  
  // Create paths for each project WITH its language
  // slug is like "fr/my-project" or "en/my-project"
  const paths = projects.map((project) => {
    const parts = project.slug.split('/');
    const lang = parts[0]; // 'fr' or 'en'
    const projectName = parts[1] || parts[0]; // 'my-project'
    
    return {
      // Route will be: /og/fr/my-project.png or /og/en/my-project.png
      params: { route: `${lang}/${projectName}` },
      props: { type: 'project', data: project.data, slug: projectName, lang },
    };
  });

  // Create paths for main pages (default OG)
  paths.push({
    params: { route: 'default-fr' },
    props: { type: 'default', lang: 'fr', slug: 'default' } as any,
  });
  paths.push({
    params: { route: 'default-en' },
    props: { type: 'default', lang: 'en', slug: 'default' } as any,
  });

  return paths;
}

export const GET: APIRoute = async ({ params, props }) => {
  // Load fonts (using Google Fonts fetch for simplicity in this environment)
  const fontRegular = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@5.0.19/latin-400-normal.woff').then((res) => res.arrayBuffer());
  const fontBold = await fetch('https://cdn.jsdelivr.net/fontsource/fonts/inter@5.0.19/latin-700-normal.woff').then((res) => res.arrayBuffer());

  const { type, data, lang } = props;

  let title = '';
  let description = '';
  let tags: string[] = [];
  let cover = '';

  if (type === 'project') {
    title = data.title;
    description = data.description || '';
    tags = data.tags || [];
    cover = data.cover?.src || '';
  } else {
    // Default Portfolio OG
    title = lang === 'fr' ? 'Astyan Martin | Portfolio' : 'Astyan Martin | Portfolio';
    description = lang === 'fr' 
      ? "Étudiant ingénieur passionné par l'IA et le développement." 
      : "Engineering student passionate about AI and development.";
    tags = ['Portfolio', 'AI', 'Engineering'];
  }

  // --- Satori Template (JSX-like object structure) ---
  // Style: Clean Light Theme Card
  const template = {
    type: 'div',
    props: {
        style: {
            display: 'flex',
            height: '100%',
            width: '100%',
            backgroundColor: '#f8fafc', // slate-50
            backgroundImage: 'radial-gradient(circle at 25px 25px, #e2e8f0 2%, transparent 0%), radial-gradient(circle at 75px 75px, #e2e8f0 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            padding: '40px',
            fontFamily: 'Inter',
        },
        children: [
            {
                type: 'div',
                props: {
                    style: {
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#ffffff',
                        borderRadius: '24px',
                        padding: '60px',
                        boxShadow: '0 20px 40px -10px rgba(0,0,0,0.1)',
                        border: '1px solid #e2e8f0',
                    },
                    children: [
                        // Top Section: Tags
                        {
                            type: 'div',
                            props: {
                                style: { display: 'flex', gap: '12px' },
                                children: tags.slice(0, 3).map(tag => ({
                                    type: 'div',
                                    props: {
                                        style: {
                                            padding: '8px 16px',
                                            backgroundColor: '#f1f5f9', // slate-100
                                            color: '#475569', // slate-600
                                            borderRadius: '8px',
                                            fontSize: '20px',
                                            fontWeight: 600,
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        },
                                        children: tag,
                                    }
                                })),
                            }
                        },
                        // Middle Section: Title & Description
                        {
                            type: 'div',
                            props: {
                                style: { display: 'flex', flexDirection: 'column', gap: '20px' },
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            style: { fontSize: '72px', fontWeight: 700, color: '#0f172a', lineHeight: 1.1 }, // slate-900
                                            children: title,
                                        }
                                    },
                                    {
                                        type: 'div',
                                        props: {
                                            style: { fontSize: '32px', color: '#64748b', lineHeight: 1.5, maxWidth: '80%' }, // slate-500
                                            children: description.length > 100 ? description.substring(0, 97) + '...' : description,
                                        }
                                    }
                                ]
                            }
                        },
                        // Bottom Section: Branding
                        {
                            type: 'div',
                            props: {
                                style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '2px solid #f1f5f9', paddingTop: '40px' },
                                children: [
                                    {
                                        type: 'div',
                                        props: {
                                            style: { display: 'flex', alignItems: 'center', gap: '16px' },
                                            children: [
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: { width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '24px' },
                                                        children: 'A',
                                                    }
                                                },
                                                {
                                                    type: 'div',
                                                    props: {
                                                        style: { fontSize: '28px', fontWeight: 600, color: '#334155' },
                                                        children: 'Astyan Martin',
                                                    }
                                                }
                                            ]
                                        }
                                    },
                                    {
                                        type: 'div',
                                        props: {
                                            style: { fontSize: '24px', color: '#94a3b8' },
                                            children: 'portfolio.dev',
                                        }
                                    }
                                ]
                            }
                        }
                    ]
                }
            }
        ]
    }
  };

  const svg = await satori(template as any, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: fontRegular, weight: 400, style: 'normal' },
      { name: 'Inter', data: fontBold, weight: 700, style: 'normal' },
    ],
  });

  const resvg = new Resvg(svg);
  const pngData = resvg.render();
  const pngBuffer = pngData.asPng();

  return new Response(pngBuffer, {
    headers: {
      'Content-Type': 'image/png',
      // Cache for 1 week
      'Cache-Control': 'public, max-age=604800, immutable',
    },
  });
};
