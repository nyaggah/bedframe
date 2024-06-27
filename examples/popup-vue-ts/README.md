<div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

# Bedframe + Vue 3 + TypeScript + Vite

### 1. Clone example repo and remove git history:

```bash
npx degit nyaggah/bedframe/examples/popup-vue-ts my-vue-popup-ts
```

### 2. Change into that directory:

```bash
cd my-vue-popup-ts
```

### 3. Rename the files and folders

Find all files in the root directory that start with `__` leading double underscores to have a leading `.` dot:

- \_\_changeset/
- \_\_github/
- \_\_husky/
- \_\_vscode/
- \_\_gitignore

```bash
# macOS / Unix-like systems
for file in __*; do mv "$file" ".${file:2}"; done

# windows
Get-ChildItem -Name __* | Rename-Item -NewName {$_ -replace '^__','.'}
```

### 4. Develop extension(s) locally

```bash
# start vite dev server for all extensions concurrently
npm run dev

# start vite dev server for 1 extension
npm run dev chrome

# start vite dev server for multiple extension(s) concurrently

# ^^^ see console output; might need to open different terminals for each
npm run dev chrome,firefox,edge
```

5. build extension(s)

```bash
# build all extensions concurrently
npm run build

# build only 1 extension
npm run build chrome

# build only multiple extension(s) concurrently
npm run build chrome,firefox,edge
```
