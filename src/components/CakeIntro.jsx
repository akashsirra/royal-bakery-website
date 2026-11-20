import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const CONFETTI = Array.from({ length: 42 }, (_, i) => {
  const angle = (i / 42) * Math.PI * 2 + (i % 3) * 0.12
  const dist = 110 + (i % 5) * 48
  const colors = ['#f7e3b5', '#d9a441', '#ff7b89', '#fff8ec', '#ffcf6e', '#e85d75']
  return {
    id: i,
    x: Math.cos(angle) * dist,
    y: Math.sin(angle) * dist - 30,
    w: 6 + (i % 4) * 3,
    h: 4 + (i % 3) * 4,
    rotate: (i % 2 === 0 ? 1 : -1) * (180 + i * 24),
    color: colors[i % colors.length]
  }
})

function RoyalCakeSVG() {
  return (
    <svg viewBox="0 0 280 270" className="intro-cake-svg" aria-hidden="true">
      <defs>
        <linearGradient id="royalGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff0c4" />
          <stop offset="45%" stopColor="#e2ae4b" />
          <stop offset="100%" stopColor="#9c6a1c" />
        </linearGradient>
        <linearGradient id="spongeDark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5c3324" />
          <stop offset="100%" stopColor="#2c160e" />
        </linearGradient>
        <linearGradient id="frostingCream" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#f0d9b5" />
        </linearGradient>
        <linearGradient id="berryPink" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff6b81" />
          <stop offset="100%" stopColor="#c0394d" />
        </linearGradient>
      </defs>

      {/* Cake Stand */}
      <ellipse cx="140" cy="242" rx="112" ry="16" fill="#0d0705" opacity="0.7" />
      <rect x="124" y="218" width="32" height="22" rx="6" fill="url(#royalGold)" />
      <ellipse cx="140" cy="218" rx="108" ry="15" fill="url(#royalGold)" />
      <ellipse cx="140" cy="216" rx="98" ry="10" fill="#29150d" />

      {/* Bottom Tier */}
      <rect x="44" y="152" width="192" height="62" rx="12" fill="url(#spongeDark)" stroke="#e2ae4b" strokeWidth="1.8" />
      <path
        d="M44 166 Q62 184 80 166 T116 166 T152 166 T188 166 T224 166 L236 166 L236 154 Q236 148 228 148 L52 148 Q44 148 44 154 Z"
        fill="url(#frostingCream)"
      />
      <circle cx="76" cy="192" r="4" fill="#f7e3b5" />
      <circle cx="108" cy="192" r="4" fill="#ff7b89" />
      <circle cx="140" cy="192" r="5" fill="#e2ae4b" />
      <circle cx="172" cy="192" r="4" fill="#ff7b89" />
      <circle cx="204" cy="192" r="4" fill="#f7e3b5" />

      {/* Middle Tier */}
      <rect x="72" y="102" width="136" height="50" rx="10" fill="url(#spongeDark)" stroke="#e2ae4b" strokeWidth="1.6" />
      <path
        d="M72 114 Q88 128 104 114 T136 114 T168 114 T200 114 L208 114 L208 104 Q208 98 200 98 L80 98 Q72 98 72 104 Z"
        fill="url(#frostingCream)"
      />
      {/* Cherries on middle tier */}
      <circle cx="88" cy="100" r="6" fill="url(#berryPink)" />
      <circle cx="192" cy="100" r="6" fill="url(#berryPink)" />

      {/* Top Tier */}
      <rect x="100" y="64" width="80" height="38" rx="9" fill="url(#spongeDark)" stroke="#e2ae4b" strokeWidth="1.5" />
      <path
        d="M100 74 Q112 84 124 74 T148 74 T172 74 L180 74 L180 65 Q180 60 174 60 L106 60 Q100 60 100 65 Z"
        fill="url(#frostingCream)"
      />

      {/* 3 Candles */}
      {[118, 140, 162].map((cx, idx) => (
        <g key={cx}>
          <rect x={cx - 4} y={idx === 1 ? 30 : 36} width="8" height={idx === 1 ? 30 : 24} rx="3" fill="url(#royalGold)" />
          <motion.path
            d={`M${cx} ${idx === 1 ? 8 : 14} C${cx + 7} ${idx === 1 ? 18 : 24} ${cx + 6} ${idx === 1 ? 26 : 32} ${cx} ${idx === 1 ? 30 : 36} C${cx - 6} ${idx === 1 ? 26 : 32} ${cx - 7} ${idx === 1 ? 18 : 24} ${cx} ${idx === 1 ? 8 : 14} Z`}
            fill="#ffcf6e"
            animate={{ scale: [1, 1.18, 0.94, 1], opacity: [0.9, 1, 0.85, 0.9] }}
            transition={{ duration: 1.1 + idx * 0.2, repeat: Infinity, ease: 'easeInOut' }}
            style={{ transformOrigin: `${cx}px ${idx === 1 ? 28 : 34}px` }}
          />
          <circle cx={cx} cy={idx === 1 ? 22 : 28} r="2.8" fill="#fffdf2" />
        </g>
      ))}
    </svg>
  )
}

export default function CakeIntro({ onComplete }) {
  const [isCut, setIsCut] = useState(false)
  const [curtainsOpen, setCurtainsOpen] = useState(false)
  const startRef = useRef(null)

  const triggerCut = () => {
    if (isCut) return
    setIsCut(true)
    setTimeout(() => setCurtainsOpen(true), 780)
    setTimeout(() => onComplete(), 1580)
  }

  const onPointerDown = e => {
    startRef.current = { x: e.clientX, y: e.clientY }
  }

  const onPointerMove = e => {
    if (!startRef.current || isCut) return
    const dist = Math.hypot(e.clientX - startRef.current.x, e.clientY - startRef.current.y)
    if (dist > 36) {
      startRef.current = null
      triggerCut()
    }
  }

  return (
    <div className="cake-intro-root">
      {/* Dual Velvet Curtains */}
      <motion.div
        className="intro-curtain intro-curtain-left"
        animate={curtainsOpen ? { x: '-102%' } : { x: '0%' }}
        transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
      />
      <motion.div
        className="intro-curtain intro-curtain-right"
        animate={curtainsOpen ? { x: '102%' } : { x: '0%' }}
        transition={{ duration: 0.78, ease: [0.76, 0, 0.24, 1] }}
      />

      <motion.div
        className="intro-content"
        animate={curtainsOpen ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.45 }}
      >
        <button type="button" className="intro-skip-btn" onClick={onComplete}>
          Skip →
        </button>

        <div className="intro-brand">
          <span className="intro-est">EST. 1967 · NARSAPUR</span>
          <h2>ROYAL</h2>
          <p>BAKERY &amp; SWEETS</p>
        </div>

        <div
          className="intro-cake-stage"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => { startRef.current = null }}
          onClick={triggerCut}
          role="button"
          tabIndex={0}
          aria-label="Swipe or tap to cut the cake"
        >
          {/* Ambient golden halo behind cake */}
          <motion.div
            className="cake-halo"
            animate={isCut ? { scale: 2.2, opacity: 0 } : { scale: [1, 1.12, 1], opacity: [0.45, 0.7, 0.45] }}
            transition={isCut ? { duration: 0.7 } : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Shockwave Ring on Cut */}
          <AnimatePresence>
            {isCut && (
              <motion.div
                className="cake-shockwave"
                initial={{ scale: 0.2, opacity: 0.95 }}
                animate={{ scale: 2.6, opacity: 0 }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* Left Cake Half */}
          <motion.div
            className="cake-half cake-half-left"
            animate={isCut ? { x: -64, rotate: -14, y: 12 } : { x: 0, rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 170, damping: 14 }}
          >
            <RoyalCakeSVG />
          </motion.div>

          {/* Right Cake Half */}
          <motion.div
            className="cake-half cake-half-right"
            animate={isCut ? { x: 64, rotate: 14, y: 12 } : { x: 0, rotate: 0, y: 0 }}
            transition={{ type: 'spring', stiffness: 170, damping: 14 }}
          >
            <RoyalCakeSVG />
          </motion.div>

          {/* Golden Blade Slash */}
          <AnimatePresence>
            {isCut && (
              <motion.div
                className="cake-slash-line"
                initial={{ scaleY: 0, opacity: 1 }}
                animate={{ scaleY: 1, opacity: [1, 1, 0] }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
              />
            )}
          </AnimatePresence>

          {/* 42-Piece Confetti & Gold Burst */}
          {isCut && (
            <div className="cake-particles" aria-hidden="true">
              {CONFETTI.map(p => (
                <motion.span
                  key={p.id}
                  className="cake-particle"
                  style={{ width: p.w, height: p.h, background: p.color }}
                  initial={{ x: 0, y: 0, scale: 0, opacity: 1 }}
                  animate={{ x: p.x, y: p.y, scale: [0, 1.3, 0.6], opacity: [1, 1, 0], rotate: p.rotate }}
                  transition={{ duration: 0.95, ease: [0.16, 1, 0.3, 1] }}
                />
              ))}
            </div>
          )}

          {/* Animated Swipe Prompt Line */}
          {!isCut && (
            <motion.div
              className="swipe-guide"
              animate={{ y: [-45, 65], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          )}
        </div>

        <motion.div
          animate={isCut ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <span className="intro-pill">
            <Sparkles size={14} /> Swipe or tap the cake to cut &amp; enter
          </span>
        </motion.div>
      </motion.div>
    </div>
  )
}
