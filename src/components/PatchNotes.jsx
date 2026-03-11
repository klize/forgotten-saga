import { useState, useEffect } from 'react'
import GameBox from './GameBox'

export default function PatchNotes({ releaseInfo }) {
  const [notes, setNotes] = useState([])
  const [openVersions, setOpenVersions] = useState(new Set())

  useEffect(() => {
    fetch('./patch-notes.json')
      .then(r => r.json())
      .then(data => {
        setNotes(data)
        if (data.length > 0) {
          setOpenVersions(new Set([data[0].version]))
        }
      })
      .catch(() => {})
  }, [])

  const toggle = (version) => {
    setOpenVersions((prev) => {
      const next = new Set(prev)
      if (next.has(version)) next.delete(version)
      else next.add(version)
      return next
    })
  }

  if (notes.length === 0) {
    return <p className="text-white/40 text-center py-8">패치노트를 불러오는 중...</p>
  }

  return (
    <div className="space-y-4">
      {notes.map((note) => {
        const isOpen = openVersions.has(note.version)
        return (
          <GameBox key={note.version}>
            <button
              onClick={() => toggle(note.version)}
              className="group w-full flex items-center gap-4 pl-8 pr-6 py-4 transition-colors cursor-pointer"
            >
              <span
                className="text-white/30 text-sm transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ▶
              </span>
              <span className="text-white font-semibold text-lg group-hover:text-hi transition-colors">v{note.version}</span>
              <span className="text-white text-base group-hover:text-hi transition-colors">{note.date}</span>
              {releaseInfo?.version === note.version && (
                <span className="px-3 py-0.5 bg-gold-dark/20 border border-gold-dark/30 rounded-full text-xs text-gold-dark leading-tight">latest</span>
              )}
              <span className="ml-auto text-white text-sm">{note.changes.length}건</span>
            </button>
            {isOpen && (
              <ul className="space-y-3 pt-3 pb-6 pr-8 pl-14 border-t border-white/10">
                {note.changes.map((change, i) => (
                  <li key={i} className="text-white text-base leading-loose pl-2">
                    {change}
                  </li>
                ))}
              </ul>
            )}
          </GameBox>
        )
      })}
    </div>
  )
}
