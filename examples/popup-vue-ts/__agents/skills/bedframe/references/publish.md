# Bedframe Publish

`.github/workflows/mvp.yml` is the default Bedframe CI/CD path for the publish contract.

Direct `bedframe publish --browsers ...` is the manual equivalent of the publish phase of that workflow.

## Direct publish targets

- Chrome
- Firefox
- Edge

## Separate handoff path

- Safari builds through Bedframe, then continues through Apple's tooling and distribution flow.

## Preflight checklist

Before publish, confirm:

- current version state
- pending `.changeset/*`
- existing git tags or releases
- build output
- zip archives
- credentials
- browser-specific store constraints

## Command examples

- `bedframe publish --browsers chrome`
- `bedframe publish --browsers chrome,firefox,edge`

## Notes

- Keep direct publish targets explicit; do not assume all configured browsers are publishable through direct CLI path.
- Treat Safari as a handoff workflow after build/conversion.
