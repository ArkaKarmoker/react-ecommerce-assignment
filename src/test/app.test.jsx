import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { createAppStore } from '../store/store'

const mockProducts = [
  {
    id: 1,
    title: 'Fjallraven Backpack',
    price: 109.95,
    category: "men's clothing",
    description: 'Durable everyday laptop backpack.',
    image: 'https://fakestoreapi.com/img/1.jpg',
    rating: { rate: 4.5, count: 120 },
  },
  {
    id: 2,
    title: 'Gold Petite Micropave Ring',
    price: 168.0,
    category: 'jewelery',
    description: 'Solid gold micropave diamond ring.',
    image: 'https://fakestoreapi.com/img/2.jpg',
    rating: { rate: 4.8, count: 75 },
  },
  {
    id: 3,
    title: 'WD Portable External SSD',
    price: 64.0,
    category: 'electronics',
    description: 'Fast USB 3.0 portable storage drive.',
    image: 'https://fakestoreapi.com/img/3.jpg',
    rating: { rate: 4.2, count: 200 },
  },
]

const mockCategories = ["men's clothing", 'jewelery', 'electronics']

function renderApp(initialEntries = ['/'], preloadedState) {
  const store = createAppStore(
    preloadedState || {
      cart: { items: [] },
      wishlist: { items: [] },
    }
  )

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={initialEntries}>
          <App />
        </MemoryRouter>
      </Provider>
    ),
  }
}

describe('E-Commerce Application Integration Tests', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal(
      'fetch',
      vi.fn(async (url) => {
        const urlStr = String(url)
        if (urlStr.endsWith('/products/categories')) {
          return {
            ok: true,
            status: 200,
            json: async () => mockCategories,
          }
        }
        if (urlStr.match(/\/products\/\d+$/)) {
          const id = Number(urlStr.split('/').pop())
          const found = mockProducts.find((p) => p.id === id)
          return {
            ok: Boolean(found),
            status: found ? 200 : 404,
            text: async () => (found ? JSON.stringify(found) : ''),
          }
        }
        if (urlStr.endsWith('/products')) {
          return {
            ok: true,
            status: 200,
            json: async () => mockProducts,
          }
        }
        return { ok: false, status: 404 }
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('renders Home page, fetches products, and supports search, category filter, and price sort', async () => {
    const user = userEvent.setup()
    renderApp(['/'])

    // Shows loading indicator initially
    expect(screen.getByRole('status')).toBeInTheDocument()

    // Products load and display name, price, category, and Add to Cart button
    expect(await screen.findByText('Fjallraven Backpack')).toBeInTheDocument()
    expect(screen.getByText('Gold Petite Micropave Ring')).toBeInTheDocument()
    expect(screen.getByText('WD Portable External SSD')).toBeInTheDocument()

    // Search by product name
    const searchInput = screen.getByPlaceholderText(
      /search products by name/i
    )
    await user.type(searchInput, 'SSD')
    expect(screen.getByText('WD Portable External SSD')).toBeInTheDocument()
    expect(screen.queryByText('Fjallraven Backpack')).not.toBeInTheDocument()

    // Clear search
    await user.clear(searchInput)
    expect(screen.getByText('Fjallraven Backpack')).toBeInTheDocument()

    // Filter by category using modern custom dropdown
    const categoryTrigger = screen.getByRole('button', {
      name: /filter by category/i,
    })
    await user.click(categoryTrigger)
    await user.click(screen.getByRole('option', { name: 'Jewelery' }))
    expect(screen.getByText('Gold Petite Micropave Ring')).toBeInTheDocument()
    expect(
      screen.queryByText('WD Portable External SSD')
    ).not.toBeInTheDocument()

    // Reset back to All Categories and test price sorting (Low to High & High to Low)
    await user.click(categoryTrigger)
    await user.click(screen.getByRole('option', { name: 'All Categories' }))

    const sortTrigger = screen.getByRole('button', { name: /sort by price/i })
    await user.click(sortTrigger)
    await user.click(
      screen.getByRole('option', { name: 'Price: Low to High' })
    )
    let cards = screen.getAllByTestId(/product-card-/)
    expect(cards[0]).toHaveAttribute('data-testid', 'product-card-3') // $64.00
    expect(cards[1]).toHaveAttribute('data-testid', 'product-card-1') // $109.95
    expect(cards[2]).toHaveAttribute('data-testid', 'product-card-2') // $168.00

    await user.click(sortTrigger)
    await user.click(
      screen.getByRole('option', { name: 'Price: High to Low' })
    )
    cards = screen.getAllByTestId(/product-card-/)
    expect(cards[0]).toHaveAttribute('data-testid', 'product-card-2') // $168.00
    expect(cards[2]).toHaveAttribute('data-testid', 'product-card-3') // $64.00
  })

  it('handles API errors gracefully and retries on button click', async () => {
    const user = userEvent.setup()
    let callCount = 0
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => {
        callCount += 1
        if (callCount <= 2) {
          return { ok: false, status: 500 }
        }
        return {
          ok: true,
          status: 200,
          json: async () => mockProducts,
        }
      })
    )

    renderApp(['/'])

    expect(await screen.findByRole('alert')).toBeInTheDocument()
    expect(screen.getByText(/could not load products/i)).toBeInTheDocument()

    const retryButton = screen.getByRole('button', { name: /try again/i })
    await user.click(retryButton)

    expect(await screen.findByText('Fjallraven Backpack')).toBeInTheDocument()
  })

  it('displays Product Details page, selects quantity without mutating cart, and adds selected quantity on Add to Cart click', async () => {
    const user = userEvent.setup()
    renderApp(['/product/2'])

    expect(
      await screen.findByRole('heading', {
        name: /gold petite micropave ring/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/solid gold micropave diamond ring/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('details-product-price')).toHaveTextContent(
      '$168.00'
    )

    // Initially cart count is 0 and quantity selector starts at 1
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0')
    expect(screen.getByTestId('selected-quantity')).toHaveTextContent('1')

    // Increasing quantity via + button updates selector only (does NOT add to cart yet)
    const increaseBtn = screen.getByRole('button', {
      name: /increase selected quantity/i,
    })
    await user.click(increaseBtn)
    await user.click(increaseBtn)
    expect(screen.getByTestId('selected-quantity')).toHaveTextContent('3')
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0')

    // Decreasing quantity via - button updates selector to 2
    const decreaseBtn = screen.getByRole('button', {
      name: /decrease selected quantity/i,
    })
    await user.click(decreaseBtn)
    expect(screen.getByTestId('selected-quantity')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0')

    // Click Add to Cart -> adds the exact selected quantity (2) to Redux cart and resets selector to 1
    await user.click(screen.getByRole('button', { name: /add to cart/i }))
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('2')
    expect(screen.getByTestId('selected-quantity')).toHaveTextContent('1')
  })

  it('manages Shopping Cart items: increase, decrease, subtotal/total calculation, confirmation modal removal, and empty state', async () => {
    const user = userEvent.setup()
    renderApp(['/cart'], {
      cart: {
        items: [
          { ...mockProducts[0], quantity: 2 }, // 109.95 * 2 = 219.90
          { ...mockProducts[2], quantity: 1 }, // 64.00 * 1 = 64.00
        ],
      },
      wishlist: { items: [] },
    })

    // Verify initial subtotal ($283.90) & total ($283.90) and navbar count (3)
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('3')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$283.90')
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$283.90')

    // Increase quantity of product 3 ($64.00)
    await user.click(
      screen.getByRole('button', {
        name: /increase quantity of wd portable external ssd/i,
      })
    )
    expect(screen.getByTestId('cart-item-qty-3')).toHaveTextContent('2')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$347.90')

    // Decrease quantity of product 1 ($109.95) from 2 to 1
    await user.click(
      screen.getByRole('button', {
        name: /decrease quantity of fjallraven backpack/i,
      })
    )
    expect(screen.getByTestId('cart-item-qty-1')).toHaveTextContent('1')
    expect(screen.getByTestId('cart-subtotal')).toHaveTextContent('$237.95')

    // Remove product 1 -> opens confirmation modal first
    await user.click(
      screen.getByRole('button', {
        name: /remove fjallraven backpack from cart/i,
      })
    )
    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    await user.click(
      within(dialog).getByRole('button', { name: /yes, remove/i })
    )

    await waitFor(() => {
      expect(
        screen.queryByTestId('cart-item-1')
      ).not.toBeInTheDocument()
    })
    expect(screen.getByTestId('cart-total')).toHaveTextContent('$128.00')

    // Clear entire cart -> opens confirmation modal -> renders empty cart message
    await user.click(screen.getByRole('button', { name: /clear cart/i }))
    const clearDialog = screen.getByRole('dialog')
    await user.click(
      within(clearDialog).getByRole('button', { name: /yes, clear cart/i })
    )

    expect(
      await screen.findByTestId('empty-cart-message')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/your shopping cart is empty/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0')
  })

  it('completes Checkout flow with Order Summary, clears cart, and auto-removes only purchased items from wishlist', async () => {
    const user = userEvent.setup()
    const { store } = renderApp(['/checkout'], {
      cart: {
        items: [{ ...mockProducts[0], quantity: 2 }], // $219.90 (product 1)
      },
      wishlist: {
        items: [mockProducts[0], mockProducts[1]], // product 1 (bought) + product 2 (not bought)
      },
    })

    expect(screen.getByTestId('wishlist-item-count')).toHaveTextContent('2')

    expect(
      screen.getByRole('heading', { name: /order summary/i })
    ).toBeInTheDocument()
    expect(screen.getByText('Fjallraven Backpack')).toBeInTheDocument()

    await user.type(screen.getByLabelText(/full name/i), 'Arka Karmoker')
    await user.type(screen.getByLabelText(/email address/i), 'arka@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '+8801700000000')
    await user.type(screen.getByLabelText(/street address/i), '123 Dhaka Road')
    await user.type(screen.getByLabelText(/city/i), 'Dhaka')
    await user.type(screen.getByLabelText(/postal code/i), '1207')

    await user.click(screen.getByRole('button', { name: /place order/i }))

    expect(
      await screen.findByTestId('order-confirmation')
    ).toBeInTheDocument()
    expect(
      screen.getByText(/thank you for your purchase, arka karmoker!/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('cart-item-count')).toHaveTextContent('0')

    // Purchased product (id: 1) removed from wishlist; unpurchased product (id: 2) preserved
    expect(screen.getByTestId('wishlist-item-count')).toHaveTextContent('1')
    expect(store.getState().wishlist.items).toHaveLength(1)
    expect(store.getState().wishlist.items[0].id).toBe(2)
  })

  it('requires confirmation modal before clearing entire Wishlist', async () => {
    const user = userEvent.setup()
    renderApp(['/wishlist'], {
      cart: { items: [] },
      wishlist: { items: [mockProducts[0], mockProducts[1]] },
    })

    expect(screen.getByText('Fjallraven Backpack')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /clear wishlist/i }))

    const dialog = screen.getByRole('dialog')
    expect(dialog).toBeInTheDocument()
    await user.click(
      within(dialog).getByRole('button', { name: /yes, clear wishlist/i })
    )

    expect(
      await screen.findByText(/your wishlist is empty/i)
    ).toBeInTheDocument()
    expect(screen.getByTestId('wishlist-item-count')).toHaveTextContent('0')
  })
})
