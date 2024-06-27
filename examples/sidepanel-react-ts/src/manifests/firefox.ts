import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'
import pkg from '../../package.json'

const { options_ui, side_panel, ...rest } = baseManifest

const updatedFirefoxManifest = {
  ...rest,
  background: {
    scripts: [baseManifest.background.service_worker],
  },
  sidebar_action: {
    default_icon: baseManifest.action.default_icon,
    default_title: baseManifest.name,
    default_panel: side_panel.default_path,
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
}

export const firefox = createManifest(updatedFirefoxManifest, 'firefox')
