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
    type: 'sidepanel',
    overrides: 'newtab',
    options: 'embedded',
    manifest: [chrome, brave, opera, edge, firefox, safari],
    pages: {
      welcome: 'src/pages/sidepanel-welcome.html',
      main: 'src/pages/sidepanel-main.html',
      newtab: 'src/pages/newtab.html',
    },
  },
  development: {
    template: {
      config: {
        framework: 'react',
        language: 'typescript',
        packageManager: 'npm',
        style: {
          framework: 'tailwind',
          components: 'shadcn',
          theme: 'new-york',
          fonts: [
            {
              name: 'Inter',
              local: 'Inter',
              src: './assets/fonts/inter/*.ttf',
              weights: {
                'Inter-Regular': 400,
                'Inter-SemiBold': 600,
                'Inter-Bold': 700,
                'Inter-ExtraBold': 800,
              },
            },
          ],
        },
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
