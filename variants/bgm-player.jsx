// Background music player — ported from forgotten-saga/src/components/BgmPlayer.jsx
function BgmPlayer() {
  const audioRef = React.useRef(null);
  const btnRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  React.useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.15;
    audio.loop = true;
  }, []);

  React.useEffect(() => {
    let started = false;
    const start = (e) => {
      if (started) return;
      if (btnRef.current && btnRef.current.contains(e.target)) return;
      const audio = audioRef.current;
      if (!audio) return;
      started = true;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      cleanup();
    };
    const cleanup = () => {
      document.removeEventListener('click', start, true);
      document.removeEventListener('keydown', start, true);
    };
    document.addEventListener('click', start, true);
    document.addEventListener('keydown', start, true);
    return cleanup;
  }, []);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 40 }}>
      <audio ref={audioRef} src="assets/bgm.mp3" preload="auto" />
      <button
        ref={btnRef}
        onClick={toggle}
        title={isPlaying ? 'BGM 끄기' : 'BGM 켜기'}
        style={{
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.3)', borderRadius: '50%',
          fontSize: 18, cursor: 'pointer', color: 'white',
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
          e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
        }}
      >
        {isPlaying ? '🔊' : '🔇'}
      </button>
    </div>
  );
}

window.BgmPlayer = BgmPlayer;
