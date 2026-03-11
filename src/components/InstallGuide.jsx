import GameBox from './GameBox'

const STEPS = [
  {
    step: 1,
    title: '다운로드',
    description: '위의 다운로드 버튼을 클릭하거나, GitHub Releases 페이지에서 최신 ZIP 파일을 받습니다.',
  },
  {
    step: 2,
    title: '압축 해제',
    description: 'ZIP 파일의 내용물을 포가튼사가 게임 폴더에 압축을 풀어 덮어씌웁니다.',
  },
  {
    step: 3,
    title: 'Loader 실행',
    description: '게임 폴더의 FSAGA_Loader.exe를 실행합니다. Loader가 자동으로 모드를 적용하고 게임을 시작합니다.',
  },
]

const NOTES = [
  '원본 게임 파일은 자동으로 백업되지 않습니다. 필요시 미리 백업해 두세요.',
  'Windows Defender가 DLL 파일을 차단할 수 있습니다. 게임 폴더를 예외에 추가해 주세요.',
  '문제가 발생하면 GitHub Issues에 보고해 주세요.',
]

export default function InstallGuide() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        {STEPS.map(({ step, title, description }) => (
          <div key={step} className="flex gap-5">
            <div className="shrink-0 w-10 h-10 border border-gold-dark/50 text-gold-dark rounded-full flex items-center justify-center font-bold text-base">
              {step}
            </div>
            <div>
              <h3 className="text-gold text-base font-semibold mb-2">{title}</h3>
              <p className="text-white/60 text-base leading-loose">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <GameBox className="p-6">
        <h3 className="text-gold-dark text-sm font-semibold uppercase tracking-wider mb-5">참고사항</h3>
        <ul className="space-y-4">
          {NOTES.map((note, i) => (
            <li key={i} className="text-white/50 text-sm leading-relaxed relative pl-4 before:content-['·'] before:absolute before:left-0 before:text-gold-dark/50">
              {note}
            </li>
          ))}
        </ul>
      </GameBox>
    </div>
  )
}
