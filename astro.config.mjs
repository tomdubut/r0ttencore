// @ts-check
import { defineConfig } from 'astro/config';

// Static output only: the build is a folder of plain files (dist/) that any host can serve.
export default defineConfig({
  site: 'https://r0ttencore.com',
  output: 'static',
  build: {
    // /events/<slug> → dist/events/<slug>/index.html (clean URLs on any host)
    format: 'directory',
  },
});
