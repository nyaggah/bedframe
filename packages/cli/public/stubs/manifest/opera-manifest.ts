/* eslint camelcase: 0 */
import { createManifest } from '@beframe/core'
import { icons, shared } from './shared-manifest'

export const opera = createManifest({
  ...shared,
  commands: {
    _execute_action: {
      suggested_key: {
        default: 'Ctrl+Shift+1',
        windows: 'Ctrl+Shift+1',
        mac: 'Ctrl+Shift+1',
      },
    },
  },
  action: {
    default_icon: icons,
  },
  icons,
  background: {
    service_worker: 'src/scripts/service-worker.ts',
  },
  content_scripts: [
    {
      js: ['src/scripts/content.tsx'],
      matches: ['<all_urls>'],
      // all_frames: true,
    },
  ],
  web_accessible_resources: [
    {
      resources: [icons['128']],
      matches: ['<all_urls>'],
    },
  ],
  permissions: ['activeTab', 'downloads'],
  // externally_connectable: {
  //   matches: ['http://localhost:3000/*'],
  // },
})

export default opera
