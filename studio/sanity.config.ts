import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {media} from 'sanity-plugin-media'
import {schemaTypes, SINGLETONS} from './schemaTypes'
import {structure} from './structure'

/** Actions allowed on single pages: no delete, duplicate or unpublish. */
const SINGLETON_ACTIONS = new Set(['publish', 'discardChanges', 'restore'])

export default defineConfig({
  name: 'default',
  title: 'r0t',
  projectId: 'suitidnh',
  dataset: 'production',

  plugins: [
    structureTool({structure}),
    // Media library: browse, search, tag assets and see where each image is used.
    media(),
  ],

  schema: {
    types: schemaTypes,
    // Single pages can't be created from the "+" menu.
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action && SINGLETON_ACTIONS.has(action))
        : actions,
    newDocumentOptions: (items) => items.filter(({templateId}) => !SINGLETONS.includes(templateId)),
  },
})
