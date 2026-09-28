import { createClient } from '@sanity/client';

export type HomeContent = {
  title: string;
  intro: string;
  detailsTitle: string;
  details: string;
  source: 'demo' | 'sanity';
};

const demo: HomeContent = {
  title: 'A small website starts here',
  intro: 'This is labelled demonstration content for a new client site. Replace it after the brief and editorial approval.',
  detailsTitle: 'Made for real content',
  details: 'The page is built as static HTML. When a client Sanity project is configured, published content is fetched during the build.',
  source: 'demo',
};

export async function getHomeContent(): Promise<HomeContent> {
  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
  if (!projectId) return demo;

  const client = createClient({
    projectId,
    dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2025-05-01',
    perspective: 'published',
    useCdn: false,
  });
  const page = await client.fetch<Omit<HomeContent, 'source'> | null>(
    '*[_type == "homePage" && _id == "home"][0]{title, intro, detailsTitle, details}',
  );
  if (!page?.title || !page.intro || !page.detailsTitle || !page.details) {
    throw new Error('Published Sanity home document is missing required content. Publish document ID "home" before building.');
  }
  return { ...page, source: 'sanity' };
}
