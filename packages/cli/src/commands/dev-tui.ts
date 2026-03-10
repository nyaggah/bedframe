import {
  blue,
  bold,
  dim,
  green,
  lightCyan,
  lightMagenta,
  lightRed,
  lightYellow,
} from 'kolorist'
import type { Writable } from 'node:stream'

const ESC = '\x1b'
const CSI = `${ESC}[`

const ansi = {
  alternateScreen: `${CSI}?1049h`,
  mainScreen: `${CSI}?1049l`,
  hideCursor: `${CSI}?25l`,
  showCursor: `${CSI}?25h`,
  moveTo: (row: number, col: number) => `${CSI}${row};${col}H`,
  clearLine: `${CSI}K`,
  reset: `${CSI}0m`,
}

const BOX = {
  h: '─',
  v: '│',
  tl: '┌',
  tr: '┐',
  bl: '└',
  br: '┘',
  hBold: '━',
  vBold: '┃',
  tlBold: '┏',
  trBold: '┓',
  blBold: '┗',
  brBold: '┛',
}

const browserColorFns = [
  lightMagenta,
  green,
  lightCyan,
  lightYellow,
  lightRed,
  blue,
]

const CRXJS_BRANDING = [
  /^\s*>_\s*$/,
  /^\s*B\s+R\s+O\s+W\s+S\s+E\s+R\s*$/,
  /^\s*E\s+X\s+T\s+E\s+N\s+S\s+I\s+O\s+N\s*$/,
  /^\s*T\s+O\s+O\s+L\s+S\s*$/,
  /^\s*➜\s+CRXJS:/,
]

const VITE_READY = /VITE\s+v[\d.]+.*ready\s+in/

function stripAnsi(str: string): string {
  return str.replace(/\x1b\[[0-9;]*m/g, '')
}

export function isNoiseLine(
  line: string,
  panelState?: { viteReady: boolean },
): boolean {
  const plain = stripAnsi(line).trim()
  if (plain === '') return false

  if (panelState && VITE_READY.test(plain)) {
    panelState.viteReady = true
  }

  if (panelState?.viteReady) {
    return CRXJS_BRANDING.some((p) => p.test(plain))
  }

  return false
}

function truncate(str: string, maxWidth: number): string {
  const plain = stripAnsi(str)
  if (plain.length <= maxWidth) return str

  let visibleLen = 0
  let result = ''
  let inEsc = false

  for (let i = 0; i < str.length; i++) {
    const ch = str[i]
    if (ch === '\x1b') {
      inEsc = true
      result += ch
      continue
    }
    if (inEsc) {
      result += ch
      if (ch === 'm') inEsc = false
      continue
    }
    if (visibleLen >= maxWidth) break
    result += ch
    visibleLen++
  }

  return result
}

interface Panel {
  name: string
  color: (s: string) => string
  lines: string[]
  row: number
  col: number
  width: number
  height: number
}

interface ChildHandle {
  stdin: Writable | null
  kill: (signal?: NodeJS.Signals) => void
}

export class DevTui {
  private panels: Panel[] = []
  private panelStates: { viteReady: boolean }[] = []
  private gridCols = 1
  private gridRows = 1
  private termW = 80
  private termH = 24
  private destroyed = false
  private focusedIndex = 0
  private children: ChildHandle[] = []

  constructor(private browsers: string[]) {
    this.termW = process.stdout.columns || 80
    this.termH = process.stdout.rows || 24
    this.panelStates = browsers.map(() => ({ viteReady: false }))
    this.computeGrid()
    this.createPanels()
  }

  private computeGrid() {
    const n = this.browsers.length
    if (n <= 1) {
      this.gridCols = 1
      this.gridRows = 1
    } else if (n <= 2) {
      this.gridCols = 2
      this.gridRows = 1
    } else if (n <= 4) {
      this.gridCols = 2
      this.gridRows = Math.ceil(n / 2)
    } else {
      this.gridCols = 3
      this.gridRows = Math.ceil(n / 3)
    }
  }

  private get panelAreaHeight() {
    return this.termH - 2
  }

  private createPanels() {
    const cellW = Math.floor(this.termW / this.gridCols)
    const cellH = Math.floor(this.panelAreaHeight / this.gridRows)

    this.panels = this.browsers.map((name, i) => {
      const gridRow = Math.floor(i / this.gridCols)
      const gridCol = i % this.gridCols
      const isLastCol = gridCol === this.gridCols - 1
      const isLastRow = gridRow === this.gridRows - 1

      return {
        name,
        color: browserColorFns[i % browserColorFns.length],
        lines: [],
        col: gridCol * cellW + 1,
        row: gridRow * cellH + 1,
        width: isLastCol ? this.termW - gridCol * cellW : cellW,
        height: isLastRow ? this.panelAreaHeight - gridRow * cellH : cellH,
      }
    })
  }

  registerChild(index: number, handle: ChildHandle) {
    this.children[index] = handle
  }

  start() {
    process.stdout.write(ansi.alternateScreen + ansi.hideCursor)
    process.on('SIGWINCH', this.onResize)

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(true)
      process.stdin.resume()
      process.stdin.on('data', this.onKeypress)
    }

    this.drawAll()
    this.drawStatusBar()
  }

  destroy() {
    if (this.destroyed) return
    this.destroyed = true

    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false)
      process.stdin.removeListener('data', this.onKeypress)
      process.stdin.pause()
    }

    process.stdout.write(ansi.showCursor + ansi.mainScreen)
    process.off('SIGWINCH', this.onResize)
  }

  private onKeypress = (data: Buffer) => {
    const key = data.toString()

    if (key === '\x03') {
      for (const child of this.children) {
        child?.kill('SIGTERM')
      }
      return
    }

    if (key === '\t') {
      this.setFocus((this.focusedIndex + 1) % this.panels.length)
      return
    }

    if (key === `${ESC}[Z`) {
      this.setFocus(
        (this.focusedIndex - 1 + this.panels.length) % this.panels.length,
      )
      return
    }

    const num = parseInt(key, 10)
    if (num >= 1 && num <= this.panels.length) {
      this.setFocus(num - 1)
      return
    }

    const child = this.children[this.focusedIndex]
    if (child?.stdin?.writable) {
      if (data.length === 1 && data[0] >= 0x20 && data[0] < 0x7f) {
        child.stdin.write(data.toString() + '\n')
      } else {
        child.stdin.write(data)
      }
    }
  }

  private setFocus(index: number) {
    const prev = this.focusedIndex
    this.focusedIndex = index
    this.drawPanelFrame(prev)
    this.drawPanelFrame(index)
    this.drawStatusBar()
  }

  private onResize = () => {
    this.termW = process.stdout.columns || 80
    this.termH = process.stdout.rows || 24
    this.computeGrid()

    const oldLines = this.panels.map((p) => p.lines)
    this.createPanels()
    this.panels.forEach((p, i) => {
      p.lines = oldLines[i] ?? []
    })
    this.drawAll()
    this.drawStatusBar()
  }

  appendLine(browserIndex: number, line: string) {
    if (this.destroyed) return
    const panel = this.panels[browserIndex]
    if (!panel) return

    const state = this.panelStates[browserIndex]
    const lines = line.split('\n')
    for (const l of lines) {
      if (isNoiseLine(l, state)) continue
      panel.lines.push(l)
    }

    const contentH = panel.height - 2
    if (panel.lines.length > 500) {
      panel.lines = panel.lines.slice(-contentH)
    }

    this.drawPanelContent(browserIndex)
  }

  private drawAll() {
    if (this.destroyed) return
    let buf = ''
    for (let row = 1; row <= this.termH; row++) {
      buf += ansi.moveTo(row, 1) + ansi.clearLine + ' '.repeat(this.termW)
    }
    process.stdout.write(buf)

    for (let i = 0; i < this.panels.length; i++) {
      this.drawPanelFrame(i)
      this.drawPanelContent(i)
    }
  }

  private drawPanelFrame(index: number) {
    if (this.destroyed) return
    const p = this.panels[index]
    const focused = index === this.focusedIndex
    const innerW = p.width - 2
    let buf = ''

    const box = focused
      ? {
          tl: BOX.tlBold,
          tr: BOX.trBold,
          bl: BOX.blBold,
          br: BOX.brBold,
          h: BOX.hBold,
          v: BOX.vBold,
        }
      : { tl: BOX.tl, tr: BOX.tr, bl: BOX.bl, br: BOX.br, h: BOX.h, v: BOX.v }

    const label = ` ${index + 1}:${p.name} `
    const padLen = Math.max(0, innerW - label.length)
    const leftPad = Math.floor(padLen / 2)
    const rightPad = padLen - leftPad

    const styleLine = focused ? (s: string) => p.color(s) : dim
    const styleTitle = focused
      ? (s: string) => bold(p.color(s))
      : (s: string) => p.color(s)

    buf += ansi.moveTo(p.row, p.col)
    buf += styleLine(box.tl)
    buf += styleLine(box.h.repeat(leftPad))
    buf += styleTitle(label)
    buf += styleLine(box.h.repeat(rightPad))
    buf += styleLine(box.tr)

    for (let r = 1; r < p.height - 1; r++) {
      buf += ansi.moveTo(p.row + r, p.col) + styleLine(box.v)
      buf += ansi.moveTo(p.row + r, p.col + p.width - 1) + styleLine(box.v)
    }

    buf += ansi.moveTo(p.row + p.height - 1, p.col)
    buf += styleLine(box.bl + box.h.repeat(innerW) + box.br)

    process.stdout.write(buf)
  }

  private drawPanelContent(index: number) {
    if (this.destroyed) return
    const p = this.panels[index]
    const contentH = p.height - 2
    const contentW = p.width - 2

    const visibleLines = p.lines.slice(-contentH)
    let buf = ''

    for (let r = 0; r < contentH; r++) {
      buf += ansi.moveTo(p.row + 1 + r, p.col + 1)
      if (r < visibleLines.length) {
        const line = truncate(visibleLines[r], contentW)
        const plainLen = stripAnsi(line).length
        buf += line + ' '.repeat(Math.max(0, contentW - plainLen))
      } else {
        buf += ' '.repeat(contentW)
      }
    }

    process.stdout.write(buf)
  }

  private drawStatusBar() {
    if (this.destroyed) return
    const p = this.panels[this.focusedIndex]
    const hint = dim(
      `  tab: switch panel · 1-${this.panels.length}: jump · keys → ${p?.name ?? '?'} · ctrl+c: quit`,
    )
    const bar = ansi.moveTo(this.termH, 1) + ansi.clearLine + hint
    process.stdout.write(bar)
  }
}
