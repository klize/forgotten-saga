import fs from 'fs'
import path from 'path'

/**
 * Vite plugin: public/patch-notes/*.md 파일을 스캔하여
 * public/patch-notes.json을 자동 생성한다.
 *
 * md 파일 형식:
 *   # v26.3.16.2206
 *   **2026-03-16**
 *   ...
 */
export default function patchNotesPlugin() {
  const dir = 'public/patch-notes'
  const outFile = 'public/patch-notes.json'

  function generate() {
    if (!fs.existsSync(dir)) return

    const files = fs.readdirSync(dir).filter(f => f.endsWith('.md')).sort()
    const notes = []

    for (const file of files) {
      const content = fs.readFileSync(path.join(dir, file), 'utf-8')
      const lines = content.split('\n')

      // # v26.3.16.2206 → version = "26.3.16.2206"
      const h1 = lines.find(l => l.startsWith('# '))
      const version = h1 ? h1.replace(/^#\s*v?/, '').trim() : file.replace(/\.md$/, '').replace(/^v/, '')

      // **2026-03-16** → date = "2026-03-16"
      const dateLine = lines.find(l => /^\*\*\d{4}/.test(l))
      const date = dateLine ? dateLine.replace(/\*\*/g, '').trim() : ''

      notes.push({
        version,
        date,
        title: `v${version}`,
        file,
      })
    }

    // 버전 내림차순 정렬 (숫자 부분 비교)
    notes.sort((a, b) => {
      const pa = a.version.split('.').map(Number)
      const pb = b.version.split('.').map(Number)
      for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const diff = (pb[i] || 0) - (pa[i] || 0)
        if (diff !== 0) return diff
      }
      return 0
    })

    fs.writeFileSync(outFile, JSON.stringify(notes, null, 2) + '\n')
    console.log(`[patch-notes] Generated ${notes.length} entries → ${outFile}`)
  }

  return {
    name: 'patch-notes',
    buildStart() {
      generate()
    },
    configureServer(server) {
      // dev 서버 시작 시 생성
      generate()
      // md 파일 변경 감시
      server.watcher.add(path.resolve(dir))
      server.watcher.on('change', (file) => {
        if (file.includes('patch-notes') && file.endsWith('.md')) generate()
      })
      server.watcher.on('add', (file) => {
        if (file.includes('patch-notes') && file.endsWith('.md')) generate()
      })
      server.watcher.on('unlink', (file) => {
        if (file.includes('patch-notes') && file.endsWith('.md')) generate()
      })
    },
  }
}
