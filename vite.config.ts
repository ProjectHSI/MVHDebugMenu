import { defineConfig } from "vitest/config";
import { sveltekit } from '@sveltejs/kit/vite';
import compileTime from "vite-plugin-compile-time"

export default defineConfig({
    plugins: [sveltekit(), compileTime()],

    test: {
        include: ['src/**/*.{test,spec}.{js,ts}']
    },



    build: {
        cssMinify: "lightningcss",
        sourcemap: "inline"
    }
});
