// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'VectorDB',
			description: 'Learn how to use Qdrant vector database with JavaScript',
			sidebar: [
				{
					label: 'Getting Started',
					items: [
						{ label: 'Introduction', slug: 'getting-started/introduction' },
						{ label: 'Installation', slug: 'getting-started/installation' },
						{ label: 'Quick Start', slug: 'getting-started/quick-start' },
					],
				},
				{
					label: 'Collections',
					items: [
						{ label: 'Creating Collections', slug: 'collections/creating' },
					],
				},
				{
					label: 'Points',
					items: [
						{ label: 'Inserting Points', slug: 'points/inserting' },
					],
				},
				{
					label: 'Search',
					items: [
						{ label: 'Vector Search', slug: 'search/vector-search' },
						{ label: 'Filtering', slug: 'search/filtering' },
					],
				},
				{
					label: 'Indexing',
					items: [
						{ label: 'Payload Indexes', slug: 'indexing/payload-indexes' },
					],
				},
			],
		}),
	],
});
