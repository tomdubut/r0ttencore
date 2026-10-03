import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'suitidnh',
    dataset: 'production',
  },
  deployment: {
    // Hosted at https://r0ttencore.sanity.studio, deployed by .github/workflows/deploy-studio.yml
    appId: 'b7ydnp929vzjf9mqi9r6gtst',
    autoUpdates: true,
  },
  typegen: {
    // Types for the website's GROQ queries (src/lib/queries.ts) are generated into the site.
    path: '../src/**/*.{ts,astro}',
    schema: './schema.json',
    generates: '../src/sanity.types.ts',
    overloadClientMethods: true,
  },
})
