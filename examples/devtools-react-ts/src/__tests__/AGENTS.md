# `src/__tests__`

This folder contains the scaffolded Bedframe test surface.

## Working rules

- Vitest is the test runner for this project.
- Happy DOM is the default scaffolded environment unless the local config says otherwise.
- Keep tests aligned with the current framework, page structure, and runtime behavior.
- Prefer using the generated test setup before adding another test framework or environment.

## Key files

- `src/_config/tests.config.ts`
- `vite.config.ts`
- `package.json`

## Verification

- use the local test script from `package.json`
- update or add tests when a change materially affects config, pages, components, or runtime behavior
