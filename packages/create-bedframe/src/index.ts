import childProcess from 'node:child_process'
childProcess.execSync('npx @bedframe/cli@latest make', { stdio: 'inherit' })
