import { useState, useEffect, useRef } from 'react'
import { Item, createItem, updateItem, imageUrl } from '../services/api'

const CATEGORIES = ['Electronics', 'Clothing', 'Accessories', 'Books', 'Keys', 'Bag', 'ID/Cards', 'Other']

interface Props {
  item?: Item        // if provided, we're editing
  onSuccess: (item: Item) => void
  onCancel: () => void
}

interface FormErrors {
  title?: string
  type?: string
  description?: string
  location?: string
  date?: string
  contact?: string
}

export default function ItemForm({ item, onSuccess, onCancel }: Props) {
  const isEdit = !!item
  const [title, setTitle] = useState(item?.title ?? '')
  const [type, setType] = useState<'LOST' | 'FOUND'>(item?.type ?? 'LOST')
  const [category, setCategory] = useState(item?.category ?? '')
  const [description, setDescription] = useState(item?.description ?? '')
  const [location, setLocation] = useState(item?.location ?? '')
  const [date, setDate] = useState(item?.date ?? new Date().toISOString().split('T')[0])
  const [contact, setContact] = useState(item?.contact ?? '')
  const [status, setStatus] = useState<'OPEN' | 'CLAIMED'>(item?.status ?? 'OPEN')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(item?.image_url ? imageUrl(item.image_url) ?? null : null)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [loading, setLoading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile)
      setImagePreview(url)
      return () => URL.revokeObjectURL(url)
    }
  }, [imageFile])

  function validate(): boolean {
    const e: FormErrors = {}
    if (!title.trim()) e.title = 'Item name is required'
    if (!type) e.type = 'Type is required'
    if (!description.trim()) e.description = 'Description is required'
    if (!location.trim()) e.location = 'Location is required'
    if (!date) e.date = 'Date is required'
    if (!contact.trim()) e.contact = 'Contact information is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setSubmitError('')

    const fd = new FormData()
    fd.append('title', title.trim())
    fd.append('type', type)
    fd.append('category', category)
    fd.append('description', description.trim())
    fd.append('location', location.trim())
    fd.append('date', date)
    fd.append('contact', contact.trim())
    fd.append('status', status)
    if (imageFile) fd.append('image', imageFile)

    try {
      const result = isEdit
        ? await updateItem(item!.id, fd)
        : await createItem(fd)
      onSuccess(result)
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Submission failed. Check backend connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="form-card">

        {submitError && <div className="alert alert-error">{submitError}</div>}

        {/* Title */}
        <div className="form-group">
          <label htmlFor="title">Item Name *</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Black Wallet"
          />
          {errors.title && <span className="field-error">{errors.title}</span>}
        </div>

        <div className="form-row">
          {/* Type */}
          <div className="form-group">
            <label htmlFor="type">Type *</label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as 'LOST' | 'FOUND')}>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
            {errors.type && <span className="field-error">{errors.type}</span>}
          </div>

          {/* Category */}
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">— Select —</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the item, colour, brand, distinguishing features..."
          />
          {errors.description && <span className="field-error">{errors.description}</span>}
        </div>

        <div className="form-row">
          {/* Location */}
          <div className="form-group">
            <label htmlFor="location">Location *</label>
            <input
              id="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Main Canteen"
            />
            {errors.location && <span className="field-error">{errors.location}</span>}
          </div>

          {/* Date */}
          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            {errors.date && <span className="field-error">{errors.date}</span>}
          </div>
        </div>

        {/* Contact */}
        <div className="form-group">
          <label htmlFor="contact">Contact Information *</label>
          <input
            id="contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Phone, email or WhatsApp number"
          />
          {errors.contact && <span className="field-error">{errors.contact}</span>}
        </div>

        {/* Status (edit only) */}
        {isEdit && (
          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select id="status" value={status} onChange={(e) => setStatus(e.target.value as 'OPEN' | 'CLAIMED')}>
              <option value="OPEN">Open</option>
              <option value="CLAIMED">Claimed</option>
            </select>
          </div>
        )}

        {/* Image */}
        <div className="form-group">
          <label>Image</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          />
          {imagePreview && (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
            </div>
          )}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-outline" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Submit Report'}
          </button>
        </div>

      </div>
    </form>
  )
}
