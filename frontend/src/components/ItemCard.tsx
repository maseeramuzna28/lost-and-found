import { Item, imageUrl } from '../services/api'

interface Props {
  item: Item
  onView: (item: Item) => void
}

export default function ItemCard({ item, onView }: Props) {
  const src = imageUrl(item.image_url)

  return (
    <div className="item-card">
      {src ? (
        <img src={src} alt={item.title} className="item-card-img" />
      ) : (
        <div className="item-card-img-placeholder">📦</div>
      )}
      <div className="item-card-body">
        <div className="item-card-title">{item.title}</div>
        <div className="item-card-meta">
          <span className={`badge badge-${item.type.toLowerCase()}`}>{item.type}</span>
          <span className={`badge badge-${item.status.toLowerCase()}`}>{item.status}</span>
          {item.category && (
            <span className="badge" style={{ background: '#f1f5f9', color: '#475569' }}>
              {item.category}
            </span>
          )}
        </div>
        <div className="item-card-info">📍 {item.location}</div>
        <div className="item-card-info">📅 {new Date(item.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</div>
      </div>
      <div className="item-card-footer">
        <button className="btn btn-outline btn-full" onClick={() => onView(item)}>
          View Details
        </button>
      </div>
    </div>
  )
}
