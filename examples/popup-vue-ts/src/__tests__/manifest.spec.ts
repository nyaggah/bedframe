import { describe, expect, it } from 'vitest'
import { brave } from '../manifests/brave'
import { chrome } from '../manifests/chrome'
import { edge } from '../manifests/edge'
import { firefox } from '../manifests/firefox'
import { opera } from '../manifests/opera'
import { safari } from '../manifests/safari'

describe('Browser-specific manifests', () => {
  ;[chrome, firefox, safari, brave, opera, edge].forEach((buildTarget) => {
    it(`should have the correct structure for ${name}`, () => {
      // required fields
      expect(buildTarget.manifest).toHaveProperty('name')
      expect(buildTarget.manifest).toHaveProperty('version')
      expect(buildTarget.manifest).toHaveProperty('manifest_version')

      // Additional checks specific to each browser manifest
      switch (buildTarget.browser) {
        case 'firefox':
          expect(buildTarget.manifest).toHaveProperty('background')
          // @ts-expect-error todo: fix error "Property 'background' does not exist on type 'ManifestV3Export'"
          expect(buildTarget.manifest.background).toHaveProperty('scripts')
          // @ts-expect-error todo: fix error "Property 'background' does not exist on type 'ManifestV3Export'"
          expect(Array.isArray(buildTarget.manifest.background.scripts)).toBe(
            true,
          )
          expect(buildTarget.manifest).toHaveProperty(
            'browser_specific_settings',
          )
          // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
          expect(buildTarget.manifest.browser_specific_settings).toHaveProperty(
            'gecko',
          )
          expect(
            // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
            buildTarget.manifest.browser_specific_settings.gecko,
          ).toHaveProperty('id')
          expect(
            // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
            typeof buildTarget.manifest.browser_specific_settings.gecko.id,
          ).toBe('string')
          break
        case 'safari':
          expect(buildTarget.manifest).toHaveProperty(
            'browser_specific_settings',
          )

          // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
          expect(buildTarget.manifest.browser_specific_settings).toHaveProperty(
            'safari',
          )
          expect(
            // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
            buildTarget.manifest.browser_specific_settings.safari,
          ).toHaveProperty('strict_min_version')
          expect(
            // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
            buildTarget.manifest.browser_specific_settings.safari,
          ).toHaveProperty('strict_max_version')
          expect(
            // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
            typeof buildTarget.manifest.browser_specific_settings.safari
              .strict_min_version,
          ).toBe('string')
          expect(
            // @ts-expect-error todo: fix error "Property 'browser_specific_settings' does not exist on type 'ManifestV3Export'"
            typeof buildTarget.manifest.browser_specific_settings.safari
              .strict_max_version,
          ).toBe('string')
          break
        default:
          // For other browsers (chrome, brave, edge, opera), ensure they inherit baseManifest properly
          expect(buildTarget.manifest).toHaveProperty('options_ui')
          // @ts-expect-error todo: fix error "Property 'options_ui' does not exist on type 'ManifestV3Export'"
          expect(buildTarget.manifest.options_ui).toHaveProperty('page')
          break
      }
    })
  })
})
