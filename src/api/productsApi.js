const BASE_URL = 'https://fakestoreapi.com'

export async function fetchProducts() {
  const response = await fetch(`${BASE_URL}/products`)
  if (!response.ok) {
    throw new Error(`Failed to fetch products (HTTP ${response.status})`)
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function fetchCategories() {
  const response = await fetch(`${BASE_URL}/products/categories`)
  if (!response.ok) {
    throw new Error(`Failed to fetch categories (HTTP ${response.status})`)
  }
  const data = await response.json()
  return Array.isArray(data) ? data : []
}

export async function fetchProductById(id) {
  const response = await fetch(`${BASE_URL}/products/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch product details (HTTP ${response.status})`)
  }
  const text = await response.text()
  if (!text) {
    throw new Error('Product not found')
  }
  const data = JSON.parse(text)
  if (!data || !data.id) {
    throw new Error('Product not found')
  }
  return data
}

export function formatCategory(category = '') {
  return String(category)
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function formatPrice(amount = 0) {
  return `$${Number(amount || 0).toFixed(2)}`
}
