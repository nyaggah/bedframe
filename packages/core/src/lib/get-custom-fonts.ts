import Unfonts from 'unplugin-fonts/vite'

export type FontWeight = {
  [key: string]: number
}

// extend or use directly from `CustomFontFamily`
// from unplugin-fonts
// so object can accept all options
// ^^^ don't cripple plugin functionality, boi boi!
export type CustomFontOptions = {
  name: string
  local: string | string[]
  src: string | string[]
  weights?: FontWeight
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
export function getCustomFonts(fonts: CustomFontOptions[]) {
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
