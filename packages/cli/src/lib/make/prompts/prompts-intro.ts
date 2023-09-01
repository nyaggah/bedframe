import {
  lightMagenta,
  lightGreen,
  lightCyan,
  lightYellow,
  dim,
  bold,
} from 'kolorist'
/**
 * Returns Bedframe banner / intro text
 *
 * @export
 * @return {*}  {string}
 */
export function promptsIntro(): string {
  return `
${bold(dim('>_'))}

  ${lightMagenta('B R O W S E R')} 
  ${lightGreen('E X T E N S I O N')} 
  ${lightCyan('D E V E L O P M E N T')}
  ${lightYellow('F R A M E W O R K')}
`
}
