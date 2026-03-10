# Bedframe MVP

`M.V.P.` means `make, version, publish`.

In a standard Bedframe project, `.github/workflows/mvp.yml` is the default CI/CD path.

## Default release flow

1. A pull request is opened, or changes are merged into `main`.
2. The workflow checks whether the merged changes include pending Changesets and compares the current package version against existing git tags and releases.
3. If a new release is required, the workflow raises or updates a Version/Release PR instead of publishing immediately.
4. Additional merged changes continue updating that Version/Release PR until it is merged.
5. Once the Version/Release PR is merged, the same `mvp.yml` flow runs again and proceeds through build, package, release, and browser-store publish for the latest version.

## Working rules

- treat `.github/workflows/mvp.yml` as the primary automated release contract
- inspect `.changeset/*`, `package.json`, and existing git tags or releases together
- direct `bedframe publish --browsers ...` is the manual equivalent of the publish phase, not a replacement for the version phase

## Operational checks

Before and during release flow:

1. confirm `.changeset/*` exists for releasable changes
2. confirm version scripts in `package.json` align with Bedframe workflow
3. confirm workflow config in `.github/workflows/mvp.yml` matches current publish targets
4. confirm generated build and zip artifacts are valid before publish stage

## Manual parity

- `bedframe version` should represent the same release-state logic used in automated flow.
- `bedframe publish --browsers ...` should be treated as manual publish-stage execution, not a substitute for release bookkeeping.
