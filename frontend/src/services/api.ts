const BASE_URL = 'https://lost-and-found-2-u1zo.onrender.com/api'

export interface Item {
  id: number
  title: string
  type: 'LOST' | 'FOUND'
  category: string | null
  description: string
  location: string
  date: string
  image_url: string | null
  contact: string
  status: 'OPEN' | 'CLAIMED'
  created_at: string | null
}

export interface ItemFilters {
  search?: string
  type?: string
  category?: string
  status?: string
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let msg = `Request failed: ${res.status}`
    try {
      const data = await res.json()
      msg = data.detail || msg
    } catch {
      // ignore
    }
    throw new Error(msg)
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  const params = new URLSearchParams()
  if (filters.search) params.set('search', filters.search)
  if (filters.type) params.set('type', filters.type)
  if (filters.category) params.set('category', filters.category)
  if (filters.status) params.set('status', filters.status)
  const res = await fetch(`${BASE_URL}/items?${params.toString()}`)
  return handleResponse<Item[]>(res)
}

export async function getItem(id: number): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items/${id}`)
  return handleResponse<Item>(res)
}

export async function createItem(formData: FormData): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items`, {
    method: 'POST',
    body: formData,
  })
  return handleResponse<Item>(res)
}

export async function updateItem(id: number, formData: FormData): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items/${id}`, {
    method: 'PUT',
    body: formData,
  })
  return handleResponse<Item>(res)
}

export async function deleteItem(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/items/${id}`, { method: 'DELETE' })
  return handleResponse<void>(res)
}

export async function claimItem(id: number): Promise<Item> {
  const res = await fetch(`${BASE_URL}/items/${id}/claim`, { method: 'PATCH' })
  return handleResponse<Item>(res)
}

export function imageUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined
  return `https://lost-and-found-2-u1zo.onrender.com${path}`
}

