import { useState, useEffect } from 'react'
import GameBox from './GameBox'
import { RichText } from './RichText'

export default function Features() {
  const [features, setFeatures] = useState([])
  const [openCards, setOpenCards] = useState(new Set())

  useEffect(() => {
    fetch('./features.json')
      .then(r => r.json())
      .then(setFeatures)
      .catch(() => {})
  }, [])

  const toggle = (title) => {
    setOpenCards((prev) => {
      const next = new Set(prev)
      if (next.has(title)) next.delete(title)
      else next.add(title)
      return next
    })
  }

  if (features.length === 0) {
    return <p className="text-white/40 text-center py-8">기능 목록을 불러오는 중...</p>
  }

  return (
    <div className="grid grid-cols-2 gap-5">
      {features.map((feature) => {
        const isOpen = openCards.has(feature.title)
        const hasDetail = feature.detail && feature.detail.length > 0
        return (
          <GameBox
            key={feature.title}
            className={`group p-6 transition-all duration-200 ${hasDetail ? 'cursor-pointer' : ''}`}
            onClick={hasDetail ? () => toggle(feature.title) : undefined}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className={`text-white text-base font-semibold mb-1 ${hasDetail ? 'group-hover:text-hi transition-colors' : ''}`}>{feature.title}</h3>
              {hasDetail && (
                <span
                  className="text-white/30 text-xs mt-1 transition-transform duration-200 shrink-0"
                  style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
                >
                  ▶
                </span>
              )}
            </div>
            {feature.subtitle && (
              <p className="text-white text-xs font-mono mb-3">{feature.subtitle}</p>
            )}
            <p className="text-white text-sm leading-loose">{feature.description}</p>
            {isOpen && (
              <ul className="mt-4 pt-3 border-t border-white/10 space-y-2">
                {feature.detail.map((item, i) => (
                  <li key={i} className="text-white text-sm leading-relaxed relative pl-4 before:content-['·'] before:absolute before:left-0 before:text-white/60">
                    <RichText text={item} />
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
