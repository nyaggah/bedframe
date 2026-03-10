import { createBedframe } from '@bedframe/core'
import { chrome } from '../manifests/chrome'
import { firefox } from '../manifests/firefox'
import { safari } from '../manifests/safari'
import { brave } from '../manifests/brave'
import { opera } from '../manifests/opera'
import { edge } from '../manifests/edge'

export default createBedframe({
  browser: [
    chrome.browser,
    firefox.browser,
    safari.browser,
    brave.browser,
    opera.browser,
    edge.browser,
  ],
  extension: {
    type: 'popup',
    overrides: 'none',
    options: 'embedded',
    manifest: [chrome, firefox, safari, brave, opera, edge],
    pages: {
      main: 'src/pages/main.html',
    },
  },
  development: {
    template: {
      config: {
        framework: 'vue',
        language: 'typescript',
        packageManager: 'bun',
        lintFormat: true,
        tests: {
          globals: true,
          setupFiles: ['./_config/tests.config.ts'],
          environment: 'happy-dom',
          coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: '../coverage',
          },
          watch: false,
        },
        git: true,
        gitHooks: true,
        commitLint: true,
        changesets: true,
      },
    },
  },
})
