---
'create-bedframe': patch
'@bedframe/core': patch
'@bedframe/cli': patch
---

strip fs-extra; wrap node-native fs/promises funcs instead
