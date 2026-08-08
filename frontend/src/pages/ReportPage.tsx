import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Item } from '../services/api'
import ItemForm from '../components/ItemForm'

export default function ReportPage() {
  const navigate = useNavigate()
  const [success, setSuccess] = useState(false)
  const [createdItem, setCreatedItem] = useState<Item | null>(null)

  function handleSuccess(item: Item) {
    setCreatedItem(item)
    setSuccess(true)
    setTimeout(() => navigate('/'), 2000)
  }

  if (success && createdItem) {
    return (
      <div className="form-page">
        <div className="alert alert-success" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>✅</div>
          <strong>"{createdItem.title}" reported successfully!</strong>
          <p style={{ marginTop: '6px', fontSize: '0.875rem' }}>Redirecting to the board...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="form-page">
      <h1>Report an Item</h1>
      <ItemForm
        onSuccess={handleSuccess}
        onCancel={() => navigate('/')}
      />
    </div>
  )
}
