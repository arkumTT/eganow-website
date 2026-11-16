import { defineConfig } from 'astro/config';
import launchFiles from './integrations/launch-files.mjs';

const site = 'https://eganow.com';

export default defineConfig({
  site,
  output: 'static',
  // Page CSS is only a few KB, so inline it all: no render-blocking stylesheet requests.
  build: { inlineStylesheets: 'always' },
  // Link prefetching is deliberately NOT enabled: nothing uses it, and it ships an extra script to every page.
  integrations: [launchFiles({ site })],
});
