<div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

<p align="left">
  <a aria-label="Bedframe logo" href="https://bedframe.dev">
    <img src="https://img.shields.io/badge/BEDFRAME-7a46fc.svg?style=for-the-badge&logo=Bedframe&labelColor=CCC">
  </a>
  <a aria-label="@bedframe/skills - NPM version" href="https://www.npmjs.com/package/@bedframe/skills">
    <img alt="@bedframe/skills - NPM version" src="https://img.shields.io/npm/v/@bedframe/skills.svg?style=for-the-badge&labelColor=000000&label=skills">
  </a>
  <a aria-label="License" href="https://github.com/nyaggah/bedframe/blob/main/LICENSE">
    <img alt="" src="https://img.shields.io/npm/l/next.svg?style=for-the-badge&labelColor=000000">
  </a>
</p>

# **@bedframe/skills**

`@bedframe/skills` is the Bedframe skill library for agent-assisted extension development.

It provides the portable markdown contracts that help coding agents understand how a Bedframe project is structured, how Bedframe workflows operate, and how to work safely with cross-browser extension codebases.

These skills are designed to work with:

- a project-level `AGENTS.md`
- nearest-folder `AGENTS.md` files
- Bedframe-generated project structure
- `@bedframe/cli`
- `@bedframe/core`
- the default `.github/workflows/mvp.yml` release flow

## What developers get

Bedframe projects can install selected skills into:

```text
<bedframe-project>/.agents/skills/*
```

That gives an agent a project-local set of workflow guides for common Bedframe tasks such as:

- understanding the Bedframe `B.E.D.` model
- editing `bedframe.config.ts`
- adding browser targets
- adding pages
- building, zipping, versioning, and publishing
- following the Bedframe `M.V.P.` release contract

The intended outcome is not prompt-heavy hand-holding. The goal is to let a developer use their agent of choice with a clear Bedframe-native contract already present in the repo.

## How it fits into a project

The Bedframe agent contract is split across a few layers:

- root `AGENTS.md`
  - introduces Bedframe, `B.E.D.`, `M.V.P.`, project architecture, and high-level guardrails
- nearest-folder `AGENTS.md`
  - localizes rules for folders such as `src/_config`, `src/manifests`, `src/pages`, and `src/scripts`
- `.agents/skills/*`
  - gives workflow-specific instructions for tasks like config, build, version, and publish

Together these files help an agent navigate both:

- Bedframe architecture and conventions
- the specific local project shape generated during scaffold

## Package contents

- `AGENTS.md`
  - source template for the generated root project `AGENTS.md`
- `bedframe/references/nested-agents/*`
  - nearest-folder `AGENTS.md` templates for generated projects
- `bedframe/*`
  - Bedframe skill content published at package root under the `bedframe` skill
- `bedframe/references/template/SKILL.md`
  - base skill template for future Bedframe skill additions

## Current skill

- `bedframe`

The umbrella `bedframe` skill is the intended project install. It routes to focused reference docs instead of requiring a separate skill folder for each CLI command.

## Skill design

Each skill keeps the main `SKILL.md` short and puts longer task detail in `references/REFERENCE.md`.

That lets an agent:

1. discover the skill from its metadata
2. load the short working instructions in `SKILL.md`
3. load the reference file only when more detail is needed

This follows the same general pattern used by portable markdown-first skill systems: keep the top-level contract concise, then load deeper reference material only when the task actually needs it.

## Example installed shape

After scaffold or manual install, a project can look like:

```text
AGENTS.md
.agents/
  skills/
    bedframe/
      SKILL.md
      references/
        REFERENCE.md
```

Use [`AGENTS.md`](./AGENTS.md) in this package as the source template for that generated file.

Generated projects can also include nearest-folder contracts such as:

```text
src/_config/AGENTS.md
src/manifests/AGENTS.md
src/pages/AGENTS.md
src/scripts/AGENTS.md
src/__tests__/AGENTS.md
```

## Typical use

Use `@bedframe/skills` when you want a Bedframe project to carry its own agent-facing conventions instead of depending on a specific app or harness to explain them at runtime.

That is useful for:

- Claude, Codex, Cursor, Gemini, and similar coding agents
- Teams that want portable repo-local instructions
- Bedframe projects that need consistent config, manifest, page, script, and release behavior

## Release workflow

Bedframe skills assume the standard Bedframe release path:

- `make`
- `version`
- `publish`

In a standard project, `.github/workflows/mvp.yml` is the main CI/CD contract and direct `bedframe publish --browsers ...` is the manual equivalent of the publish phase.
