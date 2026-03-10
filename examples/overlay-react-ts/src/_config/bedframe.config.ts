import { createBedframe } from '@bedframe/core'
import { chrome } from '../manifests/chrome'
import { brave } from '../manifests/brave'
import { opera } from '../manifests/opera'
import { edge } from '../manifests/edge'
import { firefox } from '../manifests/firefox'
import { safari } from '../manifests/safari'

export default createBedframe({
  browser: [
    chrome.browser,
    brave.browser,
    opera.browser,
    edge.browser,
    firefox.browser,
    safari.browser,
  ],
  extension: {
    type: 'overlay',
    overrides: 'newtab',
    options: 'embedded',
    manifest: [chrome, brave, opera, edge, firefox, safari],
    pages: {
      overlay: 'src/pages/main.html',
      newtab: 'src/pages/newtab.html',
    },
  },
  development: {
    template: {
      config: {
        framework: 'react',
        language: 'typescript',
        packageManager: 'npm',
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
