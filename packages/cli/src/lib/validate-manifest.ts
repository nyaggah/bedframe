import { Manifest } from '@bedframe/core'

// type ValidatableValue = string | number | boolean | null | undefined | ValidatableObject | ValidatableArray;
// interface ValidatableObject {
//   [key: string]: ValidatableValue;
// }
// interface ValidatableArray extends Array<ValidatableValue> {}
type ValidatableValue = string | number | boolean | null

type ValidatableArray = ValidatableObjectOrArray[] | ValidatableValue[]

type ValidatableObject = Record<string, any | ValidatableValue>

type ValidatableObjectOrArray =
  | ValidatableObject
  | ValidatableArray
  | ValidatableValue

function validateObjectOrArray(
  obj: ValidatableObject | ValidatableArray,
  validator: (value: ValidatableValue) => boolean,
  path: string,
): boolean {
  if (Array.isArray(obj)) {
    return obj.every((value, index) =>
      validateObjectOrArray(value, validator, `${path}[${index}]`),
    )
  }
  if (typeof obj === 'object' && obj !== null) {
    return Object.entries(obj).every(([key, value]) =>
      validateObjectOrArray(value, validator, `${path}.${key}`),
    )
  }
  return validator(obj)
}

// export function validateManifestV3(manifest: Manifest): boolean {
//   const validator = (value: ValidatableValue, path: string): boolean => {
//     if (value === null || value === undefined) {
//       return true;
//     }
//     switch (typeof value) {
//       case 'string':
//       case 'number':
//       case 'boolean':
//         return true;
//       case 'object':
//         if (Array.isArray(value)) {
//           return validateObjectOrArray(value, validator, path);
//         }
//         if (value instanceof RegExp) {
//           return true;
//         }
//         if (value instanceof Date) {
//           return !isNaN(value.getTime());
//         }
//         return validateObjectOrArray(value, validator, path);
//       default:
//         return false;
//     }
//   };

//   const entries = Object.entries(manifest) as Array<[keyof Manifest, ValidatableValue]>;
//   const errors: string[] = [];

//   for (const [key, value] of entries) {
//     if (!validator(value, `manifest.${key}`)) {
//       errors.push(`Invalid value for manifest.${key}`);
//     }
//   }

//   if (errors.length > 0) {
//     console.error(errors.join('\n'));
//     return false;
//   }

//   console.log('ManifestV3 is valid.');
//   return true;
// }

// // TO diddly DO: determine if this is the vibes or nah!

// import { type Plugin, unified } from 'unified'
// import remarkMdx, { Root } from 'remark-mdx'
// import markdown from 'remark-parse'
// import type { Parent, Node } from 'unist'
// import { VFile } from 'vfile'
// import { Manifest } from '@bedframe/core'

// interface ManifestNode extends Node {
//   type: 'manifest'
//   value: string
// }

// type BedframeValidateType = {
//   file: VFile
//   result: Root
// }

// function isManifestNode(node: Node): node is ManifestNode {
//   return node.type === 'manifest'
// }

// export const bedframeLint: Plugin<[options?: any], VFile> =
//   () => (tree: Parent, file: VFile) => {
//     const manifestNode = tree.children.find((node) => isManifestNode(node)) as
//       | ManifestNode
//       | undefined

//     if (!manifestNode) {
//       file.message('Missing manifest node', tree)
//       return
//     }

//     let manifest
//     try {
//       manifest = JSON.parse(manifestNode.value)
//     } catch (error) {
//       file.message((error as Error).message, manifestNode)
//       return
//     }

//     const requiredFields = [
//       'manifest_version',
//       'name',
//       'version',
//       // 'permissions',
//       // 'background',
//     ]

//     const recommendedFields = ['description', 'icons', 'default_locale']

//     const missingFields: string[] = []

//     // Check required fields
//     for (const field of requiredFields) {
//       if (!Object.prototype.hasOwnProperty.call(manifest, field)) {
//         missingFields.push(`Missing required field "${field}"`)
//       }
//     }

//     // Check recommended fields
//     for (const field of recommendedFields) {
//       if (!Object.prototype.hasOwnProperty.call(manifest, field)) {
//         file.message(`Missing recommended field "${field}"`, manifestNode)
//       }
//     }

//     // Report missing required fields
//     if (missingFields.length > 0) {
//       file.message(
//         `Manifest is missing required fields:\n${missingFields.join('\n')}`,
//         manifestNode
//       )
//     }

//     // Check manifest version
//     const manifestVersion = Number.parseInt(
//       manifest.manifest_version as string,
//       10
//     )
//     if (Number.isNaN(manifestVersion) || manifestVersion < 3) {
//       file.message('Manifest version must be at least 3', manifestNode)
//     }
//   }

// export async function bedframeValidate(
//   manifest: any // Manifest
// ): Promise<BedframeValidateType> {
//   console.log('bedframeValidate(manifest)::', manifest)
//   const processor = unified()
//     .use(markdown)
//     .use(remarkMdx)
//     .use(bedframeLint)
//     .freeze()

//   const file = new VFile({ contents: manifest })
//   const result = processor.parse(file)
//   // .processSync(file)

//   console.group('bedframeValidate')
//   console.log('')
//   console.log('manifest', manifest)
//   console.log('')
//   console.log('file', file)
//   console.log('')
//   console.log('result:', result)
//   console.groupEnd()

//   return {
//     file,
//     result,
//   }
// }

// // TODO:
// // const name = process.env.npm_config_name
// // const version = process.env.npm_config_version
// // const manifest_version = Number(process.env.npm_config_manifest_version)

// // export const manifest: Partial<Manifest> | Record<string, any> = {
// //   name,
// //   version,
// //   manifest_version,
// // }

// // console.log('manifest --->', manifest)

// // export const _manifest = JSON.parse(
// //   JSON.stringify(process.env.npm_config_manifest)
// // )

// /*
//   const manifest = { "name": "bedframe-project", "version": "0.0.0", "manifest_version": 2 }
//   bedframeValidate(manifest)
// */

// bedframeValidate({
//   namea: 'bedframe-project',
//   versiaon: 1,
//   manifest_version: 2,
// })
