import {
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
  sidePanel: any, // TO diddly DO: update when @types/chrome catches up
): any {
  return sidePanel
}

function contentScripts(
  contentScripts: ManifestContentScripts,
): ManifestContentScripts {
  return contentScripts
}

function webAccessibleResources(
  webAccessibleResources: ManifestWebAccessibleResources,
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
