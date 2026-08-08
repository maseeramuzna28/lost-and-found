import { useState, useEffect, useCallback } from 'react'
import { Item, getItems } from '../services/api'
import ItemCard from '../components/ItemCard'
import ItemModal from '../components/ItemModal'
import ItemForm from '../components/ItemForm'

const CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Books', 'Keys', 'Bag', 'ID/Cards', 'Other']

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const [selectedItem, setSelectedItem] = useState<Item | null>(null)
  const [editItem, setEditItem] = useState<Item | null>(null)

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const data = await getItems({
        search: search || undefined,
        type: typeFilter || undefined,
        category: categoryFilter || undefined,
        status: statusFilter || undefined,
      })
      setItems(data)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load items. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }, [search, typeFilter, categoryFilter, statusFilter])

  useEffect(() => {
    const t = setTimeout(() => fetchItems(), 300)
    return () => clearTimeout(t)
  }, [fetchItems])

  function handleClaimed(updated: Item) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setSelectedItem(updated)
  }

  function handleDeleted(id: number) {
    setItems((prev) => prev.filter((i) => i.id !== id))
    setSelectedItem(null)
  }

  function handleEditSuccess(updated: Item) {
    setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
    setEditItem(null)
    setSelectedItem(updated)
  }

  function openEdit(item: Item) {
    setSelectedItem(null)
    setEditItem(item)
  }

  return (
    <div className="container">
      <div className="page-header">
        <h1>Lost &amp; Found Board</h1>
        <p>Browse reported items or use filters to find yours.</p>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <option value="">All Types</option>
          <option value="LOST">Lost</option>
          <option value="FOUND">Found</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="CLAIMED">Claimed</option>
        </select>
      </div>

      {/* Error */}
      {error && <div className="alert alert-error">{error}</div>}

      {/* Grid */}
      {loading ? (
        <div className="spinner">Loading items...</div>
      ) : items.length === 0 ? (
        <div className="empty-state">
          <h3>No items found</h3>
          <p>Try adjusting your filters or report a new item.</p>
        </div>
      ) : (
        <div className="items-grid">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onView={setSelectedItem} />
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selectedItem && (
        <ItemModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          onClaimed={handleClaimed}
          onDeleted={handleDeleted}
          onEdit={openEdit}
        />
      )}

      {/* Edit modal */}
      {editItem && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setEditItem(null)}>
          <div className="modal">
            <div className="modal-header">
              <h2>Edit Item</h2>
              <button className="modal-close" onClick={() => setEditItem(null)} aria-label="Close">✕</button>
            </div>
            <div className="modal-body">
              <ItemForm
                item={editItem}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditItem(null)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
