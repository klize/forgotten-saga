import { useState, useRef, useEffect } from 'react'

export default function BgmPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const btnRef = useRef(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.15
    audio.loop = true
  }, [])

  // Auto-start on first user interaction anywhere on the page
  // (except the BGM button itself — that's handled by toggle)
  useEffect(() => {
    let started = false
    const start = (e) => {
      if (started) return
      if (btnRef.current && btnRef.current.contains(e.target)) return
      const audio = audioRef.current
      if (!audio) return
      started = true
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
      cleanup()
    }
    const cleanup = () => {
      document.removeEventListener('click', start, true)
      document.removeEventListener('keydown', start, true)
    }
    document.addEventListener('click', start, true)
    document.addEventListener('keydown', start, true)
    return cleanup
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <audio ref={audioRef} src="./assets/bgm.mp3" preload="auto" />
      <button
        ref={btnRef}
        onClick={toggle}
        className="w-10 h-10 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border border-white/30 rounded-full text-lg hover:border-white/60 hover:bg-white/10 transition-all cursor-pointer"
        title={isPlaying ? 'BGM 끄기' : 'BGM 켜기'}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
