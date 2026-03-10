# Bedframe Project

## Agent order

**Immediately load** `.agents/skills/bedframe/SKILL.md` using the skill tool before proceeding with any task.

Use it as the primary source for how to work in this project. Then apply this file and the nearest folder-level `AGENTS.md` for the paths you are editing.

## Bedframe

Bedframe is a framework for building cross-browser browser extensions with a consistent
`B.E.D.` project model.

`B.E.D.` means:

- `Browser`: target browsers and manifest variants
- `Extension`: extension shape, pages, scripts, permissions, and runtime behavior
- `Development`: framework/language/tooling plus test and release workflow

Treat `src/_config/bedframe.config.ts` as the canonical project-definition file.

Read it in this order:

1. `browser`
2. `extension`
3. `development`

## M.V.P.

`M.V.P.` means `make, version, publish`.

In a standard Bedframe project, `.github/workflows/mvp.yml` is the primary CI/CD path.

Default flow:

1. Pull request is opened or code is merged to `main`.
2. Changesets and release state are evaluated.
3. If releasable, a Version/Release PR is created or updated.
4. Additional merges continue updating that PR.
5. After merge, the same workflow continues through release and publish.

Manual equivalent:

- `bedframe publish --browsers <list>`

Use direct CLI publish as a manual path that follows the same release contract.

## Standard Architecture

A Bedframe project usually includes:

```text
.
├── AGENTS.md
├── package.json
├── vite.config.ts|js
├── .github/workflows/mvp.yml
├── src
│   ├── _config/bedframe.config.ts
│   ├── manifests/*
│   ├── pages/*
│   ├── scripts/*
│   └── __tests__/* (optional)
└── .agents/skills/bedframe/*
```

Conventions:

- `src/_config/bedframe.config.ts` is canonical
- `src/manifests/*` defines browser manifest source
- `src/pages/*` defines HTML entrypoints
- `src/scripts/*` defines runtime/background source
- `vite.config.*` is Bedframe/Vite build plumbing
- `.github/workflows/mvp.yml` is the default automated release path

## Working Set

Read these first in most tasks (in this order):

1. `.agents/skills/bedframe/SKILL.md` (Bedframe skill)
2. this file (`AGENTS.md`)
3. nearest folder-level `AGENTS.md` for files being edited
4. `src/_config/bedframe.config.ts`
5. `src/manifests/*`
6. `src/pages/*`
7. `src/scripts/*`
8. `package.json`
9. `vite.config.*`
10. `.github/workflows/mvp.yml`

## Commands

- install dependencies: use the project package manager (`bun install`, `pnpm install`, `npm install`, or `yarn install`)
- local development: `bedframe dev`
- local development for selected browsers: `bedframe dev <browser[,browser...]>`
- production build: `bedframe build`
- build selected browsers: `bedframe build <browser[,browser...]>`
- zip build output: `bedframe zip`
- version release state: `bedframe version`
- publish supported targets: `bedframe publish --browsers <browser[,browser...]>`

Use the smallest Bedframe command that proves the task.

## Skills

Project skills are installed in `.agents/skills/*`.

Primary Bedframe project skill:

- `bedframe`

Use `.agents/skills/bedframe/SKILL.md` and `references/*` for task-specific guidance on config, manifests, pages, scripts, Vite, testing, MVP/release, and publish workflows.

## Local Contracts

Read the nearest folder-level `AGENTS.md` before editing.

Common locations:

- `src/_config/AGENTS.md`
- `src/manifests/AGENTS.md`
- `src/pages/AGENTS.md`
- `src/scripts/AGENTS.md`
- `src/__tests__/AGENTS.md` when tests are enabled

## Alignment Rules

Keep these surfaces aligned:

- `src/_config/bedframe.config.ts`
- `src/manifests/*`
- `src/pages/*`
- `src/scripts/*`
- `package.json`
- `vite.config.*`
- `.github/workflows/mvp.yml`
- `.changeset/*` when release/version work is involved

Specific rules:

- `browser` values must match browser targets in `src/manifests/*`
- `extension.manifest` targets must match actual `BuildTarget` exports
- `extension.pages` must stay aligned with `src/pages/*`
- manifest page fields must reference real page entrypoints
- script paths must match manifest source and files on disk
- development settings must stay aligned with Vite config and package scripts

## Publish Targets

Direct Bedframe publish targets typically include:

- Chrome
- Firefox
- Edge

Safari usually follows Bedframe build/conversion, then continues through Apple tooling.

Before publish, confirm:

- manifest correctness
- build output
- zip archives
- credentials/secrets
- store-specific constraints
- version and release/tag state

## Guardrails

- Edit source files, not generated `dist/*` output.
- Keep config, manifests, pages, scripts, build, and release surfaces aligned.
- Treat build support and publish support as separate concerns.
- Prefer narrow manifest permission changes and browser-specific deltas.
