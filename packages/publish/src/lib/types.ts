export type EnvConfig = {
  extensionId: string
  clientId: string
  clientSecret: string
  refreshToken: string
}
export type ConfigActionKey = 'create' | 'update' | 'publish'
export type ConfigAction = {
  visibility?: 'private'
  target?: 'trustedTesters' | 'default'
  exists?: boolean
  autopublish?: boolean
}
export type ActionConfig = {
  [key in ConfigActionKey]: ConfigAction
}

export type PublishConfig = {
  env: EnvConfig
  action: ActionConfig
}
