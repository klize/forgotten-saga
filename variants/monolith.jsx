// Variant B — Monolith
// 메인 + 3개 내부화면 (전체 교체형). 달빛 배경 유지, 얇은 선·큰 타이포·극단적 여백.

// Variant B — Monolith
// 메인 + 3개 내부화면 (전체 교체형). 달빛 배경 유지, 얇은 선·큰 타이포·극단적 여백.

// [label](url) 인라인 링크 파서
function MonolithRichText({ text }) {
  if (!text) return null;
  const parts = String(text).split(/(\[[^\]]+\]\([^)]+\))/);
  return parts.map((part, i) => {
    const m = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      return (
        <a
          key={i}
          href={m[2]}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--m-accent)',
            textDecoration: 'underline',
            textDecorationColor: 'var(--m-accent-soft)',
            textUnderlineOffset: 3,
          }}
          onMouseEnter={(e) => e.currentTarget.style.textDecorationColor = 'var(--m-accent)'}
          onMouseLeave={(e) => e.currentTarget.style.textDecorationColor = 'var(--m-accent-soft)'}
        >
          {m[1]}
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

// 9-slice gold frame — uses real wframe PNGs from forgotten-saga repo
// 0=TL, 5=TR, 6=BL, 7=BR corners (16x16); 1=top edge, 4=left, 3=right (16x3 / 3x16)
function GameFrame({ children, style, padding = 0, scale = 2 }) {
  const F = './assets/logo/wframe';
  const corner = 16 * scale;
  const edge = 3 * scale;
  const imgStyle = {
    position: 'absolute', pointerEvents: 'none',
    width: corner, height: corner,
    imageRendering: 'pixelated',
  };
  const edgeBase = { position: 'absolute', pointerEvents: 'none', imageRendering: 'pixelated' };
  return (
    <div style={{
      position: 'relative',
      background: 'rgba(0,0,0,0.88)',
      padding,
      ...style,
    }}>
      {/* Corners */}
      <img src={`${F}/0.png`} draggable={false} alt="" style={{ ...imgStyle, top: 0, left: 0 }} />
      <img src={`${F}/5.png`} draggable={false} alt="" style={{ ...imgStyle, top: 0, right: 0 }} />
      <img src={`${F}/6.png`} draggable={false} alt="" style={{ ...imgStyle, bottom: 0, left: 0 }} />
      <img src={`${F}/7.png`} draggable={false} alt="" style={{ ...imgStyle, bottom: 0, right: 0 }} />
      {/* Top edge */}
      <div style={{
        ...edgeBase, top: 0, left: corner, right: corner, height: edge,
        backgroundImage: `url('${F}/1.png')`,
        backgroundSize: `${corner}px ${edge}px`,
        backgroundRepeat: 'repeat-x',
      }} />
      {/* Bottom edge */}
      <div style={{
        ...edgeBase, bottom: 0, left: corner, right: corner, height: edge,
        backgroundImage: `url('${F}/1.png')`,
        backgroundSize: `${corner}px ${edge}px`,
        backgroundRepeat: 'repeat-x',
      }} />
      {/* Left edge */}
      <div style={{
        ...edgeBase, left: 0, top: corner, bottom: corner, width: edge,
        backgroundImage: `url('${F}/4.png')`,
        backgroundSize: `${edge}px ${corner}px`,
        backgroundRepeat: 'repeat-y',
      }} />
      {/* Right edge */}
      <div style={{
        ...edgeBase, right: 0, top: corner, bottom: corner, width: edge,
        backgroundImage: `url('${F}/3.png')`,
        backgroundSize: `${edge}px ${corner}px`,
        backgroundRepeat: 'repeat-y',
      }} />
      {children}
    </div>
  );
}

function MonolithVariant({ release, beta, theme = 'parchment-gold', betaPosition = 'inline-bar' }) {
  const [view, setView] = React.useState('home');

  // Theme palettes — applied as CSS vars on the root container
  const themes = {
    'parchment-gold': {
      '--m-bg': '#07060c',
      '--m-text': '#e6e1d4',
      '--m-text-bright': '#f4ecd3',
      '--m-accent': '#ffc332',
      '--m-accent-soft': 'rgba(255,195,50,0.6)',
      '--m-hairline': 'rgba(255,235,190,0.22)',
      '--m-hairline-strong': 'rgba(255,235,190,0.42)',
      '--m-menu-bg': 'rgba(7,6,12,0.55)',
      '--m-hover': '#a7bce6',
      '--m-grain-opacity': 0.25,
    },
    'inkblue-gold': {
      '--m-bg': '#070b1a',
      '--m-text': '#dde3f0',
      '--m-text-bright': '#f0f4ff',
      '--m-accent': '#f5c842',
      '--m-accent-soft': 'rgba(245,200,66,0.6)',
      '--m-hairline': 'rgba(180,200,255,0.22)',
      '--m-hairline-strong': 'rgba(180,200,255,0.45)',
      '--m-menu-bg': 'rgba(8,12,30,0.7)',
      '--m-hover': '#85b4ff',
      '--m-grain-opacity': 0.18,
    },
    'wine': {
      '--m-bg': '#0f0608',
      '--m-text': '#ecdcd4',
      '--m-text-bright': '#fff1e3',
      '--m-accent': '#d4a93a',
      '--m-accent-soft': 'rgba(212,169,58,0.6)',
      '--m-hairline': 'rgba(220,140,140,0.22)',
      '--m-hairline-strong': 'rgba(220,140,140,0.45)',
      '--m-menu-bg': 'rgba(28,8,12,0.7)',
      '--m-hover': '#e88a8a',
      '--m-grain-opacity': 0.22,
    },
    'silver': {
      '--m-bg': '#08090d',
      '--m-text': '#d8dde6',
      '--m-text-bright': '#f1f3f8',
      '--m-accent': '#c9d6e8',
      '--m-accent-soft': 'rgba(201,214,232,0.6)',
      '--m-hairline': 'rgba(220,228,240,0.22)',
      '--m-hairline-strong': 'rgba(220,228,240,0.45)',
      '--m-menu-bg': 'rgba(10,12,18,0.7)',
      '--m-hover': '#a8c4f0',
      '--m-grain-opacity': 0.2,
    },
    'solid-card': {
      '--m-bg': '#07060c',
      '--m-text': '#e6e1d4',
      '--m-text-bright': '#f4ecd3',
      '--m-accent': '#ffc332',
      '--m-accent-soft': 'rgba(255,195,50,0.6)',
      '--m-hairline': 'rgba(255,235,190,0.32)',
      '--m-hairline-strong': '#ffc332',
      '--m-menu-bg': 'rgba(0,0,0,0.92)',
      '--m-hover': '#a7bce6',
      '--m-grain-opacity': 0.25,
    },
    'game-ui': {
      '--m-bg': '#050309',
      '--m-text': '#ede4cf',
      '--m-text-bright': '#fff4d0',
      '--m-accent': '#e8c468',
      '--m-accent-soft': 'rgba(232,196,104,0.7)',
      '--m-hairline': 'rgba(232,196,104,0.55)',
      '--m-hairline-strong': '#e8c468',
      '--m-menu-bg': 'rgba(0,0,0,0.88)',
      '--m-hover': '#ffe9a8',
      '--m-grain-opacity': 0.22,
    },
  };
  const isGameUI = theme === 'game-ui';
  const themeVars = themes[theme] || themes['parchment-gold'];

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'var(--m-bg)',
      color: 'var(--m-text)',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", "Apple SD Gothic Neo", "Noto Sans KR", sans-serif',
      overflow: 'hidden',
      ...themeVars,
    }}>
      {/* BG */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url('./assets/logo/main_bg_3.webp')",
        backgroundSize: 'cover', backgroundPosition: 'center 30%',
        filter: view === 'home' ? 'saturate(1) brightness(1)' : 'saturate(0.6) brightness(0.45) blur(2px)',
        transition: 'filter 400ms',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: view === 'home'
          ? 'radial-gradient(ellipse at center, rgba(7,6,12,0) 45%, rgba(7,6,12,0.35) 85%, rgba(7,6,12,0.78) 100%)'
          : 'linear-gradient(180deg, rgba(7,6,12,0.85), rgba(7,6,12,0.95))',
        transition: 'background 400ms',
      }} />
      {/* Grain */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.9' numOctaves='2'/%3E%3CfeColorMatrix values='0 0 0 0 0.95  0 0 0 0 0.9  0 0 0 0 0.78  0 0 0 0.08 0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")",
        mixBlendMode: 'overlay', opacity: 'var(--m-grain-opacity)',
      }} />

      {/* Persistent chrome */}
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        padding: '36px 64px',
      }}>
        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            {view !== 'home' && (
              <button onClick={() => setView('home')} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 13, letterSpacing: '0.28em', textTransform: 'uppercase',
                color: 'var(--m-text-bright)',
                transition: 'color 180ms',
                padding: 0,
              }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--m-hover)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--m-text-bright)'}
              >← Return</button>
            )}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            padding: '6px 14px',
            background: 'rgba(8,4,16,0.55)',
            backdropFilter: 'blur(10px) saturate(140%)',
            WebkitBackdropFilter: 'blur(10px) saturate(140%)',
            border: '1px solid rgba(255,225,160,0.18)',
            borderRadius: 2,
            boxShadow: '0 4px 16px rgba(0,0,0,0.35)',
          }}>
            {/* Top-bar beta badge slot */}
            {beta && betaPosition === 'topbar-badge' && (
              <a href={beta.download_url} style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 8,
                padding: '6px 12px',
                border: '1px solid var(--m-hairline-strong)',
                borderRadius: 2,
                color: 'var(--m-text-bright)', textDecoration: 'none',
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 11.5, letterSpacing: '0.22em', textTransform: 'uppercase',
                transition: 'background 200ms',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{ color: 'var(--m-accent)' }}>Beta</span>
                <span>v{beta.version}</span>
                <span style={{ opacity: 0.7 }}>↓</span>
              </a>
            )}
            {/* Section nav */}
            {[
              { id: 'patchnotes', label: 'Patch Notes' },
              { id: 'features', label: 'Features' },
              { id: 'install', label: 'Guide' },
            ].map(n => {
              const active = view === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => setView(n.id)}
                  style={{
                    background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px 14px',
                    fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                    fontSize: 11.5, letterSpacing: '0.22em', textTransform: 'uppercase',
                    color: active ? 'var(--m-accent)' : 'var(--m-text-bright)',
                    opacity: active ? 1 : 0.85,
                    textShadow: '0 1px 2px rgba(0,0,0,0.85)',
                    borderBottom: active ? '1px solid var(--m-accent)' : '1px solid transparent',
                    transition: 'color 180ms, opacity 180ms, border-color 180ms',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.opacity = '1'; e.currentTarget.style.color = 'var(--m-hover)'; } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.opacity = '0.85'; e.currentTarget.style.color = 'var(--m-text-bright)'; } }}
                >{n.label}</button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        {view === 'home' && <MonolithHome release={release} beta={beta} betaPosition={betaPosition} onNav={setView} theme={theme} />}
        {view === 'patchnotes' && <MonolithPatchNotes release={release} />}
        {view === 'features' && <MonolithFeatures />}
        {view === 'install' && <MonolithInstall />}

        {/* Footer */}
        <div style={{
          marginTop: 16,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 24,
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 11.5, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'var(--m-text)', opacity: 0.85,
        }}>
          <span style={{ opacity: 0.75 }}>© Phantagram · Sonnori</span>
          {beta && betaPosition === 'footer' && view === 'home' && (
            <a href={beta.download_url} style={{
              display: 'inline-flex', alignItems: 'baseline', gap: 10,
              color: 'var(--m-accent)', textDecoration: 'none',
              padding: '6px 14px',
              border: '1px solid var(--m-accent)',
              borderRadius: 2,
              fontWeight: 600,
              transition: 'background 200ms',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,195,50,0.12)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >Beta v{beta.version} <span style={{ opacity: 0.7 }}>↓</span></a>
          )}
          <span style={{ opacity: 0.6 }}>Illus. Kinosita Tomotake</span>
        </div>
      </div>
    </div>
  );
}

function MonolithHome({ release, beta, betaPosition, onNav, theme, view }) {
  const [hovered, setHovered] = React.useState(null);
  const [betaHover, setBetaHover] = React.useState(false);
  const isGameUI = theme === 'game-ui';

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 56,
      }}>
        <img
          src="./assets/logo/wordmark.png?v=12"
          alt="Forgotten Saga"
          style={{
            width: 'min(48vw, 560px)',
            maxHeight: '52vh',
            objectFit: 'contain',
            filter: 'drop-shadow(0 4px 24px rgba(0,0,0,0.6))',
            opacity: 1,
          }}
        />

        {/* Single Download card with optional beta sub */}
        <div style={{
          position: 'relative',
          background: isGameUI ? 'rgba(0,0,0,0.88)' : 'var(--m-menu-bg)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          padding: '22px 40px 18px',
          minWidth: 280,
        }}>
          {/* 9-slice gold frame */}
          <img src="./assets/logo/wframe/0.png" alt="" draggable={false} style={{ position: 'absolute', top: 0, left: 0, width: 32, height: 32, imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <img src="./assets/logo/wframe/5.png" alt="" draggable={false} style={{ position: 'absolute', top: 0, right: 0, width: 32, height: 32, imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <img src="./assets/logo/wframe/6.png" alt="" draggable={false} style={{ position: 'absolute', bottom: 0, left: 0, width: 32, height: 32, imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <img src="./assets/logo/wframe/7.png" alt="" draggable={false} style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, left: 32, right: 32, height: 6, backgroundImage: "url('./assets/logo/wframe/1.png')", backgroundSize: '32px 6px', backgroundRepeat: 'repeat-x', imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 32, right: 32, height: 6, backgroundImage: "url('./assets/logo/wframe/1.png')", backgroundSize: '32px 6px', backgroundRepeat: 'repeat-x', imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', left: 0, top: 32, bottom: 32, width: 6, backgroundImage: "url('./assets/logo/wframe/4.png')", backgroundSize: '6px 32px', backgroundRepeat: 'repeat-y', imageRendering: 'pixelated', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 0, top: 32, bottom: 32, width: 6, backgroundImage: "url('./assets/logo/wframe/3.png')", backgroundSize: '6px 32px', backgroundRepeat: 'repeat-y', imageRendering: 'pixelated', pointerEvents: 'none' }} />

          {/* Main download */}
          <a
            href={release?.download_url}
            onMouseEnter={() => setHovered('download')}
            onMouseLeave={() => setHovered(null)}
            style={{
              display: 'block', textAlign: 'center', textDecoration: 'none',
              color: hovered === 'download' && !betaHover ? 'var(--m-hover)' : 'var(--m-text-bright)',
              transition: 'color 200ms',
              padding: '6px 12px',
            }}
          >
            <div style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 11, letterSpacing: '0.32em', textTransform: 'uppercase',
              color: 'var(--m-accent)', marginBottom: 8,
            }}>Download</div>
            <div style={{
              fontSize: 24, letterSpacing: '0', fontWeight: 400, lineHeight: 1,
            }}>{release ? `v${release.version}` : '—'}</div>
          </a>

          {/* Beta sub */}
          {beta && (
            <div
              role="link"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = beta.download_url;
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  window.location.href = beta.download_url;
                }
              }}
              onMouseEnter={() => setBetaHover(true)}
              onMouseLeave={() => setBetaHover(false)}
              style={{
                display: 'block',
                marginTop: 14,
                marginInline: -8,
                paddingTop: 10,
                paddingBottom: 4,
                paddingInline: 8,
                borderTop: '1px dashed var(--m-hairline)',
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase',
                color: betaHover ? 'var(--m-text-bright)' : 'var(--m-text)',
                background: betaHover ? 'rgba(255,195,50,0.10)' : 'transparent',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'background 180ms, color 180ms',
                borderRadius: 2,
              }}
            >
              <span style={{ color: 'var(--m-accent-soft)' }}>Beta</span>{' '}v{beta.version}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MonolithSectionHeader({ eyebrow, title }) {
  return (
    <div style={{ margin: '48px 0 40px' }}>
      <div style={{
        fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
        fontSize: 13, letterSpacing: '0.32em', textTransform: 'uppercase',
        color: 'var(--m-accent)', marginBottom: 16,
      }}>{eyebrow}</div>
      <h2 style={{
        margin: 0, fontSize: 72, lineHeight: 0.92, fontWeight: 300,
        letterSpacing: '-0.025em', color: 'var(--m-text-bright)',
      }}>{title}</h2>
      <div style={{ width: 60, height: 1, background: 'var(--m-accent-soft)', marginTop: 20 }} />
    </div>
  );
}

function MonolithPatchNotes({ release }) {
  const notes = window.FSAGA_PATCH_NOTES || [];
  const [selected, setSelected] = React.useState(0);
  const [md, setMd] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const current = notes[selected];

  React.useEffect(() => {
    if (!current) return;
    setLoading(true);
    setMd('');
    fetch('./public/patch-notes/' + current.file)
      .then(r => r.ok ? r.text() : Promise.reject())
      .catch(() => fetch('./patch-notes/' + current.file).then(r => r.text()))
      .then(text => {
        // strip leading "# v..." and "**date**" lines — header is rendered in chrome
        const cleaned = text
          .replace(/^#\s+v[^\n]*\n+/i, '')
          .replace(/^\*\*[^\n]*\*\*\s*\n+/, '');
        setMd(cleaned);
      })
      .catch(() => setMd('패치노트를 불러올 수 없습니다.'))
      .finally(() => setLoading(false));
  }, [current?.file]);

  if (!current) {
    return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(230,225,212,0.5)' }}>로딩 중...</div>;
  }

  const isCurrent = release && release.version === current.version;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 56, overflow: 'hidden', minHeight: 0 }}>
      <div style={{ overflow: 'auto', paddingBottom: 16 }}>
        <div style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 12, letterSpacing: '0.3em', textTransform: 'uppercase',
          color: 'rgba(230,225,212,0.6)', marginBottom: 18,
        }}>Archive</div>
        <div style={{ borderTop: '1px solid rgba(255,235,190,0.18)' }}>
          {notes.map((n, i) => (
            <button key={n.version} onClick={() => setSelected(i)} style={{
              display: 'block', width: '100%', textAlign: 'left',
              background: 'transparent', border: 'none',
              padding: '14px 0', cursor: 'pointer', fontFamily: 'inherit',
              borderBottom: '1px solid rgba(255,235,190,0.1)',
              color: i === selected ? 'var(--m-text-bright)' : 'var(--m-text)',
              transition: 'color 150ms',
            }}
            onMouseEnter={e => { if (i !== selected) e.currentTarget.style.color = 'var(--m-hover)'; }}
            onMouseLeave={e => { if (i !== selected) e.currentTarget.style.color = 'var(--m-text)'; }}
            >
              <div style={{ fontSize: 16, letterSpacing: '-0.005em' }}>v{n.version}</div>
              <div style={{
                fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                fontSize: 12, letterSpacing: '0.14em',
                color: 'rgba(230,225,212,0.55)', marginTop: 4,
              }}>{n.date}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ overflow: 'auto', paddingRight: 8, paddingBottom: 24 }}>
        <div style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 13, letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--m-accent)', marginBottom: 12,
        }}>Patch Notes {isCurrent && '· Current'}</div>
        <h2 style={{ margin: 0, fontSize: 68, lineHeight: 0.9, fontWeight: 300, letterSpacing: '-0.025em', color: 'var(--m-text-bright)' }}>
          v{current.version}
        </h2>
        <div style={{
          marginTop: 10, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 13, letterSpacing: '0.22em',
          color: 'rgba(230,225,212,0.7)',
        }}>{current.date}</div>
        <div style={{ height: 1, background: 'rgba(255,195,50,0.3)', margin: '28px 0' }} />
        {loading ? (
          <div style={{ color: 'rgba(230,225,212,0.4)', fontSize: 13 }}>불러오는 중...</div>
        ) : (
          window.FsagaMarkdown ? <window.FsagaMarkdown source={md} /> : <pre style={{ whiteSpace: 'pre-wrap', color: 'rgba(230,225,212,0.7)', fontSize: 13 }}>{md}</pre>
        )}
      </div>
    </div>
  );
}

function MonolithFeatures() {
  return (
    <div style={{ overflow: 'auto', paddingRight: 8 }}>
      <MonolithSectionHeader eyebrow="05 Modules" title="Features" />
      {window.FSAGA_FEATURES.map((f, i) => (
        <div key={f.title} style={{
          display: 'grid', gridTemplateColumns: '80px 1fr 1.2fr',
          gap: 40, padding: '32px 0',
          borderTop: i === 0 ? '1px solid rgba(255,235,190,0.22)' : '1px solid rgba(255,235,190,0.1)',
        }}>
          <div style={{
            fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
            fontSize: 40, color: 'var(--m-accent)', fontWeight: 300,
            letterSpacing: '-0.02em', lineHeight: 1,
          }}>{String(i+1).padStart(2, '0')}</div>
          <div>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 400, letterSpacing: '-0.015em', color: 'var(--m-text-bright)' }}>{f.title}</h3>
            <div style={{
              marginTop: 12,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 13, color: 'var(--m-accent)',
              letterSpacing: '0.02em', lineHeight: 1.5,
            }}>{f.subtitle}</div>
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.8, color: '#e6e1d4', textWrap: 'pretty' }}><MonolithRichText text={f.description} /></p>
            <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0 0' }}>
              {f.detail.map((d, k) => (
                <li key={k} style={{
                  fontSize: 13.5, lineHeight: 1.75, color: 'rgba(230,225,212,0.78)',
                  padding: '5px 0 5px 20px', position: 'relative',
                  fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
                }}>
                  <span style={{ position: 'absolute', left: 0, color: 'rgba(255,195,50,0.6)' }}>—</span>
                  <MonolithRichText text={d} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
}

function MonolithInstall() {
  return (
    <div style={{ overflow: 'auto', paddingRight: 8 }}>
      <MonolithSectionHeader eyebrow="A brief guide" title="Installation" />

      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0,
        borderTop: '1px solid rgba(255,235,190,0.22)',
        borderBottom: '1px solid rgba(255,235,190,0.22)',
      }}>
        {window.FSAGA_INSTALL.steps.map((s, i) => (
          <div key={s.step} style={{
            padding: '36px 28px',
            borderLeft: i === 0 ? 'none' : '1px solid rgba(255,235,190,0.12)',
          }}>
            <div style={{
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 13, letterSpacing: '0.32em',
              color: 'var(--m-accent)', marginBottom: 18, textTransform: 'uppercase',
            }}>Step {String(s.step).padStart(2, '0')}</div>
            <h3 style={{ margin: 0, fontSize: 26, fontWeight: 400, letterSpacing: '-0.015em', color: 'var(--m-text-bright)' }}>{s.title}</h3>
            <p style={{ margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.8, color: 'var(--m-text)', textWrap: 'pretty' }}><MonolithRichText text={s.description} /></p>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 40 }}>
        <div style={{
          fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
          fontSize: 13, letterSpacing: '0.32em', textTransform: 'uppercase',
          color: 'var(--m-accent)', marginBottom: 16,
        }}>Notes</div>
        {window.FSAGA_INSTALL.notes.map((n, i) => (
          <div key={i} style={{
            padding: '14px 0 14px 28px', position: 'relative',
            borderTop: i === 0 ? '1px solid rgba(255,235,190,0.18)' : 'none',
            borderBottom: '1px solid rgba(255,235,190,0.1)',
            fontSize: 14.5, lineHeight: 1.75, color: '#e6e1d4',
          }}>
            <span style={{
              position: 'absolute', left: 0, top: 14,
              fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace',
              fontSize: 13, color: 'rgba(255,195,50,0.75)',
              letterSpacing: '0.1em',
            }}>※</span>
            <MonolithRichText text={n} />
          </div>
        ))}
      </div>
    </div>
  );
}

window.MonolithVariant = MonolithVariant;
