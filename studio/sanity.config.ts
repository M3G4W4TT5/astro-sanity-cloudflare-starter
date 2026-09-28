import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { homePage } from './schemas/homePage';

export default defineConfig({
  name: 'website-starter',
  title: 'Website content',
  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'missing',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  plugins: [structureTool({
    structure: (S) => S.list().title('Content').items([
      S.listItem().title('Home page').id('home').child(
        S.document().schemaType('homePage').documentId('home')
      ),
    ]),
  })],
  schema: { types: [homePage] },
});
