// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  output: 'server',
  // Photos are resized in the editor's browser before upload, so no paid image service is needed.
  adapter: cloudflare({ imageService: 'passthrough' }),
  // Sessions live in our own D1 tables, not Workers KV (KV allows only 1,000 writes a day on the free plan).
  session: false,
  trailingSlash: 'ignore',
  build: { inlineStylesheets: 'auto' },
});
