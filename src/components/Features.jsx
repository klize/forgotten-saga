import GameBox from './GameBox'

const FEATURES = [
  {
    title: '전투 시스템 확장',
    description: '창 관통 공격, 크리티컬 마법 시스템, 원소 속성 데미지, 홀리 실드 등 전투의 깊이를 더합니다.',
  },
  {
    title: '매력 마법 (Charm)',
    description: '적 유닛을 아군으로 전환하는 매력 마법을 새롭게 구현했습니다.',
  },
  {
    title: '미니맵 오버레이',
    description: 'M키로 토글하는 미니맵 오버레이. 현재 맵과 플레이어 위치를 실시간으로 표시합니다.',
  },
  {
    title: '스탯 오버레이',
    description: '캐릭터의 상세 능력치를 인게임에서 바로 확인할 수 있습니다.',
  },
  {
    title: '이벤트 오버레이',
    description: 'E키로 현재 맵의 이벤트 목록을 확인. 퀘스트 진행 상황을 놓치지 마세요.',
  },
  {
    title: '풀스크린 스케일러',
    description: '고해상도 모니터에서도 게임을 풀스크린으로 즐길 수 있는 DPI 인식 스케일러.',
  },
  {
    title: '이펙트 패치',
    description: '원소 속성별 시각 효과를 추가하여 전투를 더욱 역동적으로 만듭니다.',
  },
  {
    title: 'FSAGA Loader',
    description: '간편한 원클릭 실행. 자동 업데이트 확인으로 항상 최신 버전을 유지합니다.',
  },
]

export default function Features() {
  return (
    <div className="grid grid-cols-2 gap-5">
      {FEATURES.map((feature) => (
        <GameBox
          key={feature.title}
          className="p-6 hover:shadow-[0_0_16px_rgba(200,168,78,0.1)] transition-all duration-200"
        >
          <h3 className="text-gold text-base font-semibold mb-3">{feature.title}</h3>
          <p className="text-white/50 text-sm leading-loose">{feature.description}</p>
        </GameBox>
      ))}
    </div>
  )
}
