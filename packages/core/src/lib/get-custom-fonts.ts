import type { CustomFontFamily } from 'unplugin-fonts/types'
import Unfonts from 'unplugin-fonts/vite'

export type CustomFontWeight = {
  [key: string]: number
}

export type BedframeCustomFontFamily = CustomFontFamily & {
  weights?: CustomFontWeight
}

/**
 *
 * @param fonts
 * @returns Unfonts()
 *
 *  @example()
 *
 *  `./bedframe.config.ts`
 *
 *  ```typescript
 *  {
 *    // ... other fields
 *    fonts: getCustomFonts([
 *      {
 *        name: 'Inter',
 *        local: 'Inter',
 *        src: './src/assets/fonts/inter/*.ttf',
 *        weights: {
 *          'Inter-Regular': 400,
 *          'Inter-SemiBold': 600,
 *          'Inter-Bold': 700,
 *          'Inter-ExtraBold': 800,
 *        },
 *      },
 *    ]),
 *    // ... other fields
 *  }
 * ```
 *
 */
export function getCustomFonts(fonts: BedframeCustomFontFamily[]) {
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
