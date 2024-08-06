import { resolve } from "node:path";
import { type FontFamily, getFonts, getManifest } from "@bedframe/core";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";
import bedframeConfig from "./src/bed.config/bedframe.config";

const { manifest, pages } = bedframeConfig.extension;
const {
	style: { fonts },
	tests,
} = bedframeConfig.development.template.config;

export default defineConfig(({ command, mode }) => {
	return {
		root: resolve(__dirname, "./src"),
		publicDir: resolve(__dirname, "./public"),
		resolve: {
			alias: {
				"@": resolve(__dirname, "./src"),
			},
		},
		plugins: [
			getManifest({ command, mode }, manifest, {
				browser: mode,
			}),
			getFonts(fonts as FontFamily[]),
			svelte(),
		],
		build: {
			outDir: resolve(__dirname, "dist", mode),
			emptyOutDir: true,
			rollupOptions: {
				input: pages,
			},
		},
		test: tests,
	};
});
