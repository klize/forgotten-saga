import { useState, useEffect } from 'react'
import GameBox from './GameBox'
import { RichText } from './RichText'

export default function InstallGuide() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch('./install-guide.json')
      .then(r => r.json())
      .then(setData)
      .catch(() => {})
  }, [])

  if (!data) {
    return <p className="text-white/40 text-center py-8">설치 가이드를 불러오는 중...</p>
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        {data.steps.map(({ step, title, description }) => (
          <div key={step} className="flex gap-5">
            <div className="shrink-0 w-10 h-10 border border-white/30 text-white rounded-full flex items-center justify-center font-bold text-base">
              {step}
            </div>
            <div>
              <h3 className="text-white text-base font-semibold mb-2">{title}</h3>
              <p className="text-white text-base leading-loose"><RichText text={description} /></p>
            </div>
          </div>
        ))}
      </div>

      <GameBox className="p-6">
        <h3 className="text-white text-sm font-semibold uppercase tracking-wider mb-5">참고사항</h3>
        <ul className="space-y-4">
          {data.notes.map((note, i) => (
            <li key={i} className="text-white text-sm leading-relaxed relative pl-4 before:content-['·'] before:absolute before:left-0 before:text-white/60">
              <RichText text={note} />
            </li>
          ))}
        </ul>
      </GameBox>
    </div>
  )
}
