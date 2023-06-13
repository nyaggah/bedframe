import {
  lightRed,
  lightMagenta,
  lightGreen,
  lightCyan,
  lightYellow,
  dim,
  bgLightMagenta,
  bgLightGreen,
  bgLightCyan,
  bgLightYellow,
  bold,
} from 'kolorist'

// export const sleep = (ms = 800) => new Promise((r) => setTimeout(r, ms))

export async function promptsIntro(): Promise<string> {
  // // Your
  // ${lightMagenta('Browser')}
  // ${lightGreen('Extension')}
  // ${lightCyan('Development')}
  // ${lightRed('B E D F R A M E')}
  // ${lightMagenta('B')} ${lightGreen('E')} ${lightCyan('D')} ${lightYellow(
  //     'F R A M E'
  //   )}

  // ${bgLightMagenta(' B ')} ${lightMagenta('R O W S E R')}
  // ${bgLightGreen(' E ')} ${lightGreen('X T E N S I O N')}
  // ${bgLightCyan(' D ')} ${lightCyan('E V E L O P M E N T')}
  // ${bgLightYellow(' F R A M E ')} ${lightYellow('W O R K')}
  // console.log(`
  // ${bold(dim('>_'))}

  // ${bold(lightMagenta('B '))}${lightMagenta('R O W S E R')}
  // ${lightGreen('E X T E N S I O N')}
  // ${lightCyan('D E V E L O P M E N T')}
  // ${lightYellow('F R A M E W O R K')}
  // `)

  return `
${bold(dim('>_'))}

  ${bold(lightMagenta('B '))}${lightMagenta('R O W S E R')} 
  ${lightGreen('E X T E N S I O N')} 
  ${lightCyan('D E V E L O P M E N T')}
  ${lightYellow('F R A M E W O R K')}
`
  // USAGE
  //   $ bedframe make [name]          name and make your bed

  // ARGUMENTS
  //   make <options>

  // OPTIONS
  //   -v, --version <version>         Specify project version
  //   -b, --browsers <browsers>       Specify comma-separated list of supported browsers
  //   -p, --packageManager <packageManager>
  //                                   Specify package manager to use
  //   -f, --framework <framework>      Specify framework to use
  //   -l, --language <language>        Specify language to use
  //   -s, --style <style>              Specify CSS styling solution
  //       --lintFormat                 Add linting with formatting
  //       --git                        Add git source control
  //       --gitHooks                   Add git hooks
  //       --tests                      Add tests (Vitest + Testing Library)
  //       --commitLint                 Add commit linting
  //       --changesets                 Add changesets
  //       --installDeps                Install dependencies
  //   -y, --yes                        Set up Bedframe w/ suggested defaults
}
