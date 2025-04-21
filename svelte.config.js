import { mdsvex } from "mdsvex";
import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://svelte.dev/docs/kit/integrations
    // for more information about preprocessors
    preprocess: [vitePreprocess({ script: true, style: true }), mdsvex()],

    kit: {
		adapter: adapter({
            fallback: "404.html",
            precompress: true
        }),
        paths: {
            base: process.argv.includes('dev') ? "" : "/MVHDebugMenu"
        }
	},

    extensions: [".svelte", ".svx"]
};

export default config;
