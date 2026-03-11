const F = './assets/logo/wframe'

export default function GameBox({ className = '', children, scale, style, ...props }) {
  const boxStyle = scale ? { '--gb-scale': scale, ...style } : style
  return (
    <div className={`game-box ${className}`} style={boxStyle} {...props}>
      <img src={`${F}/0.png`} className="gb-c gb-tl" alt="" draggable={false} />
      <img src={`${F}/5.png`} className="gb-c gb-tr" alt="" draggable={false} />
      <img src={`${F}/6.png`} className="gb-c gb-bl" alt="" draggable={false} />
      <img src={`${F}/7.png`} className="gb-c gb-br" alt="" draggable={false} />
      <div className="gb-eh gb-et" style={{ backgroundImage: `url('${F}/1.png')` }} />
      <div className="gb-eh gb-eb" style={{ backgroundImage: `url('${F}/1.png')` }} />
      <div className="gb-ev gb-el" style={{ backgroundImage: `url('${F}/4.png')` }} />
      <div className="gb-ev gb-er" style={{ backgroundImage: `url('${F}/3.png')` }} />
      {children}
    </div>
  )
}
