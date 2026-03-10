# Bedframe Architecture

## Core project surfaces

- `AGENTS.md`
- `src/_config/bedframe.config.ts`
- `src/manifests/*`
- `src/pages/*`
- `src/scripts/*`
- `package.json`
- `vite.config.ts|js`
- `lefthook.yml`
- `.github/workflows/mvp.yml`

## Working rule

Treat `src/_config/bedframe.config.ts` as the canonical project definition and keep the other project surfaces aligned with it.

## Standard structure

```text
.
├── AGENTS.md
├── package.json
├── vite.config.ts|js
├── lefthook.yml
├── .github/workflows/mvp.yml
├── src/_config/*
├── src/manifests/*
├── src/pages/*
├── src/scripts/*
└── .agents/skills/bedframe/*
```

Nearest-folder `AGENTS.md` files localize folder-specific conventions for:

- `src/_config`
- `src/manifests`
- `src/pages`
- `src/scripts`
- `src/__tests__` when enabled

## Conditional shape notes

- `vite.config.ts` is common for TypeScript templates; JavaScript templates may start with `vite.config.js`.
- React + tailwind + shadcn scaffolds have additional UI/config files (`components.json`, theme styles/components).
- Non-react templates still follow the Bedframe alignment rules, but page/component/runtime implementations differ by framework.
