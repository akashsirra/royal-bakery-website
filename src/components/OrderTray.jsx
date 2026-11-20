import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingBag,
  X,
  Plus,
  Minus,
  Trash2,
  Copy,
  Check,
  MessageCircle
} from 'lucide-react'

// Add official shop WhatsApp number with country code (e.g. '9198XXXXXXXX') once confirmed
const WHATSAPP_NUMBER = '919010925353'

const SWEET_WEIGHTS = ['250g', '500g', '1 kg']

export default function OrderTray({
  items,
  isOpen,
  setIsOpen,
  onUpdateQty,
  onUpdateUnit,
  onRemove,
  onClear
}) {
  const [customerNote, setCustomerNote] = useState('')
  const [copied, setCopied] = useState(false)

  const totalCount = items.reduce((sum, item) => sum + item.qty, 0)

  const buildOrderMessage = () => {
    const lines = [
      'Hello Royal Bakery & Sweets (Est. 1967),',
      'I would like to enquire about ordering the following items:',
      ''
    ]

    items.forEach((item, idx) => {
      const unitPart = item.unit ? ` (${item.unit})` : ''
      lines.push(`${idx + 1}. ${item.name}${unitPart} × ${item.qty}`)
    })

    if (customerNote.trim()) {
      lines.push('', `Note: ${customerNote.trim()}`)
    }

    lines.push('', 'Please confirm availability and pricing. Thank you!')
    return lines.join('\n')
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(buildOrderMessage())
    const base = WHATSAPP_NUMBER
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
      : `https://wa.me/?text=${text}`
    window.open(base, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildOrderMessage())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <>
      {/* FLOATING BOTTOM TRAY BAR */}
      <AnimatePresence>
        {totalCount > 0 && !isOpen && (
          <motion.div
            className="tray-floating-wrap"
            initial={{ y: 90, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 90, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <button
              type="button"
              className="tray-floating-bar"
              onClick={() => setIsOpen(true)}
            >
              <div className="tray-bar-left">
                <span className="tray-count-pill">{totalCount}</span>
                <div>
                  <strong>Your Order Tray</strong>
                  <small>
                    {items.length} {items.length === 1 ? 'selection' : 'selections'} ready for WhatsApp enquiry
                  </small>
                </div>
              </div>
              <span className="tray-bar-cta">
                View Tray <ShoppingBag size={15} />
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ORDER TRAY DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="tray-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.aside
              className="tray-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
              onClick={e => e.stopPropagation()}
              aria-label="Order enquiry tray"
            >
              <div className="tray-header">
                <div>
                  <span className="tray-kicker">ROYAL BAKERY &amp; SWEETS</span>
                  <h3>Order Enquiry Tray</h3>
                </div>
                <button
                  type="button"
                  className="tray-close"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close tray"
                >
                  <X size={18} />
                </button>
              </div>

              {items.length === 0 ? (
                <div className="tray-empty">
                  <ShoppingBag size={28} />
                  <p>Your tray is empty. Tap <strong>+ Add</strong> on any sweet or savoury item to build an enquiry.</p>
                </div>
              ) : (
                <>
                  <div className="tray-list">
                    {items.map(item => (
                      <div key={item.id} className="tray-item">
                        <div className="tray-item-top">
                          <div>
                            <span className="tray-item-cat">{item.category}</span>
                            <h4>{item.name}</h4>
                          </div>
                          <button
                            type="button"
                            className="tray-remove"
                            onClick={() => onRemove(item.id)}
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="tray-item-controls">
                          {item.category === 'Sweets' ? (
                            <div className="unit-pills">
                              {SWEET_WEIGHTS.map(weight => (
                                <button
                                  key={weight}
                                  type="button"
                                  className={item.unit === weight ? 'unit-pill active' : 'unit-pill'}
                                  onClick={() => onUpdateUnit(item.id, weight)}
                                >
                                  {weight}
                                </button>
                              ))}
                            </div>
                          ) : (
                            <span className="unit-label">Pack / Portion</span>
                          )}

                          <div className="qty-stepper">
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, -1)}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={13} />
                            </button>
                            <span>{item.qty}</span>
                            <button
                              type="button"
                              onClick={() => onUpdateQty(item.id, 1)}
                              aria-label="Increase quantity"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="tray-footer">
                    <label className="tray-note-field">
                      <span>Occasion or pickup note (optional)</span>
                      <input
                        type="text"
                        value={customerNote}
                        onChange={e => setCustomerNote(e.target.value)}
                        placeholder="e.g., Gift box packing, pickup at 6 PM..."
                      />
                    </label>

                    <div className="tray-actions">
                      <button
                        type="button"
                        className="btn btn-whatsapp"
                        onClick={handleWhatsApp}
                      >
                        <MessageCircle size={16} />
                        Send Enquiry on WhatsApp
                      </button>

                      <div className="tray-secondary-row">
                        <button
                          type="button"
                          className="btn btn-secondary tray-half-btn"
                          onClick={handleCopy}
                        >
                          {copied ? <Check size={14} /> : <Copy size={14} />}
                          {copied ? 'Copied!' : 'Copy list'}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary tray-half-btn"
                          onClick={onClear}
                        >
                          Clear tray
                        </button>
                      </div>
                    </div>

                    {!WHATSAPP_NUMBER && (
                      <p className="tray-hint">
                        Demo mode: opens WhatsApp with your formatted order list. Official shop number will be linked upon confirmation.
                      </p>
                    )}
                  </div>
                </>
              )}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
