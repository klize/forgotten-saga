import GameBox from './GameBox'

const T = './assets/titles'

function TitleIcon({ src, w, h = 16, className = '' }) {
  return (
    <div
      className={`title-icon ${className}`}
      style={{
        width: w,
        height: h,
        WebkitMaskImage: `url('${src}')`,
        maskImage: `url('${src}')`,
      }}
    />
  )
}

export default function Hero({ releaseInfo, onOpenOverlay }) {
  const version = releaseInfo?.version
  const downloadUrl = releaseInfo?.download_url

  return (
    <div className="w-full max-w-md text-center flex flex-col items-center gap-3">
      {/* Download Button */}
      {version ? (
        <GameBox className="group w-full transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <a
            href={downloadUrl}
            className="block py-4 px-8 text-center"
          >
            <TitleIcon src={`${T}/download.png`} w={71} className="mx-auto mb-1" />
            <span className="block font-bold text-lg text-white group-hover:text-hi transition-colors">v{version}</span>
          </a>
        </GameBox>
      ) : (
        <p className="text-white/50">릴리스 정보를 불러오는 중...</p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-center w-full">
        <NavButton onClick={() => onOpenOverlay('patchnotes')} img="patch_notes" w={67} alt="패치노트" />
        <NavButton onClick={() => onOpenOverlay('features')} img="features" w={76} alt="기능 소개" />
        <NavButton onClick={() => onOpenOverlay('install')} img="install" w={93} alt="설치 가이드" />
      </div>
    </div>
  )
}

function NavButton({ onClick, img, w, alt }) {
  return (
    <GameBox
      scale={1}
      className="group flex-1 cursor-pointer transition-all duration-200"
      onClick={onClick}
    >
      <button className="w-full py-3.5 px-5 flex items-center justify-center cursor-pointer" title={alt}>
        <TitleIcon src={`${T}/${img}.png`} w={w} />
      </button>
    </GameBox>
  )
}
