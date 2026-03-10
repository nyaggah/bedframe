# Bedframe Pages

## Files

- `src/pages/*`

## Extension type mapping

- `popup`:
  - `pages/main.html`
  - usually mapped via `action.default_popup`
- `sidepanel`:
  - `pages/sidepanel-welcome.html`
  - `pages/sidepanel-main.html`
  - mapped via `side_panel.default_path` (plus Firefox delta handling)
- `devtools`:
  - `pages/devtools.html`
  - `pages/devtools-panel.html`
- `overlay`:
  - `pages/main.html` plus content script/runtime coordination
- `options`:
  - `pages/options.html`
  - mapped via `options_page` or `options_ui.page`

## Rules

- page entrypoints must stay aligned with config and manifest fields
- use `extension.pages` for additional entrypoints beyond direct manifest page fields
- re-check the extension type before introducing new page surfaces

## Safe change checklist

When adding/removing/renaming a page:

1. update `src/_config/bedframe.config.ts` `extension.pages`
2. update manifest fields in `src/manifests/*` that reference the page
3. verify runtime/scripts that navigate to the page
4. run `bedframe build <browser>` to validate output entrypoints
