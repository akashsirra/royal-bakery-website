import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  ArrowUpRight,
  CakeSlice,
  Check,
  ChevronDown,
  Clock3,
  Gift,
  Instagram,
  MapPin,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X
} from 'lucide-react'
import { products } from './products'
import CakeIntro from './components/CakeIntro'
import OccasionBuilder from './components/OccasionBuilder'
import './App.css'

const WHATSAPP_NUMBER = '919010925353'

const categories = ['All', 'Sweets', 'Namkeen', 'Hot', 'Bakery', 'Desserts', 'Beverages']

const collections = [
  {
    title: 'Traditional sweets',
    subtitle: 'A little piece of heritage',
    category: 'Sweets',
    image: '/showcase/sweets.jpg',
    number: '01'
  },
  {
    title: 'Savoury favourites',
    subtitle: 'Made for the in-between moments',
    category: 'Namkeen',
    image: '/showcase/hot.jpg',
    number: '02'
  },
  {
    title: 'Cakes & bakes',
    subtitle: 'For moments worth celebrating',
    category: 'Bakery',
    image: '/showcase/pastries.jpg',
    number: '03'
  }
]

function productImage(product) {
  if (product.category === 'Namkeen' || product.category === 'Hot') return '/showcase/hot.jpg'
  if (product.category === 'Bakery' || product.category === 'Desserts') return '/showcase/pastries.jpg'
  return '/showcase/sweets.jpg'
}

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [category, setCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [tray, setTray] = useState([])
  const [trayOpen, setTrayOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase()
    return products.filter(product => {
      const categoryMatch = category === 'All' || product.category === category
      const searchMatch = !query || product.name.toLowerCase().includes(query)
      return categoryMatch && searchMatch
    })
  }, [category, search])

  const visibleProducts = showAll || search.trim() || category !== 'All'
    ? filteredProducts
    : filteredProducts.slice(0, 12)

  const addToTray = product => {
    setTray(current => {
      const found = current.find(item => item.id === product.id)
      if (found) {
        return current.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...current, {
        id: product.id,
        name: product.name,
        category: product.category,
        unit: product.unit || '',
        menuPrice: product.menuPrice || '',
        qty: 1
      }]
    })
  }

  const updateQuantity = (id, amount) => {
    setTray(current => current
      .map(item => item.id === id ? { ...item, qty: item.qty + amount } : item)
      .filter(item => item.qty > 0))
  }

  const removeFromTray = id => setTray(current => current.filter(item => item.id !== id))

  const buildOrderMessage = () => {
    const lines = [
      'Hello Royal Bakery & Sweets,',
      'I would like to enquire about these items:',
      ''
    ]
    tray.forEach((item, index) => {
      const unit = item.unit ? ' (' + item.unit + ')' : ''
      const price = item.menuPrice ? ' — ' + item.menuPrice : ''
      lines.push((index + 1) + '. ' + item.name + unit + ' × ' + item.qty + price)
    })
    lines.push('', 'Please confirm availability and the final price. Thank you!')
    return lines.join('\n')
  }

  const sendOrder = () => {
    if (!tray.length) return
    const url = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(buildOrderMessage())
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const jumpToCategory = nextCategory => {
    setCategory(nextCategory)
    setSearch('')
    setShowAll(true)
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="site-shell">
      <div className="announcement">
        <Sparkles size={13} />
        <span>A LITTLE JOY IN EVERY BITE</span>
        <span className="announcement-divider">✦</span>
        <span>ROYAL BAKERY &amp; SWEETS · EST. 1967</span>
      </div>

      <header className="site-header">
        <a className="brand" href="#home" onClick={closeMobileMenu} aria-label="Royal Bakery & Sweets home">
          <img src="/royal-logo.png" alt="" />
          <span>
            <strong>ROYAL</strong>
            <small>BAKERY &amp; SWEETS</small>
          </span>
        </a>

        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(value => !value)}
          aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>

        <nav className={mobileMenuOpen ? 'main-nav nav-open' : 'main-nav'} aria-label="Main navigation">
          <a href="#collections" onClick={closeMobileMenu}>Collections</a>
          <a href="#menu" onClick={closeMobileMenu}>Our menu</a>
          <a href="#story" onClick={closeMobileMenu}>Our story</a>
          <a href="#celebrations" onClick={closeMobileMenu}>Celebrations</a>
          <a className="nav-contact" href="#contact" onClick={closeMobileMenu}>
            Visit us <ArrowUpRight size={15} />
          </a>
        </nav>
      </header>

      <main>
        <section className="editorial-hero" id="home">
          <div className="hero-copy">
            <span className="eyebrow"><span /> A NARSAPUR ORIGINAL · SINCE 1967</span>
            <h1>Made for the<br /><em>moments</em> that matter.</h1>
            <p>From time-honoured Indian sweets to freshly baked favourites, discover something special in every visit.</p>
            <div className="hero-actions">
              <a className="button button-dark" href="#collections">Explore our collections <ArrowRight size={16} /></a>
              <a className="text-link" href="#story">A little about us <ArrowRight size={15} /></a>
            </div>
            <div className="hero-footnote">
              <span className="hero-star">✳</span>
              <span>Thoughtfully made.<br />Happily shared.</span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-image-main">
              <img src="/showcase/pastries.jpg" alt="Freshly prepared bakery treats" fetchPriority="high" />
            </div>
            <div className="hero-image-small">
              <img src="/showcase/sweets.jpg" alt="Traditional Indian sweets" />
            </div>
            <div className="hero-note">
              <span>THE ROYAL<br />COLLECTION</span>
              <span className="hero-note-mark">✦</span>
            </div>
            <span className="hero-image-caption">A taste of tradition, made for today.</span>
          </div>
          <div className="hero-side-label">GOOD THINGS ARE MADE TO BE SHARED</div>
        </section>

        <div className="marquee" aria-label="Our specialities">
          <div className="marquee-track">
            {[0, 1].map(copy => (
              <span key={copy}>
                <span>TRADITIONAL MITHAI</span><i>✳</i>
                <span>FRESHLY BAKED</span><i>✳</i>
                <span>CELEBRATION CAKES</span><i>✳</i>
                <span>EVERYDAY FAVOURITES</span><i>✳</i>
              </span>
            ))}
          </div>
        </div>

        <section className="collections-section section-wrap" id="collections">
          <div className="section-intro">
            <div>
              <span className="eyebrow"><span /> SOMETHING FOR EVERY CRAVING</span>
              <h2>A collection to<br /><em>come back to.</em></h2>
            </div>
            <p>Explore the flavours that make everyday moments feel a little more special.</p>
          </div>

          <div className="collection-grid">
            {collections.map((item, index) => (
              <motion.button
                type="button"
                className={'collection-card collection-card-' + (index + 1)}
                key={item.category}
                onClick={() => jumpToCategory(item.category)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="collection-image">
                  <img src={item.image} alt={item.title} loading="lazy" />
                  <span className="collection-number">{item.number}</span>
                  <span className="collection-arrow"><ArrowUpRight size={19} /></span>
                </div>
                <div className="collection-caption">
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.subtitle}</p>
                  </div>
                  <span className="collection-explore">EXPLORE</span>
                </div>
              </motion.button>
            ))}
          </div>
        </section>

        <section className="menu-section section-wrap" id="menu">
          <div className="menu-heading">
            <div>
              <span className="eyebrow"><span /> FROM OUR COUNTER</span>
              <h2>Find your <em>favourite.</em></h2>
              <p>Browse the menu and send us an enquiry for the items you love.</p>
            </div>
            <div className="menu-total"><strong>{products.length}</strong><span>MENU<br />ITEMS</span></div>
          </div>

          <div className="menu-toolbar">
            <div className="category-list" aria-label="Filter by category">
              {categories.map(item => (
                <button
                  type="button"
                  key={item}
                  className={category === item ? 'category-chip active' : 'category-chip'}
                  onClick={() => { setCategory(item); setShowAll(false) }}
                >
                  {item}
                  <span>{item === 'All' ? products.length : products.filter(product => product.category === item).length}</span>
                </button>
              ))}
            </div>
            <label className="menu-search">
              <Search size={17} />
              <input
                type="search"
                value={search}
                onChange={event => { setSearch(event.target.value); setShowAll(false) }}
                placeholder="Search the menu"
                aria-label="Search the menu"
              />
              {search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}
            </label>
          </div>

          <div className="menu-result-line">
            <span>{filteredProducts.length} {filteredProducts.length === 1 ? 'item' : 'items'} {category === 'All' ? 'in the collection' : 'in ' + category}</span>
            <span>Prices shown as listed on the menu</span>
          </div>

          <div className="product-grid">
            {visibleProducts.map((product, index) => {
              const inTray = tray.find(item => item.id === product.id)
              return (
                <article className="product-card" key={product.id}>
                  <button type="button" className="product-image" onClick={() => setSelectedProduct(product)} aria-label={'View ' + product.name}>
                    <img src={productImage(product)} alt="" loading="lazy" />
                    <span className="product-index">{String(products.indexOf(product) + 1).padStart(3, '0')}</span>
                  </button>
                  <div className="product-details">
                    <span className="product-category">{product.category}</span>
                    <button type="button" className="product-name" onClick={() => setSelectedProduct(product)}>{product.name}</button>
                    <div className="product-bottom">
                      <span className="product-price">{product.menuPrice || 'Ask in store'}</span>
                      <button
                        type="button"
                        className={inTray ? 'add-button is-added' : 'add-button'}
                        onClick={() => addToTray(product)}
                        aria-label={inTray ? 'Add another ' + product.name : 'Add ' + product.name + ' to enquiry'}
                      >
                        {inTray ? <><Check size={14} /> {inTray.qty}</> : <><Plus size={14} /> Add</>}
                      </button>
                    </div>
                  </div>
                </article>
              )
            })}
          </div>

          {!visibleProducts.length && (
            <div className="empty-results">
              <Search size={24} />
              <h3>No matching items</h3>
              <p>Try another name or choose a different category.</p>
              <button type="button" onClick={() => { setSearch(''); setCategory('All') }}>Clear filters</button>
            </div>
          )}

          {!search.trim() && category === 'All' && filteredProducts.length > 12 && (
            <div className="show-more-wrap">
              <button type="button" className="button button-outline" onClick={() => setShowAll(value => !value)}>
                {showAll ? 'Show fewer items' : 'View all ' + filteredProducts.length + ' items'}
                <ChevronDown size={16} className={showAll ? 'chevron-up' : ''} />
              </button>
            </div>
          )}
        </section>

        <section className="story-section" id="story">
          <div className="story-image">
            <img src="/showcase/sweets.jpg" alt="Traditional sweets from Royal Bakery & Sweets" loading="lazy" />
            <span className="story-image-stamp">EST.<br /><strong>1967</strong></span>
          </div>
          <div className="story-copy">
            <span className="eyebrow"><span /> ROOTED IN NARSAPUR</span>
            <h2>Some things are<br />worth <em>keeping</em><br />the same.</h2>
            <p>Since 1967, Royal Bakery &amp; Sweets has been part of the everyday celebrations and shared moments of Narsapur. Our collection brings together traditional sweets, savoury favourites and bakery treats — a little something for every occasion.</p>
            <a className="text-link" href="#contact">Come say hello <ArrowRight size={15} /></a>
            <div className="story-signoff">ROYAL BAKERY <span>✳</span> NARSAPUR</div>
          </div>
        </section>

        <section className="celebrations-section section-wrap" id="celebrations">
          <div className="celebrations-copy">
            <span className="eyebrow"><span /> FOR YOUR SPECIAL DAYS</span>
            <h2>Make room for<br /><em>something lovely.</em></h2>
            <p>Planning a birthday, a family gathering or a festive gift? Tell us what you have in mind and start a conversation with our team.</p>
            <div className="celebration-points">
              <span><CakeSlice size={17} /> Celebration cakes</span>
              <span><Gift size={17} /> Mithai &amp; gifting boxes</span>
              <span><Sparkles size={17} /> Special occasions</span>
            </div>
          </div>
          <div className="occasion-builder-wrap">
            <OccasionBuilder />
          </div>
        </section>

        <section className="visit-section section-wrap" id="contact">
          <div className="visit-heading">
            <span className="eyebrow"><span /> FIND YOUR WAY TO US</span>
            <h2>We’d love to<br /><em>see you.</em></h2>
          </div>
          <div className="visit-details">
            <div className="visit-card">
              <MapPin size={20} />
              <div><span>FIND US</span><strong>Panja Centre, Narsapur</strong><p>Andhra Pradesh, India</p></div>
            </div>
            <div className="visit-card">
              <Clock3 size={20} />
              <div><span>DROP BY</span><strong>Visit our store</strong><p>Ask in store for today’s availability.</p></div>
            </div>
            <div className="visit-card">
              <Instagram size={20} />
              <div><span>FOLLOW ALONG</span><strong>@royalbakery_1967</strong><a href="https://www.instagram.com/royalbakery_1967" target="_blank" rel="noreferrer">Find us on Instagram <ArrowUpRight size={13} /></a></div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#home">
          <img src="/royal-logo.png" alt="" />
          <span><strong>ROYAL</strong><small>BAKERY &amp; SWEETS</small></span>
        </a>
        <p>A little joy in every bite. <span>Since 1967.</span></p>
        <a href="#home">BACK TO TOP ↑</a>
        <small className="copyright">© {new Date().getFullYear()} Royal Bakery &amp; Sweets · Narsapur</small>
      </footer>

      <AnimatePresence>
        {showIntro && <CakeIntro onComplete={() => setShowIntro(false)} />}
      </AnimatePresence>

      {!showIntro && (
        <button
          type="button"
          className="replay-cake-btn"
          onClick={() => setShowIntro(true)}
          aria-label="Replay cake cutting introduction"
          title="Replay cake cutting"
        >
          🎂
        </button>
      )}

      <AnimatePresence>
        {tray.length > 0 && !trayOpen && (
          <motion.button
            type="button"
            className="tray-float"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            onClick={() => setTrayOpen(true)}
          >
            <span className="tray-float-icon"><ShoppingBag size={18} /><b>{tray.reduce((sum, item) => sum + item.qty, 0)}</b></span>
            <span><strong>Your enquiry</strong><small>{tray.length} selected {tray.length === 1 ? 'item' : 'items'}</small></span>
            <span className="tray-float-cta">Review <ArrowRight size={15} /></span>
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {trayOpen && (
          <motion.div className="drawer-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setTrayOpen(false)}>
            <motion.aside
              className="order-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              onClick={event => event.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Your enquiry"
            >
              <div className="drawer-head">
                <div><span className="eyebrow"><span /> YOUR SELECTION</span><h2>Enquiry list</h2></div>
                <button type="button" className="icon-button" onClick={() => setTrayOpen(false)} aria-label="Close enquiry"><X size={19} /></button>
              </div>
              <div className="drawer-items">
                {tray.map(item => (
                  <div className="drawer-item" key={item.id}>
                    <div className="drawer-item-copy"><span>{item.category}</span><strong>{item.name}</strong><small>{item.menuPrice || 'Price on enquiry'}{item.unit ? ' · ' + item.unit : ''}</small></div>
                    <div className="quantity-control">
                      <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={'Remove one ' + item.name}><Minus size={13} /></button>
                      <b>{item.qty}</b>
                      <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={'Add one ' + item.name}><Plus size={13} /></button>
                    </div>
                    <button type="button" className="remove-item" onClick={() => removeFromTray(item.id)} aria-label={'Remove ' + item.name}><X size={15} /></button>
                  </div>
                ))}
              </div>
              <div className="drawer-footer">
                <p>We’ll confirm availability and final pricing when you send your enquiry.</p>
                <button type="button" className="button button-dark drawer-send" onClick={sendOrder}>Continue on WhatsApp <ArrowUpRight size={16} /></button>
                <button type="button" className="drawer-clear" onClick={() => setTray([])}>Clear selection</button>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProduct && (
          <motion.div className="product-modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProduct(null)}>
            <motion.div className="product-modal" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12 }} onClick={event => event.stopPropagation()} role="dialog" aria-modal="true" aria-label={selectedProduct.name}>
              <button type="button" className="icon-button modal-close" onClick={() => setSelectedProduct(null)} aria-label="Close product details"><X size={18} /></button>
              <img src={productImage(selectedProduct)} alt="" />
              <div className="product-modal-copy">
                <span className="product-category">{selectedProduct.category}</span>
                <h2>{selectedProduct.name}</h2>
                <strong>{selectedProduct.menuPrice || 'Ask in store'}</strong>
                <p>Ask our team about availability and ordering.</p>
                <button type="button" className="button button-dark" onClick={() => { addToTray(selectedProduct); setSelectedProduct(null); setTrayOpen(true) }}>Add to enquiry <Plus size={15} /></button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
