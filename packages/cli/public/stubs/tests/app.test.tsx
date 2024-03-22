import { createManifestBase } from '@bedframe/core'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { App } from '@/components/app'

const baseManifestMock = createManifestBase({
  name: 'Bedframe Extension',
  version: '0.0.1',
  description: 'Bedframe extension description',
  manifest_version: 3,
  action: {
    default_icon: {
      '16': 'assets/icons/icon-16x16.png',
      '32': 'assets/icons/icon-32x32.png',
      '48': 'assets/icons/icon-48x48.png',
      '128': 'assets/icons/icon-128x128.png',
    },
  },
})

describe('<App />', () => {
  beforeAll(() => {
    window.chrome = {
      // @ts-expect-error Type '{ getManifest: () => ManifestV3; }' is missing the following properties from type 'typeof runtime'
      runtime: {
        getManifest: () => baseManifestMock,
      },
    }
  })

  test('App mounts', () => {
    const wrapper = render(<App />)
    expect(wrapper).toBeTruthy()
  })
})
