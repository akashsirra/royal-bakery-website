import { motion, useScroll, useTransform } from 'framer-motion'

const ITEMS = [
  { id: 1, type: 'cake', top: '6%', left: '4%', size: 78, duration: 9, delay: 0, rot: -12 },
  { id: 2, type: 'donut', top: '13%', right: '5%', size: 68, duration: 11, delay: 0.8, rot: 16 },
  { id: 3, type: 'cupcake', top: '26%', left: '72%', size: 74, duration: 10, delay: 1.4, rot: -8 },
  { id: 4, type: 'katli', top: '32%', left: '6%', size: 64, duration: 8.5, delay: 0.4, rot: 20 },
  { id: 5, type: 'croissant', top: '44%', right: '4%', size: 76, duration: 12, delay: 1.1, rot: -14 },
  { id: 6, type: 'laddoo', top: '52%', left: '5%', size: 62, duration: 9.5, delay: 2, rot: 12 },
  { id: 7, type: 'cake', top: '63%', right: '7%', size: 72, duration: 11.5, delay: 0.6, rot: 10 },
  { id: 8, type: 'donut', top: '74%', left: '8%', size: 68, duration: 10.5, delay: 1.7, rot: -18 },
  { id: 9, type: 'cupcake', top: '84%', right: '8%', size: 70, duration: 9, delay: 0.9, rot: 14 },
  { id: 10, type: 'katli', top: '91%', left: '14%', size: 58, duration: 8, delay: 1.3, rot: -10 }
]

function ColourBakeryArt({ type }) {
  if (type === 'cake') {
    return (
      <svg viewBox="0 0 80 80" fill="none">
        <ellipse cx="40" cy="68" rx="30" ry="6" fill="#d9a441" opacity="0.45" />
        <rect x="16" y="42" width="48" height="24" rx="6" fill="#6b3a26" />
        <path d="M16 48 Q24 56 32 48 T48 48 T64 48 L64 42 Q64 38 60 38 L20 38 Q16 38 16 42 Z" fill="#fff5e4" />
        <rect x="24" y="24" width="32" height="16" rx="5" fill="#844a32" />
        <path d="M24 29 Q30 35 36 29 T48 29 T56 29 L56 24 Q56 21 53 21 L27 21 Q24 21 24 24 Z" fill="#ffd6de" />
        <circle cx="40" cy="17" r="4.5" fill="#e84a5f" />
      </svg>
    )
  }

  if (type === 'cupcake') {
    return (
      <svg viewBox="0 0 80 80" fill="none">
        <path d="M22 44 H58 L52 68 H28 L22 44 Z" fill="#d99b52" />
        <path d="M31 44 L34 68 M40 44 V68 M49 44 L46 68" stroke="#b57632" strokeWidth="2" />
        <path d="M18 44 C18 34 26 28 34 28 C36 20 44 18 50 22 C56 25 60 31 60 37 C63 39 63 44 58 44 Z" fill="#ff9eb5" />
        <circle cx="40" cy="18" r="5" fill="#e84a5f" />
        <circle cx="32" cy="36" r="2" fill="#fff5e4" />
        <circle cx="47" cy="34" r="2" fill="#ffd166" />
      </svg>
    )
  }

  if (type === 'donut') {
    return (
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="40" r="26" fill="#e3a857" />
        <path d="M16 38 C16 24 28 14 42 15 C55 16 65 26 64 40 C60 44 55 41 51 44 C46 47 41 42 36 45 C30 48 24 41 16 38 Z" fill="#5c2c1d" />
        <circle cx="40" cy="40" r="9" fill="#fbf7f0" />
        <rect x="28" y="24" width="6" height="2.6" rx="1.3" transform="rotate(25 28 24)" fill="#ffd166" />
        <rect x="46" y="23" width="6" height="2.6" rx="1.3" transform="rotate(-20 46 23)" fill="#ff8fab" />
        <rect x="52" y="34" width="6" height="2.6" rx="1.3" transform="rotate(40 52 34)" fill="#fff5e4" />
      </svg>
    )
  }

  if (type === 'katli') {
    return (
      <svg viewBox="0 0 80 80" fill="none">
        <polygon points="40,10 68,40 40,70 12,40" fill="#f3dfb9" stroke="#c89236" strokeWidth="2.5" />
        <polygon points="40,18 58,40 40,62 22,40" fill="#ffffff" opacity="0.55" />
        <circle cx="40" cy="40" r="4" fill="#c89236" />
      </svg>
    )
  }

  if (type === 'laddoo') {
    return (
      <svg viewBox="0 0 80 80" fill="none">
        <circle cx="40" cy="42" r="24" fill="#f4a62a" />
        <circle cx="32" cy="34" r="3" fill="#ffcf6e" />
        <circle cx="46" cy="32" r="3" fill="#e08614" />
        <circle cx="38" cy="46" r="3.5" fill="#ffcf6e" />
        <circle cx="50" cy="48" r="2.8" fill="#e08614" />
        <circle cx="29" cy="48" r="2.5" fill="#e08614" />
        <ellipse cx="40" cy="24" rx="5" ry="2.5" fill="#6aa84f" transform="rotate(-18 40 24)" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 80 80" fill="none">
      <path d="M14 52 C10 38 20 22 36 18 C52 14 68 24 68 40 C68 50 58 56 48 56 C38 56 32 50 26 52 C20 54 16 56 14 52 Z" fill="#d98a3c" />
      <path d="M28 24 C32 34 30 44 24 51 M42 19 C45 31 44 43 38 53 M55 24 C57 34 55 44 50 53" stroke="#9e591c" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

export default function FloatingBakeryBackdrop() {
  const { scrollYProgress } = useScroll()
  const yFast = useTransform(scrollYProgress, [0, 1], [0, -160])
  const ySlow = useTransform(scrollYProgress, [0, 1], [0, -80])

  return (
    <div className="bakery-bg-layer" aria-hidden="true">
      <motion.div
        className="bg-orb bg-orb-1"
        animate={{ x: [0, 44, -24, 0], y: [0, -34, 26, 0], scale: [1, 1.15, 0.94, 1] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-orb bg-orb-2"
        animate={{ x: [0, -40, 28, 0], y: [0, 36, -28, 0], scale: [1, 0.92, 1.12, 1] }}
        transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="bg-orb bg-orb-3"
        animate={{ x: [0, 30, -30, 0], y: [0, -24, 24, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
      />

      {ITEMS.map((item, idx) => (
        <motion.div
          key={item.id}
          className="bg-motif-rich"
          style={{
            top: item.top,
            left: item.left,
            right: item.right,
            width: item.size,
            height: item.size,
            y: idx % 2 === 0 ? yFast : ySlow
          }}
          initial={{ rotate: item.rot }}
          animate={{
            y: [0, -22, 12, 0],
            x: [0, 10, -8, 0],
            rotate: [item.rot, item.rot + 14, item.rot - 10, item.rot]
          }}
          transition={{
            duration: item.duration,
            delay: item.delay,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          <ColourBakeryArt type={item.type} />
        </motion.div>
      ))}
    </div>
  )
}
