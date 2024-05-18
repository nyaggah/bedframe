import { execSync } from 'node:child_process'

try {
  execSync('npx @bedframe/cli@latest make', { stdio: 'inherit' })
} catch (error) {
  console.error('Failed to execute [bedframe make] command:', error)
}
