import { useState } from 'react'
import GameBox from './GameBox'

const PATCH_NOTES = [
  {
    version: '26.3.10',
    date: '2026-03-10',
    changes: [
      'Loader에 현재 버전 표시 + 최신 버전 안내',
      '자동 배포 시스템 구축 + Loader 업데이트 체크',
      'fullscreen_scaler DPI awareness 추가 + SetWindowPos 반환값 버그 수정',
    ],
  },
  {
    version: '26.2',
    date: '2026-02',
    changes: [
      'GPL 라이선스 xBRZ 필터 코드 제거',
      'fullscreen_scaler 창모드 강제 활성화 수정',
      '풀스크린 스케일러 종합 리팩토링',
    ],
  },
  {
    version: '26.1',
    date: '2026-01',
    changes: [
      '매력(Charm) 마법 구현 — 적 유닛을 아군으로 전환',
      '이벤트 오버레이 시스템 구현 (E키 토글)',
      '맵 오버레이 미니맵 기능 (M키 토글)',
      '스탯 오버레이 캐릭터 정보 표시',
    ],
  },
  {
    version: '25.12',
    date: '2025-12',
    changes: [
      '근접 크리티컬 마법 시스템 구현',
      '창 관통 (Spear Piercing) 공격 로직',
      '원소 속성 데미지 시스템',
      '홀리 실드 마법 효과',
      '이펙트 패치 — 원소 시각 효과',
    ],
  },
]

export default function PatchNotes({ releaseInfo }) {
  const [openVersions, setOpenVersions] = useState(() =>
    new Set([PATCH_NOTES[0]?.version])
  )

  const toggle = (version) => {
    setOpenVersions((prev) => {
      const next = new Set(prev)
      if (next.has(version)) next.delete(version)
      else next.add(version)
      return next
    })
  }

  return (
    <div className="space-y-4">
      {PATCH_NOTES.map((note) => {
        const isOpen = openVersions.has(note.version)
        return (
          <GameBox key={note.version}>
            <button
              onClick={() => toggle(note.version)}
              className="w-full flex items-center gap-4 pl-8 pr-6 py-4 hover:bg-white/5 transition-colors cursor-pointer"
            >
              <span
                className="text-gold-dark/50 text-sm transition-transform duration-200"
                style={{ transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}
              >
                ▶
              </span>
              <span className="text-gold font-semibold text-lg">v{note.version}</span>
              <span className="text-gold-dark/60 text-base">{note.date}</span>
              {releaseInfo?.version?.startsWith(note.version) && (
                <span className="px-3 py-0.5 bg-gold-dark/20 border border-gold-dark/30 rounded-full text-xs text-gold-dark leading-tight">latest</span>
              )}
              <span className="ml-auto text-gold-dark/30 text-sm">{note.changes.length}건</span>
            </button>
            {isOpen && (
              <ul className="space-y-3 pt-3 pb-6 pr-8 pl-14 border-t border-gold-dark/20">
                {note.changes.map((change, i) => (
                  <li key={i} className="text-white/60 text-base leading-loose pl-2">
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
