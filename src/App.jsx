import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Overlay from './components/Overlay'
import PatchNotes from './components/PatchNotes'
import Features from './components/Features'
import InstallGuide from './components/InstallGuide'
import BgmPlayer from './components/BgmPlayer'

export default function App() {
  const [releaseInfo, setReleaseInfo] = useState(null)
  const [activeOverlay, setActiveOverlay] = useState(null)

  useEffect(() => {
    fetch('./release-info.json')
      .then(r => r.json())
      .then(data => {
        if (data.version && data.version !== '0.0.0') {
          setReleaseInfo(data)
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setActiveOverlay(null)
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  return (
    <div className="relative min-h-screen">
      {/* Background: blurred cover layer fills edges, sharp contain layer on top */}
      <div className="fixed inset-0 bg-dark-bg">
        <div
          className="absolute inset-[-20px] bg-cover bg-center blur-xl scale-110"
          style={{ backgroundImage: `url('./assets/logo/main_bg_1.webp')` }}
        />
        <div
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: `url('./assets/logo/main_bg_1.webp')` }}
        />
      </div>
      {/* Subtle vignette */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,16,32,0)_0%,rgba(18,16,32,0.1)_100%)]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <Hero
          releaseInfo={releaseInfo}
          onOpenOverlay={setActiveOverlay}
        />
        <BgmPlayer />
      </div>

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-muted text-sm">
        <p>Phantagram &middot; FSAGA Extension Mod</p>
      </footer>

      {/* Overlays */}
      <Overlay
        isOpen={activeOverlay === 'patchnotes'}
        onClose={() => setActiveOverlay(null)}
        title="패치노트"
      >
        <PatchNotes releaseInfo={releaseInfo} />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'features'}
        onClose={() => setActiveOverlay(null)}
        title="모드 기능"
      >
        <Features />
      </Overlay>

      <Overlay
        isOpen={activeOverlay === 'install'}
        onClose={() => setActiveOverlay(null)}
        title="설치 가이드"
      >
        <InstallGuide />
      </Overlay>
    </div>
  )
}
