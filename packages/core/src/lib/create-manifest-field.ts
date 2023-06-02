import {
  Manifest,
  ManifestAction,
  ManifestBackground,
  ManifestCommands,
  ManifestContentScripts,
  ManifestIcons,
  ManifestPermissions,
  ManifestWebAccessibleResources,
} from './types'

function manifestIcons(icons: ManifestIcons): ManifestIcons {
  return icons
}

function manifestAction(action: ManifestAction): ManifestAction {
  return action
}

function manifestBackground(
  background: ManifestBackground
): ManifestBackground {
  return background
}

function manifestSidePanel(
  sidePanel: any // SidePanel <-- TO diddly DO: update when @types/chrome catches up
): any {
  return sidePanel
}

function manifestContentScripts(
  contentScripts: ManifestContentScripts
): ManifestContentScripts {
  return contentScripts
}

function manifestWebAccessibleResources(
  webAccessibleResources: ManifestWebAccessibleResources
): ManifestWebAccessibleResources {
  return webAccessibleResources
}

function manifestCommands(commands: ManifestCommands): ManifestCommands {
  return commands
}

function manifestPermissions(
  permissions: ManifestPermissions
): ManifestPermissions {
  return permissions
}

export const create = {
  manifestIcons,
  manifestAction,
  manifestBackground,
  manifestSidePanel,
  manifestContentScripts,
  manifestWebAccessibleResources,
  manifestCommands,
  manifestPermissions,
}

// - - - - - - - - - -

// export type ManifestField = keyof Manifest

// export function field<T extends ManifestField>(
//   field: Manifest[T]
// ): Manifest[T] {
//   return field
// }

// type CreateFunctions = {
//   [K in ManifestField as `${K}`]: (manifestField: Manifest[K]) => Manifest[K]
// }

// const _create: CreateFunctions = {} as CreateFunctions

// const manifest: Manifest = chrome.runtime.getManifest() as Manifest

// Object.entries(manifest).forEach(([key, _value]) => {
//   const fieldName = key as ManifestField
//   if (typeof fieldName === 'string') {
//     const functionName = fieldName

//     _create[functionName] = (manifestField: Manifest[keyof ManifestField]) =>
//       field<ManifestField>(manifestField)
//   }
// })

// export { _create }

export type ManifestField = keyof Manifest

export function field<T extends ManifestField>(
  field: Manifest[T]
): Manifest[T] {
  return field
}

type CreateFunctions = {
  [K in ManifestField as `${Capitalize<string & K>}`]: (
    manifestField: Manifest[K]
  ) => Manifest[K]
}

const _create: CreateFunctions = {} as CreateFunctions

const manifestFields: Manifest = {} as Manifest

Object.keys(manifestFields).forEach((key) => {
  const fieldName = key as ManifestField
  const functionName = `${fieldName}` as keyof CreateFunctions

  _create[functionName] = (manifestField: Manifest[ManifestField]) =>
    field<ManifestField>(manifestField)
})

export { _create }
