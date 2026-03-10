# Bedframe Operating Model

Use this file as the index for the single `bedframe` skill.

## Working set (read order)

Inspect these files first in most Bedframe projects:

1. `.agents/skills/bedframe/SKILL.md`
2. `AGENTS.md`
3. nearest-folder `AGENTS.md`
4. `src/_config/bedframe.config.ts`
5. `src/manifests/*`
6. `src/pages/*`
7. `src/scripts/*`
8. `package.json`
9. `vite.config.ts|js`
10. `.github/workflows/mvp.yml` when release-related

## Source of truth

- Docs explain the model.
- `AGENTS.md` localizes the project contract.
- nearest-folder `AGENTS.md` files localize structure.
- skills shape the current task.
- `@bedframe/cli` executes the workflow.
- `@bedframe/core` defines the code-level shape.

## Reference routing by task

- Scaffold behavior and command choice: `cli.md`
- Architecture and file-surface alignment: `architecture.md`
- Bedframe config shape and alignment: `config.md`
- Vite build plumbing and browser mode behavior: `vite.md`
- Manifest patterns and browser deltas: `manifests.md`, `browser-differences.md`
- Page entrypoint rules and extension-type mapping: `pages.md`
- Service worker/runtime script alignment: `scripts.md`
- Testing defaults and expectations: `testing.md`
- Release contract (`mvp.yml`) and version flow: `mvp.md`
- Direct publish flow and Safari handoff: `publish.md`
- Core APIs and types: `core.md`
- Codemod/reference assets contract: `codemods.md`
- Example usage and comparison strategy: `examples.md`
