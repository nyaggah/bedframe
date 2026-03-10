# Browser Differences

- Chromium-family browsers usually follow the base Bedframe manifest pattern closely.
- Firefox often needs explicit delta handling:
  - `browser_specific_settings.gecko.id`
  - `side_panel` compatibility via `sidebar_action`
  - `background.service_worker` compatibility via `background.scripts`
- Safari often needs `browser_specific_settings.safari` constraints and follows a separate handoff after Bedframe build/conversion.

## Firefox references

- https://extensionworkshop.com/documentation/develop/manifest-v3-migration-guide/
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#id

## Safari references

- https://developer.apple.com/documentation/safariservices/optimizing-your-web-extension-for-safari
- https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json/browser_specific_settings#safari_properties

## Publish-time checks by browser family

- Chromium family:
  - validate base manifest assumptions still hold
  - validate direct publish target configuration
- Firefox:
  - verify `browser_specific_settings.gecko.id`
  - verify sidepanel/background compatibility deltas when used
- Safari:
  - verify `browser_specific_settings.safari` constraints
  - treat publish as Apple-tooling handoff after Bedframe build/conversion
