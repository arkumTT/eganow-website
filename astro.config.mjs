import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://eganow.com',
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false },
});
