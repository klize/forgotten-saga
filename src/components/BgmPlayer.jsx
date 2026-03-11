import { useState, useRef, useEffect } from 'react'

export default function BgmPlayer() {
  const audioRef = useRef(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const startedRef = useRef(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.volume = 0.15
    audio.loop = true

    const startOnClick = () => {
      if (startedRef.current) return
      startedRef.current = true
      audio.play().then(() => setIsPlaying(true)).catch(() => {})
      document.removeEventListener('click', startOnClick)
      document.removeEventListener('keydown', startOnClick)
      document.removeEventListener('touchstart', startOnClick)
    }
    document.addEventListener('click', startOnClick)
    document.addEventListener('keydown', startOnClick)
    document.addEventListener('touchstart', startOnClick)
    return () => {
      document.removeEventListener('click', startOnClick)
      document.removeEventListener('keydown', startOnClick)
      document.removeEventListener('touchstart', startOnClick)
    }
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
        onClick={toggle}
        className="w-10 h-10 flex items-center justify-center bg-[rgba(0,0,0,0.5)] backdrop-blur-sm border border-gold-dark/50 rounded-full text-lg hover:border-gold hover:bg-[rgba(0,0,0,0.7)] transition-all cursor-pointer"
        title={isPlaying ? 'BGM 끄기' : 'BGM 켜기'}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  )
}
