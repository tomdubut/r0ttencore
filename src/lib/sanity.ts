/*
 * Sanity client used at build time. The dataset is public, so no token is needed:
 * only published content is read (drafts never reach the website).
 */
import { createClient } from '@sanity/client';

export const SANITY_PROJECT_ID = 'suitidnh';
export const SANITY_DATASET = 'production';

export const sanityClient = createClient({
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: '2026-10-01',
  useCdn: false, // build-time reads: always the freshest published content
  perspective: 'published',
});
