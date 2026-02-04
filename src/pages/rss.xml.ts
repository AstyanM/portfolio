import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const projects = await getCollection('projects', ({ data }) => {
    return data.lang === 'en' && !data.draft;
  });

  return rss({
    title: 'Astyan Martin | Portfolio',
    description: 'Engineering student - AI, algorithms and hardware design projects.',
    site: context.site!.toString(),
    items: projects.map((project) => ({
      title: project.data.title,
      description: project.data.description ?? '',
      pubDate: project.data.date ? new Date(project.data.date) : undefined,
      link: `/portfolio/en/projects/${project.slug.split('/')[1]}/`,
    })),
  });
}
