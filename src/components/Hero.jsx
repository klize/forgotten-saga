import GameBox from './GameBox'

const T = './assets/titles'

export default function Hero({ releaseInfo, onOpenOverlay }) {
  const version = releaseInfo?.version
  const downloadUrl = releaseInfo?.download_url

  return (
    <div className="w-full max-w-md text-center flex flex-col items-center gap-3">
      {/* Download Button */}
      {version ? (
        <GameBox className="w-full hover:shadow-[0_0_24px_rgba(200,168,78,0.2)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]">
          <a
            href={downloadUrl}
            className="block py-4 px-8 text-center"
          >
            <img
              src={`${T}/download.png`}
              alt="DOWNLOAD"
              className="inline-block h-4 mb-1"
              style={{ imageRendering: 'pixelated' }}
            />
            <span className="block font-bold text-lg text-gold">v{version}</span>
          </a>
        </GameBox>
      ) : (
        <p className="text-white/50">릴리스 정보를 불러오는 중...</p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 justify-center w-full">
        <NavButton onClick={() => onOpenOverlay('patchnotes')} img="patch_notes" alt="패치노트" />
        <NavButton onClick={() => onOpenOverlay('features')} img="features" alt="기능 소개" />
        <NavButton onClick={() => onOpenOverlay('install')} img="install" alt="설치 가이드" />
      </div>
    </div>
  )
}

function NavButton({ onClick, img, alt }) {
  return (
    <GameBox
      scale={1}
      className="flex-1 cursor-pointer hover:shadow-[0_0_16px_rgba(200,168,78,0.15)] transition-all duration-200"
      onClick={onClick}
    >
      <button className="w-full py-3.5 px-5 flex items-center justify-center cursor-pointer">
        <img
          src={`${T}/${img}.png`}
          alt={alt}
          className="h-4"
          style={{ imageRendering: 'pixelated' }}
        />
      </button>
    </GameBox>
  )
}
