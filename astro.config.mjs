// @ts-check
import { defineConfig } from 'astro/config';

// Static output only: the build must be a plain folder we can upload over FTP/SSH
// to Russian shared hosting. No serverless, no host-specific features.
export default defineConfig({
  output: 'static',
  site: 'https://example.ru', // replaced once the real domain is known
  build: { inlineStylesheets: 'auto' },
  image: {
    // Widths and formats are fixed by the budgets in CLAUDE.md section 4.
    responsiveStyles: true,
    layout: 'constrained',
  },
  prefetch: false, // every prefetched byte competes with the LCP image on 4G
});
