---
'create-bedframe': patch
'@bedframe/cli': patch
---

Prevent public assets from inflating npm tarballs

Disable Vite publicDir copying for CLI and create-bedframe package builds so repository media files are not emitted into dist and published artifacts.
