# 🛍️ ShopVerse — Modern E-Commerce Shopping Application

![React](https://img.shields.io/badge/React-v19-087EA4?style=for-the-badge&logo=react&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-v2-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-v7-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-v8-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)  
![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vitest](https://img.shields.io/badge/Vitest-13_Passed-4BB543?style=for-the-badge&logo=vitest&logoColor=white)
![Testing Library](https://img.shields.io/badge/Testing_Library-v16-E33332?style=for-the-badge&logo=testinglibrary&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-Clean-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel&logoColor=white)

A modern, mobile-responsive E-Commerce Shopping Application built with **React 19**, **Redux Toolkit**, **React Router v7**, **Vite 8**, and **Tailwind CSS v4**—integrating live product and category feeds from the [Fake Store API](https://fakestoreapi.com/) with persistent cart state, wishlist management, zero-layout-shift shimmer skeletons, and a complete checkout workflow.

---

## ✨ Features

- **Home Storefront & Responsive Catalog**: Fetches live products (`https://fakestoreapi.com/products`) and categories (`https://fakestoreapi.com/products/categories`), rendering a responsive 1/2/4-column grid displaying product image, title, price, category, rating, Wishlist toggle, and Add to Cart action.
- **Real-Time Search, Category Filter & Price Sorting**: Instant search by product name, keyboard-accessible custom React dropdowns and category pills for filtering, plus Low-to-High and High-to-Low price sorting with one-click filter reset.
- **Product Details Page (`/product/:id`)**: Dynamic React Router page showcasing full product details (image, title, price, category, rating, and description) with an isolated `- / +` quantity selector that commits the chosen quantity on **Add to Cart**.
- **Redux Toolkit Shopping Cart (`/cart`)**: Strictly managed through Redux Toolkit (`configureStore()`, `createSlice()`, `useSelector()`, `useDispatch()`) implementing `addToCart`, `removeFromCart`, `increaseQuantity`, `decreaseQuantity`, and `clearCart`, complete with live subtotal/total calculation, `localStorage` persistence, confirmation modals before removal, and empty-cart state.
- **Responsive Navigation Bar**: Sticky header featuring the **ShopVerse** brand logo, **Home**, **Wishlist**, and **Cart** links with auto-updating corner item-count badges (capped at `99+`) and mobile drawer navigation.
- **Wishlist & Smart Checkout (`/wishlist`, `/checkout`)**: Persistent Redux Wishlist with one-click **Move to Cart**, confirmation modal before clearing, and a full Checkout form with live **Order Summary**, dynamic Order ID receipt, and automatic removal of purchased items from the Wishlist.
- **Zero-CLS Shimmer Skeletons & Notifications**: Exact-geometry loading skeletons for Home, FilterBar, and Product Details, smooth image fade-in placeholders, API error recovery with retry, and dismissible `react-hot-toast` notifications.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | React 19 (`react`, `react-dom`) | Declarative component UI architecture & Hooks |
| **State Management** | Redux Toolkit 2 + React-Redux 9 (`@reduxjs/toolkit`, `react-redux`) | Centralized `cartSlice` & `wishlistSlice` state with `localStorage` sync |
| **Routing** | React Router 7 (`react-router-dom`) | Client-side SPA routing (`Home`, `ProductDetails`, `Cart`, `Wishlist`, `Checkout`, `NotFound`) |
| **Build Tool** | Vite 8 (`@vitejs/plugin-react`) | Lightning-fast HMR and optimized production bundling |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Modern utility-first responsive styling and custom shimmer utilities |
| **Data & API** | Native Fetch API (`async/await`) + Fake Store API | Live product catalog, categories, and single-product lookups |
| **Icons & Alerts** | Lucide React (`lucide-react`) & React Hot Toast (`react-hot-toast`) | Crisp vector icons and dismissible toast feedback |
| **Testing** | Vitest 5 + React Testing Library 16 + JSDOM | Automated unit and UI integration test execution |
| **Code Quality** | ESLint 10 (`react-hooks`, `react-refresh`) | Automated linting and modern React hooks verification |
| **Deployment** | Vercel (`vercel.json`) & Netlify (`public/_redirects`) | Single-Page Application (SPA) cloud hosting & route rewrites |

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone https://github.com/ArkaKarmoker/react-ecommerce-assignment.git
```

### 2. Navigate to Project Directory

```bash
cd react-ecommerce-assignment
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Run Automated Tests

```bash
npm test
```

### 6. Run Code Linter

```bash
npm run lint
```

### 7. Build for Production

```bash
npm run build
```

Production output will be generated inside the `dist/` directory.

### 8. Preview Production Build

```bash
npm run preview
```

---

## 🧪 Automated Testing Suite

The project includes **13 automated unit and integration tests** across `src/test/cartSlice.test.js` and `src/test/app.test.jsx` executed via **Vitest** and **React Testing Library**:

```text
 ✓ src/test/cartSlice.test.js (7 tests)
   ✓ 1. addToCart adds a new product with quantity 1 and increments if added again
   ✓ 2. removeFromCart removes the matching product from the cart
   ✓ 3. increaseQuantity increases the quantity of a selected product
   ✓ 4. decreaseQuantity decreases quantity when > 1 and keeps minimum at 1
   ✓ 5. clearCart removes all products from the shopping cart
   ✓ computes cart selectors accurately through configureStore
   ✓ toggles, removes, and clears wishlist items with localStorage sync

 ✓ src/test/app.test.jsx (6 tests)
   ✓ renders Home page, fetches products, and supports search, category filter, and price sort
   ✓ handles API errors gracefully and retries on button click
   ✓ displays Product Details page, selects quantity without mutating cart, and adds selected quantity on Add to Cart click
   ✓ manages Shopping Cart items: increase, decrease, subtotal/total calculation, confirmation modal removal, and empty state
   ✓ completes Checkout flow with Order Summary, clears cart, and auto-removes only purchased items from wishlist
   ✓ requires confirmation modal before clearing entire Wishlist
```

---

Developed by [Arka Karmoker](https://github.com/ArkaKarmoker)  
Project Repository: [https://github.com/ArkaKarmoker/react-ecommerce-assignment](https://github.com/ArkaKarmoker/react-ecommerce-assignment)
