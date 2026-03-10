# Bedframe Testing

Use this reference only when the project has tests enabled.

## Default scaffolded test shape

- test runner: Vitest
- environment: Happy DOM
- test files: `src/__tests__/*`
- local config: `src/_config/tests.config.ts`
- Vite integration: `vite.config.ts`

Prefer extending the scaffolded setup before introducing another test runner or environment.

## Commands

- run tests: use project `test` script from `package.json` (commonly `vitest run --coverage`)
- run focused checks during iteration: use Vitest filters/watch options from local scripts/setup

## Typical file layout

```text
src/
  __tests__/
    *.test.ts|tsx
  _config/
    tests.config.ts
```

## If tests are not enabled

- do not assume a test runner exists
- add tests only when requested or when task scope includes enabling test tooling
- state explicitly when verification was done via build/dev checks instead of tests
