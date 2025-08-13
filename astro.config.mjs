// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'GenelineX Vector Database',
			description: 'Managed Qdrant deployment for enterprise-grade vector operations',
			sidebar: [
				{
					label: 'Getting Started',
					items: [
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
