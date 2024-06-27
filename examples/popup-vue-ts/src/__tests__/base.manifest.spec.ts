import { describe, it, expect } from 'vitest'
import { baseManifest } from '../manifests/base.manifest'

describe('baseManifest', () => {
  it('should have the required fields', () => {
    expect(baseManifest).toHaveProperty('name')
    expect(baseManifest).toHaveProperty('version')
    expect(baseManifest).toHaveProperty('manifest_version')

    expect(typeof baseManifest.name).toBe('string')
    expect(typeof baseManifest.version).toBe('string')
    expect(baseManifest.manifest_version).toBe(3)
  })

  it('should have the recommended fields', () => {
    expect(baseManifest).toHaveProperty('description')
    expect(baseManifest).toHaveProperty('icons')
    expect(baseManifest.icons).toHaveProperty('16')
    expect(baseManifest.icons).toHaveProperty('32')
    expect(baseManifest.icons).toHaveProperty('48')
    expect(baseManifest.icons).toHaveProperty('128')

    expect(typeof baseManifest.description).toBe('string')
    expect(typeof baseManifest.icons['16']).toBe('string')
    expect(typeof baseManifest.icons['32']).toBe('string')
    expect(typeof baseManifest.icons['48']).toBe('string')
    expect(typeof baseManifest.icons['128']).toBe('string')
  })

  it('should have the action fields', () => {
    expect(baseManifest).toHaveProperty('action')
    expect(baseManifest.action).toHaveProperty('default_icon')
    expect(baseManifest.action).toHaveProperty('default_title')
    expect(baseManifest.action).toHaveProperty('default_popup')

    expect(baseManifest.action.default_icon).toHaveProperty('16')
    expect(baseManifest.action.default_icon).toHaveProperty('32')
    expect(baseManifest.action.default_icon).toHaveProperty('48')
    expect(baseManifest.action.default_icon).toHaveProperty('128')

    expect(typeof baseManifest.action.default_title).toBe('string')
    expect(typeof baseManifest.action.default_popup).toBe('string')
  })

  it('should have the optional fields', () => {
    expect(baseManifest).toHaveProperty('author')
    expect(baseManifest).toHaveProperty('background')
    expect(baseManifest).toHaveProperty('options_ui')
    expect(baseManifest).toHaveProperty('web_accessible_resources')
    expect(baseManifest).toHaveProperty('commands')
    expect(baseManifest).toHaveProperty('permissions')

    expect(typeof baseManifest.author).toBe('string')
    expect(baseManifest.background).toHaveProperty('service_worker')
    expect(baseManifest.background).toHaveProperty('type')

    expect(baseManifest.options_ui).toHaveProperty('page')
    expect(baseManifest.options_ui).toHaveProperty('open_in_tab')

    expect(Array.isArray(baseManifest.web_accessible_resources)).toBe(true)
    expect(baseManifest.web_accessible_resources[0]).toHaveProperty('resources')
    expect(baseManifest.web_accessible_resources[0]).toHaveProperty('matches')

    expect(baseManifest.commands).toHaveProperty('_execute_action')
    expect(baseManifest.commands._execute_action).toHaveProperty(
      'suggested_key',
    )

    expect(Array.isArray(baseManifest.permissions)).toBe(true)
  })
})
