import { useMemo, useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring
} from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  ArrowDown,
  Search,
  Menu,
  X,
  Sparkles,
  CakeSlice,
  Croissant,
  Gift,
  Coffee,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  Award,
  Star,
  Plus,
  Check,
  ShoppingBag
} from 'lucide-react'
import { products } from './products'
import OrderTray from './components/OrderTray'
import FloatingBakeryBackdrop from './components/FloatingBakeryBackdrop'
import CakeIntro from './components/CakeIntro'
import OccasionBuilder from './components/OccasionBuilder'
import './App.css'

const categories = ['All', 'Cakes', 'Pastries', 'Sweets', 'Hot']

const marqueeItems = [
  'CELEBRATION CAKES',
  'PREMIUM CAKES',
  'ARTISAN PASTRIES',
  'CURATED PASTRY BOXES',
  'TRADITIONAL SWEETS',
  'HOT & SAVOURY FAVOURITES'
]


const getProductThumb = (product) => {
  const n = (product.name || '').toLowerCase()
  if (n.includes('puff') || n.includes('samosa') || n.includes('roll') || n.includes('burger') || n.includes('pizza')) {
    return '/showcase/hot.jpg'
  }
  if (product.category === 'Cakes') return '/showcase/hero-cake.gif'
  if (product.category === 'Pastries') return '/showcase/pastries.jpg'
  if (product.category === 'Hot') return '/showcase/hot.jpg'
  return '/showcase/sweets.jpg'
}

const showcaseCollections = [
  {
    key: 'Sweets',
    image: '/showcase/sweets.jpg',
    num: '01',
    tag: '81 SIGNATURE ITEMS',
    title: 'Traditional Sweets',
    desc: 'Classic Indian mithai and festive delicacies crafted with pure ingredients and time-honoured recipes.'
  },
  {
    key: 'Hot',
    image: '/showcase/hot.jpg',
    num: '02',
    tag: '40 FRESH SPECIALTIES',
    title: 'Hot & Savoury',
    desc: 'Crispy puffs, warm evening snacks, and savoury favourites prepared fresh through the day.'
  },
  {
    key: 'Cakes',
    image: '/showcase/hero-cake.gif',
    num: '03',
    tag: 'CELEBRATION & PREMIUM',
    title: 'Signature Cakes',
    desc: 'Custom celebration cakes and layered premium creations designed for birthdays and milestones.'
  },
  {
    key: 'Pastries',
    image: '/showcase/pastries.jpg',
    num: '04',
    tag: 'SINGLE & GIFT BOXES',
    title: 'Pastries & Boxes',
    desc: 'Individual patisserie slices and curated pastry boxes made for effortless gifting and sharing.'
  }
]

const cardTint = {
  Sweets: { label: 'SWEET COLLECTION', code: 'SW', className: 'plate-sweet' },
  Hot: { label: 'HOT & SAVOURY', code: 'HS', className: 'plate-hot' },
  Cakes: { label: 'CAKE COLLECTION', code: 'CK', className: 'plate-cake' },
  Pastries: { label: 'PASTRY COLLECTION', code: 'PT', className: 'plate-pastry' }
}

const revealUp = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] }
  }
}

function App() {
  const [category, setCategory] = useState('All')
  const [showAllMenu, setShowAllMenu] = useState(false)
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [trayItems, setTrayItems] = useState([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)

  const trayCount = trayItems.reduce((sum, item) => sum + item.qty, 0)

  const addToTray = product => {
    setTrayItems(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => (i.id === product.id ? { ...i, qty: i.qty + 1 } : i))
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          category: product.category,
          unit: product.category === 'Sweets' ? '500g' : '',
          qty: 1
        }
      ]
    })
  }

  const updateTrayQty = (id, delta) => {
    setTrayItems(prev =>
      prev
        .map(item => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter(item => item.qty > 0)
    )
  }

  const updateTrayUnit = (id, unit) => {
    setTrayItems(prev => prev.map(item => (item.id === id ? { ...item, unit } : item)))
  }

  const removeFromTray = id => {
    setTrayItems(prev => prev.filter(item => item.id !== id))
  }

  const clearTray = () => setTrayItems([])

  const heroRef = useRef(null)

  const { scrollYProgress: pageProgress } = useScroll()
  const scaleX = useSpring(pageProgress, { stiffness: 120, damping: 26, restDelta: 0.001 })

  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start']
  })
  const crestY = useTransform(heroScroll, [0, 1], [0, 48])
  const crestRotate = useTransform(heroScroll, [0, 1], [0, 14])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesCategory = category === 'All' || product.category === category
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [category, search])

  const visibleProducts = showAll ? filteredProducts : filteredProducts.slice(0, 12)
  const isFiltered = (typeof searchQuery === 'string' && searchQuery.trim().length > 0) ||
    (typeof activeCategory === 'string' && activeCategory !== 'All')
  const displayedProducts = (showAllMenu || isFiltered) ? visibleProducts : visibleProducts.slice(0, 18)

  const closeMenu = () => setMobileMenu(false)

  const jumpToCategory = targetCategory => {
    setCategory(targetCategory)
    setShowAll(false)
    const el = document.getElementById('collection')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="site-shell">
      <FloatingBakeryBackdrop />
      {/* TOP GOLD SCROLL METER */}
      <motion.div className="scroll-progress-bar" style={{ scaleX }} />

      <div className="announcement">
        <Sparkles size={11} />
        <span>FRESHLY CRAFTED SWEETS, BAKERY &amp; SAVOURIES — A LITTLE JOY IN EVERY BITE</span>
        <Sparkles size={11} />
      </div>

      <header className="header">
        <a href="#home" className="brand" onClick={closeMenu}>
          <motion.img
            src="/royal-logo.png"
            alt="Royal Bakery & Sweets"
            whileHover={{ rotate: -6, scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300, damping: 18 }}
          />
          <span className="brand-copy">
            <strong>ROYAL</strong>
            <small>BAKERY &amp; SWEETS</small>
          </span>
        </a>

        <button
          className="mobile-toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
          aria-label="Toggle navigation"
        >
          {mobileMenu ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={mobileMenu ? 'nav nav-open' : 'nav'}>
          <a href="#collections-overview" onClick={closeMenu}>Specialties</a>
          <a href="#collection" onClick={closeMenu}>Menu ({products.length})</a>
          <a href="#story" onClick={closeMenu}>Our Craft</a>
          <a href="#occasions" onClick={closeMenu}>Celebrations</a>
          <a href="#contact" className="nav-cta" onClick={closeMenu}>
            Visit &amp; Enquire <ArrowUpRight size={14} />
          </a>
        </nav>
      </header>

      <main>
        {/* EDITORIAL HERO WITH CHOREOGRAPHED ENTRANCE & ORBITAL CREST */}
        <section className="hero" id="home" ref={heroRef}>
          <div className="hero-ambient-orb orb-left" aria-hidden="true" />
          <div className="hero-ambient-orb orb-right" aria-hidden="true" />

          <div className="hero-grid">
            <div className="hero-copy">
              <motion.div
                className="kicker"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="kicker-line" />
                THE ART OF GOOD TASTE
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              >
                Made with love.<br />
                <em>Remembered</em> forever.
              </motion.h1>

              <motion.p
                className="hero-lead"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
              >
                Discover the warmth of traditional Indian sweets, freshly baked pastries, celebration cakes, and crisp savoury favourites at Royal Bakery &amp; Sweets.
              </motion.p>

              <motion.div
                className="hero-actions"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.34 }}
              >
                <motion.a
                  href="#collection"
                  className="btn btn-primary btn-shimmer"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Explore our menu <ArrowRight size={16} />
                </motion.a>
                <motion.a
                  href="#occasions"
                  className="btn btn-secondary"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Celebrations &amp; gifting
                </motion.a>
              </motion.div>

              <motion.div
                className="hero-pillars"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.48 }}
              >
                <div>
                  <CheckCircle2 size={15} />
                  <span>Crafting joy since 1967</span>
                </div>
                <div>
                  <Award size={15} />
                  <span>{products.length} signature items</span>
                </div>
                <div>
                  <Star size={15} />
                  <span>Custom occasion orders</span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="hero-showcase"
              style={{ y: crestY }}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.85, delay: 0.16, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="showcase-frame">
                <motion.div className="orbit-ring ring-outer" style={{ rotate: crestRotate }} />
                <div className="orbit-ring ring-inner" />

                <div className="showcase-inner">
                  <span className="showcase-badge">EST. 1967</span>
                  <div className="showcase-cake-window">
                    <img src="/showcase/hero-cake.gif" alt="Royal Celebration Cake" className="showcase-cake-media" />
                  </div>
                  <motion.div
                    className="showcase-crest"
                    animate={{ y: [0, -7, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img src="/royal-logo.png" alt="Royal Bakery & Sweets Crest" />
                  </motion.div>
                  <div className="showcase-title">
                    <strong>ROYAL</strong>
                    <span>BAKERY &amp; SWEETS</span>
                  </div>
                  <div className="showcase-rule" />
                  <p className="showcase-quote">
                    &ldquo;A taste worth coming back for, crafted for everyday moments and grand celebrations.&rdquo;
                  </p>
                  <div className="showcase-meta">
                    <span>SWEETS</span>
                    <span>•</span>
                    <span>CAKES</span>
                    <span>•</span>
                    <span>PASTRIES</span>
                    <span>•</span>
                    <span>SAVOURY</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* INFINITE LUXURY MARQUEE RIBBON */}
        <div className="marquee-strip" aria-hidden="true">
          <div className="marquee-track">
            {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((label, idx) => (
              <span key={idx} className="marquee-item">
                <Sparkles size={11} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* 4-PILLAR INTERACTIVE SPECIALTIES */}
        <section className="specialties section-pad" id="collections-overview">
          <motion.div
            className="section-head"
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div>
              <span className="kicker"><span className="kicker-line" />CRAFTED FOR EVERY CRAVING</span>
              <h2>Six collections, one <em>royal kitchen.</em></h2>
            </div>
            <p className="section-sub">
              Tap any specialty below to jump straight into our curated selection—from heritage mithai and hot savouries to celebration cakes and pastry boxes.
            </p>
          </motion.div>

          <div className="specialty-grid">
            {showcaseCollections.map((item, idx) => (
              <motion.button
                key={item.key}
                type="button"
                className="specialty-card"
                onClick={() => jumpToCategory(item.key)}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                whileTap={{ scale: 0.98 }}
              >
                  {item.image && (
                    <div className="specialty-thumb">
                      {item.image.endsWith('.mp4') ? (
                        <video src={item.image} autoPlay loop muted playsInline />
                      ) : (
                        <img src={item.image} alt={item.title} loading={visibleProducts.length <= 24 ? "eager" : "lazy"} />
                      )}
                    </div>
                  )}
                <div className="specialty-top">
                  <span className="specialty-tag">{item.tag}</span>
                  <span className="specialty-num">{item.num}</span>
                </div>
                <h3>{item.title}</h3>
                <p>{item.desc}</p>
                <span className="specialty-link">
                  Explore {item.key.toLowerCase()} <ArrowRight size={14} />
                </span>
              </motion.button>
            ))}
          </div>
        </section>

        {/* FULL INTERACTIVE CATALOGUE WITH SLIDING PILL TABS */}
        <section className="collection section-pad" id="collection">
          <motion.div
            className="section-head"
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div>
              <span className="kicker"><span className="kicker-line" />A TASTE OF ROYALTY</span>
              <h2>Explore our <em>collection.</em></h2>
              <p className="section-sub">
                Search across {products.length} items, filter by category, or tap any card for a closer preview.
              </p>
            </div>
            <div className="count-badge">
              <strong>{filteredProducts.length.toString().padStart(2, '0')}</strong>
              <span>{filteredProducts.length === 1 ? 'ITEM' : 'ITEMS'}<br />SHOWING</span>
            </div>
          </motion.div>

          <div className="catalogue-bar">
            <div className="category-tabs" role="tablist" aria-label="Product categories">
              {categories.map(item => {
                const count = item === 'All'
                  ? products.length
                  : products.filter(p => p.category === item).length
                const isActive = category === item
                return (
                  <button
                    key={item}
                    type="button"
                    className={isActive ? 'tab active' : 'tab'}
                    onClick={() => { setCategory(item); setShowAll(false) }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategoryPill"
                        className="tab-pill-bg"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="tab-content">
                      {item === 'All' && <Sparkles size={14} />}
                      {item === 'Cakes' && <CakeSlice size={14} />}
                      {item === 'Pastries' && <Croissant size={14} />}
                      {item === 'Sweets' && <Gift size={14} />}
                      {item === 'Hot' && <Coffee size={14} />}
                      <span>{item}</span>
                      <em>{count > 0 ? count : 'Soon'}</em>
                    </span>
                  </button>
                )
              })}
            </div>

            <label className="search-input">
              <Search size={16} />
              <input
                type="search"
                value={search}
                onChange={e => { setSearch(e.target.value); setShowAll(false) }}
                placeholder="Search sweets, snacks, cakes..."
              />
              {search && (
                <button type="button" onClick={() => setSearch('')} aria-label="Clear search">
                  <X size={14} />
                </button>
              )}
            </label>
          </div>

          <div className="menu-list">
              {displayedProducts.map((product) => {
                const style = cardTint[product.category] || cardTint.Sweets
                const itemNumber = String(products.indexOf(product) + 1).padStart(2, '0')
                const inTray = trayItems.find(i => i.id === product.id)
                return (
                  <article
                    className="menu-row"
                    key={product.id}
                    onClick={() => setSelectedProduct({ ...product, itemNumber, style })}
                  >
                    <div className="menu-row-thumb">
                      <img
                        src={getProductThumb(product)}
                        alt={product.name}
                        loading="eager"
                        decoding="async"
                      />
                    </div>

                    <div className="menu-row-info">
                      <h3>{product.name}</h3>
                      <span className="menu-row-sub">#{itemNumber} · {product.category}</span>
                    </div>

                    <button
                      type="button"
                      className={inTray ? 'card-add-btn added' : 'card-add-btn'}
                      onClick={e => {
                        e.stopPropagation()
                        addToTray(product)
                      }}
                      aria-label={`Add ${product.name} to order tray`}
                    >
                      {inTray ? (
                        <>
                          <Check size={13} /> {inTray.qty}
                        </>
                      ) : (
                        <>
                          <Plus size={13} /> Add
                        </>
                      )}
                    </button>
                  </article>
                )
              })}
            </div>

            {visibleProducts.length > 18 && (
              <div className="menu-expand-bar">
                <button
                  type="button"
                  className="menu-expand-btn"
                  onClick={() => setShowAllMenu(prev => !prev)}
                >
                  {showAllMenu
                    ? 'Show top 18 items'
                    : `Show all ${visibleProducts.length} items`}
                </button>
              </div>
            )}
        </section>
      </main>

      {/* PRODUCT QUICK-VIEW MODAL */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            className="modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
          >
            <motion.div
              className="modal-card"
              initial={{ opacity: 0, y: 32, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 320, damping: 28 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                type="button"
                className="modal-close"
                onClick={() => setSelectedProduct(null)}
                aria-label="Close preview"
              >
                <X size={18} />
              </button>

              <div className={`modal-banner ${selectedProduct.style.className}`}>
                <span className="modal-code">ITEM #{selectedProduct.itemNumber}</span>
                <div className="plate-seal">
                  <span>{selectedProduct.style.code}</span>
                </div>
                <span className="plate-tag">{selectedProduct.style.label}</span>
              </div>

              <div className="modal-content">
                <span className="product-cat">{selectedProduct.category}</span>
                <h3>{selectedProduct.name}</h3>
                <p>
                  Freshly prepared at Royal Bakery &amp; Sweets. Available for counter purchase, family packs, and celebration orders.
                </p>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      addToTray(selectedProduct)
                      setSelectedProduct(null)
                      setTrayOpen(true)
                    }}
                  >
                    <ShoppingBag size={15} /> Add to Order Tray
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setSelectedProduct(null)}
                  >
                    Back to menu
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="footer">
        <div className="footer-top">
          <a href="#home" className="footer-brand">
            <img src="/royal-logo.png" alt="Royal Bakery & Sweets" />
            <span>
              <strong>ROYAL</strong>
              <small>BAKERY &amp; SWEETS</small>
            </span>
          </a>
          <p>A little joy in every bite • Since 1967</p>
          <div className="footer-links">
            <a
              href="https://www.instagram.com/royalbakery_1967"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-ig"
            >
              <InstagramIcon size={15} /> @royalbakery_1967
            </a>
            <a href="#home" className="back-top">Back to top ↑</a>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Royal Bakery &amp; Sweets. All rights reserved.</span>
        </div>
      </footer>

      <AnimatePresence>
        {showIntro && <CakeIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <button
          type="button"
          className="replay-cake-btn"
          onClick={() => setShowIntro(true)}
          aria-label="Replay cake cutting animation"
          title="Replay cake cutting"
        >
          🎂
        </button>
      )}

      <OrderTray
        items={trayItems}
        isOpen={trayOpen}
        setIsOpen={setTrayOpen}
        onUpdateQty={updateTrayQty}
        onUpdateUnit={updateTrayUnit}
        onRemove={removeFromTray}
        onClear={clearTray}
      />
    </div>
  )
}

function InstagramIcon({ size = 18 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

export default App
