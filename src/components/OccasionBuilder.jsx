import { useState } from 'react'
import { MessageCircle, Copy, Check, Sparkles } from 'lucide-react'

const WHATSAPP_NUMBER = '919010925353'

const ORDER_TYPES = [
  'Celebration Cake',
  'Premium Cake',
  'Pastry Box',
  'Festive Mithai Box'
]

const OCCASIONS = [
  'Birthday',
  'Wedding / Engagement',
  'Anniversary',
  'Festival / Gifting'
]

const CAKE_SIZES = ['0.5 kg', '1 kg', '2 kg+']
const BOX_SIZES = ['Assorted Box', 'Family Pack', 'Bulk Order']
const DIETARY = ['Eggless', 'Regular']

export default function OccasionBuilder() {
  const [orderType, setOrderType] = useState(ORDER_TYPES[0])
  const [occasion, setOccasion] = useState(OCCASIONS[0])
  const [size, setSize] = useState(CAKE_SIZES[1])
  const [diet, setDiet] = useState(DIETARY[0])
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  const isCake = orderType.includes('Cake')
  const sizeOptions = isCake ? CAKE_SIZES : BOX_SIZES

  const handleTypeChange = nextType => {
    setOrderType(nextType)
    const nextIsCake = nextType.includes('Cake')
    setSize(nextIsCake ? CAKE_SIZES[1] : BOX_SIZES[0])
  }

  const buildMessage = () => {
    const lines = [
      'Hello Royal Bakery & Sweets (Est. 1967),',
      'I would like to enquire about a custom celebration order:',
      '',
      `• Type: ${orderType}`,
      `• Occasion: ${occasion}`,
      `• Size / Pack: ${size}`
    ]

    if (isCake) {
      lines.push(`• Preference: ${diet}`)
    }

    if (note.trim()) {
      lines.push(`• Note: ${note.trim()}`)
    }

    lines.push('', 'Please share available flavours, designs, and pricing. Thank you!')
    return lines.join('\n')
  }

  const handleWhatsApp = () => {
    const text = encodeURIComponent(buildMessage())
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildMessage())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="builder-card">
      <div className="builder-head">
        <span className="builder-badge">
          <Sparkles size={12} /> 3-STEP CUSTOM ENQUIRY
        </span>
        <h3>Plan Your Order</h3>
      </div>

      <div className="builder-group">
        <span className="builder-label">1. Choose collection</span>
        <div className="builder-pills">
          {ORDER_TYPES.map(item => (
            <button
              key={item}
              type="button"
              className={orderType === item ? 'builder-pill active' : 'builder-pill'}
              onClick={() => handleTypeChange(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="builder-group">
        <span className="builder-label">2. Occasion</span>
        <div className="builder-pills">
          {OCCASIONS.map(item => (
            <button
              key={item}
              type="button"
              className={occasion === item ? 'builder-pill active' : 'builder-pill'}
              onClick={() => setOccasion(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="builder-row">
        <div className="builder-group">
          <span className="builder-label">3. {isCake ? 'Weight' : 'Pack size'}</span>
          <div className="builder-pills">
            {sizeOptions.map(item => (
              <button
                key={item}
                type="button"
                className={size === item ? 'builder-pill active' : 'builder-pill'}
                onClick={() => setSize(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {isCake && (
          <div className="builder-group">
            <span className="builder-label">Preference</span>
            <div className="builder-pills">
              {DIETARY.map(item => (
                <button
                  key={item}
                  type="button"
                  className={diet === item ? 'builder-pill active' : 'builder-pill'}
                  onClick={() => setDiet(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <label className="builder-note">
        <span>Flavour, theme, or date note (optional)</span>
        <input
          type="text"
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="e.g., Chocolate truffle, Sunday 5 PM..."
        />
      </label>

      <div className="builder-actions">
        <button type="button" className="btn btn-gold builder-main-btn" onClick={handleWhatsApp}>
          <MessageCircle size={16} /> Send Custom Enquiry on WhatsApp
        </button>
        <button type="button" className="builder-copy-btn" onClick={handleCopy} aria-label="Copy enquiry">
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
    </div>
  )
}
