import { defineConfig } from 'astro/config';
import launchFiles from './integrations/launch-files.mjs';

const site = 'https://eganow.com';

export default defineConfig({
  site,
  output: 'static',
  // Page CSS is only a few KB, so inline it all: no render-blocking stylesheet requests.
  build: { inlineStylesheets: 'always' },
  prefetch: { prefetchAll: false },
  integrations: [launchFiles({ site })],
});
