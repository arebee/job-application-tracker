import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	ssr: {
		external: ['better-sqlite3', 'bcrypt']
	},
	preview: {
		allowedHosts: ['the-heart-of-gold.local', 'localhost', '127.0.0.1'],
		// allowedHosts: true,
		https: {
			key: fs.readFileSync(path.resolve(path.join(__dirname, '../_mkcert/'), 'the-heart-of-gold.local-key.pem')),
			cert: fs.readFileSync(path.resolve(path.join(__dirname, '../_mkcert/'), 'the-heart-of-gold.local.pem')),
		},
	},
});
