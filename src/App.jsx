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

const categories = ['All', 'Sweets', 'Namkeen', 'Bakery', 'Hot', 'Desserts', 'Beverages']

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
  if (product.category === 'Hot' || n.includes('puff') || n.includes('roll') || n.includes('hot dog')) {
    return '/showcase/hot.jpg'
  }
  if (product.category === 'Bakery' || product.category === 'Desserts') {
    return '/showcase/pastries.jpg'
  }
  if (product.category === 'Namkeen') {
    return '/showcase/hot.jpg'
  }
  if (product.category === 'Beverages') {
    return '/showcase/sweets.jpg'
  }
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
  Namkeen: { label: 'NAMKEEN & SAVOURY', code: 'NK', className: 'plate-hot' },
  Bakery: { label: 'BAKERY ITEMS', code: 'BK', className: 'plate-pastry' },
  Hot: { label: 'HOT & PUFFS', code: 'HT', className: 'plate-hot' },
  Desserts: { label: 'DESSERTS', code: 'DS', className: 'plate-cake' },
  Beverages: { label: 'BEVERAGES', code: 'BV', className: 'plate-sweet' }
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
  const [search, setSearch] = useState('')
  const [mobileMenu, setMobileMenu] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [trayItems, setTrayItems] = useState([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [priceRange, setPriceRange] = useState('all')
  const [darkMode, setDarkMode] = useState(false)

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
          qty: 1,
          menuPrice: product.menuPrice || ''
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

      let matchesPrice = true
      if (priceRange === 'under100') matchesPrice = product.priceValue < 100
      else if (priceRange === '100to300') matchesPrice = product.priceValue >= 100 && product.priceValue <= 300
      else if (priceRange === '300to600') matchesPrice = product.priceValue > 300 && product.priceValue <= 600
      else if (priceRange === 'above600') matchesPrice = product.priceValue > 600

      return matchesCategory && matchesSearch && matchesPrice
    })
  }, [category, search, priceRange])

  // FIXED logic
  const isFiltered = search.trim().length > 0 || category !== 'All'
  const displayedProducts = showAll || isFiltered
    ? filteredProducts
    : filteredProducts.slice(0, 18)

  const closeMenu = () => setMobileMenu(false)

  const jumpToCategory = targetCategory => {
    setCategory(targetCategory)
    setShowAll(false)
    const el = document.getElementById('collection')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className={`site-shell ${darkMode ? "dark" : ""}`}>
      <FloatingBakeryBackdrop />
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


        {/* FEATURED / BESTSELLERS */}
        <section className="featured section-pad" id="featured">
          <motion.div
            className="section-head"
            variants={revealUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
          >
            <div>
              <span className="kicker"><span className="kicker-line" />CROWD FAVOURITES</span>
              <h2>Our <em>bestsellers.</em></h2>
            </div>
            <p className="section-sub">
              Most loved items from the Royal kitchen — handpicked favourites of our customers.
            </p>
          </motion.div>

          <div className="featured-grid">
            {products.filter(p => p.featured).slice(0, 8).map((product, idx) => {
              const style = cardTint[product.category] || cardTint.Sweets
              return (
                <motion.article
                  key={product.id}
                  className="featured-card"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.06 }}
                  onClick={() => setSelectedProduct({ ...product, itemNumber: String(products.indexOf(product) + 1).padStart(2, '0'), style })}
                >
                  <div className="featured-thumb">
                    <img src={getProductThumb(product)} alt={product.name} loading="lazy" />
                  </div>
                  <div className="featured-info">
                    <span className="featured-cat">{product.category}</span>
                    <h3>{product.name}</h3>
                    <span className="featured-price">{product.menuPrice}</span>
                  </div>
                  <button
                    type="button"
                    className="card-add-btn"
                    onClick={e => {
                      e.stopPropagation()
                      addToTray(product)
                    }}
                  >
                    <Plus size={13} /> Add
                  </button>
                </motion.article>
              )
            })}
          </div>
        </section>


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
              <h2>Four collections, one <em>royal kitchen.</em></h2>
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
                    <img src={item.image} alt={item.title} loading="lazy" />
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

            <div className="price-filter">
              <span>Price:</span>
              {[
                { key: 'all', label: 'All' },
                { key: 'under100', label: 'Under ₹100' },
                { key: '100to300', label: '₹100–300' },
                { key: '300to600', label: '₹300–600' },
                { key: 'above600', label: 'Above ₹600' }
              ].map(item => (
                <button
                  key={item.key}
                  type="button"
                  className={priceRange === item.key ? 'price-pill active' : 'price-pill'}
                  onClick={() => { setPriceRange(item.key); setShowAll(false) }}
                >
                  {item.label}
                </button>
              ))}
            </div>

          </div>

          <div className="menu-list">
            {displayedProducts.length === 0 ? (
              <div className="menu-empty">
                <p>No items found. Try a different search or category.</p>
              </div>
            ) : (
              displayedProducts.map((product) => {
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
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <div className="menu-row-info">
                      <h3>{product.name}</h3>
                      <span className="menu-row-sub">
                        #{itemNumber} · {product.category}
                        {product.menuPrice && (
                          <span className="menu-price"> · {product.menuPrice}</span>
                        )}
                      </span>
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
              })
            )}
          </div>

          {!isFiltered && filteredProducts.length > 18 && (
            <div className="menu-expand-bar">
              <button
                type="button"
                className="menu-expand-btn"
                onClick={() => setShowAll(prev => !prev)}
              >
                {showAll
                  ? 'Show top 18 items'
                  : `Show all ${filteredProducts.length} items`}
              </button>
            </div>
          )}
        </section>

        {/* STORY SECTION */}
        <section className="story section-pad" id="story">
          <div className="story-layout">
            <motion.div
              className="story-text"
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <span className="kicker"><span className="kicker-line" />OUR CRAFT</span>
              <h2>Three generations of <em>sweet tradition.</em></h2>
              <p>
                Since 1967, Royal Bakery &amp; Sweets has been a landmark in Narsapur. What began as a small family kitchen has grown into a beloved destination for traditional mithai, celebration cakes, and everyday savoury favourites — still made with the same care and recipes that defined us from day one.
              </p>
              <div className="story-metrics">
                <div>
                  <strong>1967</strong>
                  <span>Year we first opened our doors</span>
                </div>
                <div>
                  <strong>121+</strong>
                  <span>Signature items in our collection</span>
                </div>
                <div>
                  <strong>Daily</strong>
                  <span>Fresh preparation of hot &amp; savoury items</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="story-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >
              <div className="story-card-inner">
                <span className="story-card-kicker">EST. 1967 · NARSAPUR</span>
                <h3>Made by hand.<br />Served with pride.</h3>
                <p>
                  Every barfi, every puff, every custom cake is prepared in our kitchen with pure ingredients and time-honoured methods.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* OCCASIONS SECTION */}
        <section className="occasions section-pad" id="occasions">
          <div className="occasions-box">
            <div className="occasions-glow" aria-hidden="true" />
            <div className="occasions-copy">
              <span className="kicker light"><span className="kicker-line" />CELEBRATIONS &amp; GIFTING</span>
              <h2>Make every moment <em>royal.</em></h2>
              <p>
                From birthday cakes and wedding mithai boxes to festive hampers and last-minute gifting — tell us the occasion and we’ll help you create something memorable.
              </p>
              <div className="occasions-list">
                <div className="occasion-item">
                  <strong>Custom Celebration Cakes</strong>
                  <span>Birthdays, anniversaries, milestones — designed to order</span>
                </div>
                <div className="occasion-item">
                  <strong>Festive &amp; Wedding Boxes</strong>
                  <span>Curated mithai assortments for sharing and gifting</span>
                </div>
                <div className="occasion-item">
                  <strong>Same-day Enquiry</strong>
                  <span>WhatsApp us and we’ll confirm availability quickly</span>
                </div>
              </div>
            </div>

            <OccasionBuilder />
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="contact section-pad" id="contact">
          <div className="contact-grid">
            <motion.div
              variants={revealUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
            >
              <span className="kicker"><span className="kicker-line" />VISIT US</span>
              <h2>Come taste the <em>difference.</em></h2>
              <p className="section-sub" style={{ maxWidth: 420 }}>
                We’re located at Panja Centre, Narsapur. Walk in for fresh sweets and savouries, or send an enquiry for custom orders.
              </p>
            </motion.div>

            <div className="contact-cards">
              <div className="info-card">
                <MapPin size={20} />
                <div>
                  <strong>Address</strong>
                  <span>Panja Centre, Narsapur, Andhra Pradesh</span>
                </div>
              </div>
              <div className="info-card">
                <Clock size={20} />
                <div>
                  <strong>Hours</strong>
                  <span>Open daily · 8:00 AM – 11:00 PM</span>
                </div>
              </div>
              <div className="info-card">
                <Phone size={20} />
                <div>
                  <strong>Enquire</strong>
                  <span>WhatsApp us via the Order Tray or Celebrations form above</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

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
                {selectedProduct.menuPrice && (
                  <p className="modal-price">{selectedProduct.menuPrice}</p>
                )}
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


      {/* DARK MODE TOGGLE */}
      <button
        type="button"
        className="theme-toggle"
        onClick={() => setDarkMode(d => !d)}
        aria-label="Toggle dark mode"
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

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
