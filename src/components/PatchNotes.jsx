import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import GameBox from './GameBox'
import Overlay from './Overlay'

export default function PatchNotes({ releaseInfo }) {
  const [notes, setNotes] = useState([])
  const [selectedNote, setSelectedNote] = useState(null)
  const [mdContent, setMdContent] = useState('')

  useEffect(() => {
    fetch('./patch-notes.json')
      .then(r => r.json())
      .then(data => setNotes(data))
      .catch(() => {})
  }, [])

  const openNote = (note) => {
    setSelectedNote(note)
    fetch(`./patch-notes/${note.file}`)
      .then(r => r.text())
      .then(text => setMdContent(text))
      .catch(() => setMdContent('패치노트를 불러올 수 없습니다.'))
  }

  const closeNote = () => {
    setSelectedNote(null)
    setMdContent('')
  }

  if (notes.length === 0) {
    return <p className="text-white/40 text-center py-8">패치노트를 불러오는 중...</p>
  }

  return (
    <>
      <div className="space-y-4 max-h-[50vh] overflow-y-auto">
        {notes.map((note) => (
          <GameBox key={note.version}>
            <button
              onClick={() => openNote(note)}
              className="group w-full flex items-center gap-4 pl-8 pr-6 py-4 transition-colors cursor-pointer"
            >
              <span className="text-white font-semibold text-lg group-hover:text-hi transition-colors">v{note.version}</span>
              <span className="text-white text-base group-hover:text-hi transition-colors">{note.date}</span>
              {releaseInfo?.version === note.version && (
                <span className="px-3 py-0.5 bg-gold-dark/20 border border-gold-dark/30 rounded-full text-xs text-gold-dark leading-tight">latest</span>
              )}
            </button>
          </GameBox>
        ))}
      </div>

      <Overlay isOpen={!!selectedNote} onClose={closeNote} title={selectedNote?.title || ''}>
        <div className="markdown-body">
          <ReactMarkdown>{mdContent}</ReactMarkdown>
        </div>
      </Overlay>
    </>
  )
}
