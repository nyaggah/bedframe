import { describe, it, expect } from 'vitest'
import bedframeConfig from '../_config/bedframe.config'

describe('Bedframe Configuration', () => {
  const config = bedframeConfig

  it("should have correct types and shapes for 'Browser' configs", () => {
    // Check browser array
    expect(Array.isArray(config.browser)).toBe(true)
    expect(config.browser.length).toBe(6) // Assuming there are 6 browsers in the array
  })

  it("should have correct types and shapes for 'Extension' configs", () => {
    // Check extension object
    expect(typeof config.extension).toBe('object')
    expect(config.extension.type).toBe('popup')
    expect(config.extension.overrides).toBe('none')
    expect(config.extension.options).toBe('embedded')
    expect(Array.isArray(config.extension.manifest)).toBe(true)
    expect(config.extension.manifest.length).toBe(6) // Assuming there are 6 manifests in the array

    // Check pages object
    expect(typeof config.extension.pages).toBe('object')
  })

  it("should have correct types and shapes for 'Development' configs", () => {
    // Check development template config
    expect(typeof config.development).toBe('object')
    expect(typeof config.development.template).toBe('object')
    expect(typeof config.development.template.config).toBe('object')
    expect(config.development.template.config.framework).toBe('vue')
    expect(config.development.template.config.language).toBe('typescript')
    expect(config.development.template.config.packageManager).toBe('bun')

    // Check style fonts
    expect(Array.isArray(config.development.template.config.style.fonts)).toBe(
      true,
    )
    if (config.development.template.config.style.fonts) {
      expect(config.development.template.config.style.fonts.length).toBe(1) // Assuming there is one font object
      const interFont = config.development.template.config.style.fonts[0]
      expect(typeof interFont).toBe('object')
      expect(interFont.name).toBe('Inter')
      expect(interFont.local).toBe('Inter')
      expect(typeof interFont.weights).toBe('object')
      expect(interFont.weights['Inter-Regular']).toBe(400)
      expect(interFont.weights['Inter-SemiBold']).toBe(600)
      expect(interFont.weights['Inter-Bold']).toBe(700)
      expect(interFont.weights['Inter-ExtraBold']).toBe(800)
    }

    // Check lintFormat and tests setup
    expect(config.development.template.config.lintFormat).toBe(true)
    expect(typeof config.development.template.config.tests).toBe('object')
    expect(config.development.template.config.tests.setupFiles).toEqual([
      './_config/tests.config.ts',
    ])
    expect(config.development.template.config.tests.environment).toBe(
      'happy-dom',
    )
    expect(config.development.template.config.tests.coverage.provider).toBe(
      'istanbul',
    )
    expect(
      Array.isArray(config.development.template.config.tests.coverage.reporter),
    ).toBe(true)
    expect(config.development.template.config.tests.coverage.reporter).toEqual([
      'text',
      'json',
      'html',
    ])
    expect(
      config.development.template.config.tests.coverage.reportsDirectory,
    ).toBe('../coverage')
    expect(config.development.template.config.tests.watch).toBe(false)

    // Check git related configurations
    expect(config.development.template.config.git).toBe(true)
    expect(config.development.template.config.gitHooks).toBe(true)
    expect(config.development.template.config.commitLint).toBe(true)
    expect(config.development.template.config.changesets).toBe(true)
  })
})
