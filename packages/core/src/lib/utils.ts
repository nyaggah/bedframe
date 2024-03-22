export type ObjectValues<T> = T[keyof T]

export function createEnum<T extends Record<string, string>>(enumObj: T) {
  return Object.values(enumObj) as unknown as ObjectValues<T>
}

export type AnyCase<T extends string> =
  | Uppercase<T>
  | Lowercase<T>
  | Capitalize<T>
  | Uncapitalize<T>

export type AnyCaseLanguage<T extends string, K extends string> =
  | Uppercase<T | K>
  | Lowercase<T | K>
  | Capitalize<T | K>
  | Uncapitalize<T | K>

export type OptionalKeys<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K]
}
