import {
  lightMagenta,
  lightGreen,
  lightCyan,
  lightYellow,
  dim,
  bold,
} from 'kolorist'

export function promptsIntro(): void {
  console.log(`
${bold(dim('>_'))}

  ${lightMagenta('B R O W S E R')} 
  ${lightGreen('E X T E N S I O N')} 
  ${lightCyan('D E V E L O P M E N T')}
  ${lightYellow('F R A M E W O R K')}
`)
}
