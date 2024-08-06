import { createManifest } from "@bedframe/core";
import pkg from "../../package.json";
import { baseManifest } from "./base.manifest";

const { options_ui, ...rest } = baseManifest;

const updatedFirefoxManifest = {
	...rest,
	background: {
		scripts: [baseManifest.background.service_worker],
	},
	browser_specific_settings: {
		gecko: {
			id: pkg.author.email,
			// ^^^ https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#id
		},
	},
	options_ui: {
		page: options_ui.page,
	},
};

export const firefox = createManifest(updatedFirefoxManifest, "firefox");
