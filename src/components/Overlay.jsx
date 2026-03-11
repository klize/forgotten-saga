import GameBox from './GameBox'

export default function Overlay({ isOpen, onClose, title, children }) {
  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      {/* Modal */}
      <GameBox className="w-full max-w-4xl max-h-[85vh] backdrop-blur-xl shadow-2xl animate-[slideUp_0.3s_ease-out] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gold-dark/30 shrink-0">
          <h2 className="text-2xl font-semibold text-gold">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center text-gold-dark/50 hover:text-gold rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto min-h-0 flex-1">
          <div className="px-8 py-6">
            {children}
          </div>
        </div>
      </GameBox>
    </div>
  )
}
