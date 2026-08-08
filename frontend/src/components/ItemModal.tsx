import { useState } from 'react'
import { Item, claimItem, deleteItem, imageUrl } from '../services/api'

interface Props {
  item: Item
  onClose: () => void
  onClaimed: (updated: Item) => void
  onDeleted: (id: number) => void
  onEdit: (item: Item) => void
}

export default function ItemModal({ item, onClose, onClaimed, onDeleted, onEdit }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const src = imageUrl(item.image_url)

  async function handleClaim() {
    if (!confirm('Mark this item as CLAIMED?')) return
    setLoading(true)
    setError('')
    try {
      const updated = await claimItem(item.id)
      onClaimed(updated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to update status')
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this item? This cannot be undone.')) return
    setLoading(true)
    setError('')
    try {
      await deleteItem(item.id)
      onDeleted(item.id)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to delete item')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2>{item.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          {src ? (
            <img src={src} alt={item.title} className="modal-img" />
          ) : (
            <div className="modal-img-placeholder">📦</div>
          )}

          <div className="modal-meta">
            <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
            <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
            {item.category && (
              <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
                {item.category}
              </span>
            )}
          </div>

          <div className="detail-row">
            <span className="detail-label">Description</span>
            <span className="detail-value">{item.description}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="detail-row">
              <span className="detail-label">Location</span>
              <span className="detail-value">📍 {item.location}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Date</span>
              <span className="detail-value">
                📅 {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          <div className="detail-row">
            <span className="detail-label">Contact</span>
            <span className="detail-value">{item.contact}</span>
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          <div className="modal-actions">
            {item.status === 'OPEN' && (
              <button
                className="btn btn-success"
                onClick={handleClaim}
                disabled={loading}
              >
                ✓ Mark as Claimed
              </button>
            )}
            <button
              className="btn btn-outline"
              onClick={() => onEdit(item)}
              disabled={loading}
            >
              ✏️ Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={handleDelete}
              disabled={loading}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
