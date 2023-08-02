import type { CustomFontFamily } from 'unplugin-fonts/types'
import Unfonts from 'unplugin-fonts/vite'

export type FontWeight = {
  [key: string]: number
}

export type FontFamily = CustomFontFamily & {
  weights?: FontWeight
}

/**
 *
 * @param fonts
 * @returns Unfonts()
 *
 */
export function getFonts(fonts: FontFamily[]) {
  return Unfonts({
    custom: {
      families: fonts.map((f) => {
        const fontWeights = f.weights
        return {
          name: f.name,
          local: f.local,
          src: f.src,
          transform(font) {
            if (!fontWeights) return null
            if (font.basename in fontWeights) {
              font.weight = fontWeights[font.basename]
            }
            return font
          },
        }
      }),
    },
  })
}
