# Bedframe Config

## Primary file

- `src/_config/bedframe.config.ts`

## Read order

1. `browser`
2. `extension`
3. `development`

## Canonical shape

```ts
export default createBedframe({
  browser: [chrome.browser, firefox.browser],
  extension: {
    type: 'sidepanel',
    options: 'embedded',
    manifest: [chrome, firefox],
    pages: {
      welcome: 'src/pages/sidepanel-welcome.html',
      main: 'src/pages/sidepanel-main.html',
      options: 'src/pages/options.html',
    },
  },
  development: {
    template: {
      config: {
        framework: 'react',
        language: 'typescript',
        packageManager: 'bun',
        lintFormat: true,
        tests: { /* vitest config */ },
        git: true,
        gitHooks: true,
        commitLint: true,
        changesets: true,
      },
    },
  },
})
```

## Alignment rules

- `browser` should match the actual browser targets in `src/manifests/*`.
- `extension.manifest` should contain the actual Bedframe `BuildTarget` exports for the enabled browsers.
- `extension.pages` should stay aligned with `src/pages/*`.
- `development.template.config` should stay aligned with the generated tooling configuration.

## Extension-type caveats

- `popup`: `action.default_popup` and `pages/main.html` alignment.
- `overlay`: content script + runtime toggle behavior alignment.
- `sidepanel`: `side_panel`/`sidebar_action` related alignment across browsers.
- `devtools`: devtools page + panel page alignment.

## Verification

- Read nearest `AGENTS.md` for `_config`, `manifests`, `pages`, and `scripts`.
- Run `bedframe build <browser>` after config edits that affect manifests/pages/runtime wiring.
