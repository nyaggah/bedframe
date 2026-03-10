# Bedframe

This repository contains the Bedframe open source framework, its docs, and the current OSS command and type surface.

## Read first

When working in this repository, start with:

1. `docs/bf2/index.md`
2. `docs/bf2/start/work-with-an-agent.md`
3. `docs/bf2/start/project/bedframe-config.md`
4. `docs/bf2/publish/publish-overview.md`

## Current OSS Bedframe surface

The current public OSS Bedframe flow is centered on:

- `create-bedframe`
- `bedframe make`
- `bedframe dev`
- `bedframe build`
- `bedframe zip`
- `bedframe version`
- `bedframe publish`

The code-level surface is centered on:

- `packages/core/src/lib/create-bedframe.ts`
- `packages/core/src/lib/create-manifest.ts`
- `packages/core/src/lib/types.ts`

## Source of truth

For user-facing behavior, use these as the source of truth:

- `docs/bf2/*`
- `packages/cli/src/commands/*`
- `packages/core/src/lib/*`
- `packages/create-bedframe/src/index.ts`

## Bedframe project working set

When describing or editing a Bedframe project, keep these files aligned:

- `AGENTS.md`
- `src/_config/bedframe.config.ts`
- `src/manifests/*`
- `src/pages/*`
- `src/scripts/*`
- `package.json`
- `.github/workflows/mvp.yml`

## Skills

Project-level Bedframe skills live in:

- `.agents/skills/*`

These skills should stay aligned with the current OSS docs and command surface.

## Current constraints

Do not document or depend on these as part of the current OSS Bedframe command surface:

- `bedframe sync`
- `bedframe validate`
- `.bedframe/*` generated files
- root-level `bedframe.config.ts`

The current Bedframe project config path is:

- `src/_config/bedframe.config.ts`
