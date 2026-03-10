import type { AnyCase, Browser } from '@bedframe/core'
import { Command } from 'commander'
import { execa, type ResultPromise } from 'execa'
import {
  blue,
  dim,
  green,
  lightCyan,
  lightGreen,
  lightMagenta,
  lightRed,
  lightYellow,
  magenta,
} from 'kolorist'
import { getBrowserArray } from '../lib/get-browser-array'
import { DevTui, isNoiseLine } from './dev-tui'

const DEFAULT_BASE_PORT = 5173

const browserColorFns = [
  lightMagenta,
  green,
  lightCyan,
  lightYellow,
  lightRed,
  blue,
]

function colorFor(index: number) {
  return browserColorFns[index % browserColorFns.length]
}

async function executeDevScript(
  browsers: AnyCase<Browser>[] = [],
  basePort: number = DEFAULT_BASE_PORT,
): Promise<void> {
  const sorted = [...browsers].sort((a, b) => a.localeCompare(b))
  const useTui = sorted.length > 1 && process.stdout.isTTY

  if (!useTui) {
    printBanner(sorted, basePort)
  }

  const tui = useTui ? new DevTui(sorted) : null
  tui?.start()

  const children: ResultPromise[] = []

  for (let i = 0; i < sorted.length; i++) {
    const browser = sorted[i]
    const color = colorFor(i)
    const prefix = color(`[${browser}]`)
    const mode = browser.toLowerCase()
    const port = basePort + i
    const panelState = { viteReady: false }

    const child = execa('vite', ['--mode', mode], {
      stdio: [tui ? 'pipe' : 'ignore', 'pipe', 'pipe'],
      env: {
        FORCE_COLOR: '1',
        BEDFRAME_DEV_PORT: String(port),
      },
    })

    if (tui) {
      tui.registerChild(i, {
        stdin: child.stdin ?? null,
        kill: (signal?: NodeJS.Signals) =>
          child.kill(signal as NodeJS.Signals),
      })
    }

    const handleStream = (stream: NodeJS.ReadableStream) => {
      let buffer = ''
      stream.on('data', (chunk: Buffer) => {
        buffer += chunk.toString()
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''
        for (const line of lines) {
          if (tui) {
            tui.appendLine(i, line)
          } else {
            if (!isNoiseLine(line, panelState))
              console.log(`${prefix} ${line}`)
          }
        }
      })
      stream.on('end', () => {
        if (buffer.length > 0) {
          if (tui) {
            tui.appendLine(i, buffer)
          } else {
            if (!isNoiseLine(buffer, panelState))
              console.log(`${prefix} ${buffer}`)
          }
        }
      })
    }

    if (child.stdout) handleStream(child.stdout)
    if (child.stderr) handleStream(child.stderr)

    children.push(child)
  }

  const cleanup = () => {
    tui?.destroy()
    for (const child of children) {
      child.kill('SIGTERM')
    }
  }

  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)

  try {
    await Promise.all(children)
  } catch {
    // child processes terminated (user pressed Ctrl+C)
  } finally {
    tui?.destroy()
    process.off('SIGINT', cleanup)
    process.off('SIGTERM', cleanup)
  }
}

function printBanner(browsers: AnyCase<Browser>[], basePort: number) {
  const browsersLength = browsers.length - 1
  console.log(
    `${lightGreen(
      `${magenta(browsers.length)} ${
        browsers.length > 1 ? 'BEDs' : 'BED'
      } starting vite dev server! 🚀`,
    )}
${dim('└')} dist${dim('/')}${browsers
      .map(
        (browser, i) => `
  ${dim(`${browsersLength === i ? '└' : '├'}`)} ${browser}${dim('/')} ${dim(`:${basePort + i}`)}`,
      )
      .join('')}
`,
  )
}

export const devCommand = new Command('dev')
  .command('dev')
  .description('start Vite dev server for one or more browsers concurrently')
  .argument('[browsers]', 'list of browser names')
  .option('-p, --port <port>', 'base port number', String(DEFAULT_BASE_PORT))
  .action(async (browser, opts) => {
    const browserArray = getBrowserArray()
    const basePort = parseInt(opts.port, 10)
    let cliBrowsers: AnyCase<Browser>[] = []
    if (!browser) {
      cliBrowsers = browserArray
    } else {
      cliBrowsers = Array.isArray(browser) ? browser : browser.split(',')
    }

    const browsers = browser ? cliBrowsers : browserArray
    executeDevScript(browsers, basePort)
  })
