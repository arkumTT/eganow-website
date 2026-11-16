import { defineConfig } from 'astro/config';
import launchFiles from './integrations/launch-files.mjs';

const site = 'https://eganow.com';

export default defineConfig({
  site,
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false },
  integrations: [launchFiles({ site })],
});
