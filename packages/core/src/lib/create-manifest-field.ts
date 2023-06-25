import {
  Manifest,
  ManifestAction,
  ManifestBackground,
  ManifestCommands,
  ManifestContentScripts,
  ManifestIcons,
  ManifestOptionsUI,
  ManifestPermissions,
  ManifestURLOverrides,
  ManifestWebAccessibleResources,
} from './types'

function icons(icons: ManifestIcons): ManifestIcons {
  return icons
}

function action(action: ManifestAction): ManifestAction {
  return action
}

function background(background: ManifestBackground): ManifestBackground {
  return background
}

function sidePanel(
  sidePanel: any // SidePanel <-- TO diddly DO: update when @types/chrome catches up
): any {
  return sidePanel
}

function contentScripts(
  contentScripts: ManifestContentScripts
): ManifestContentScripts {
  return contentScripts
}

function webAccessibleResources(
  webAccessibleResources: ManifestWebAccessibleResources
): ManifestWebAccessibleResources {
  return webAccessibleResources
}

function commands(commands: ManifestCommands): ManifestCommands {
  return commands
}

function permissions(permissions: ManifestPermissions): ManifestPermissions {
  return permissions
}

function optionsUI(options: ManifestOptionsUI): ManifestOptionsUI {
  return options
}

function urlOverrides(overrides: ManifestURLOverrides): ManifestURLOverrides {
  return overrides
}

export const manifest = {
  icons,
  action,
  background,
  sidePanel,
  contentScripts,
  webAccessibleResources,
  commands,
  permissions,
  optionsUI,
  urlOverrides,
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
