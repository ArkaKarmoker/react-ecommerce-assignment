# ASSIGNMENT: E-COMMERCE SHOPPING APPLICATION

## 1. Project Overview

Your task is to develop a simple E-commerce Shopping Application using React.js and Redux Toolkit.

The application will allow users to browse products, view product details, search and filter products, and manage their shopping cart.

The main objective of this assignment is to evaluate your understanding of React components, React Hooks, API integration, React Router, and Redux state management.

## 2. Project Requirements

### A. Home Page

- Display a list of products fetched from an API.
- Each product should display:
  - Product Image
  - Product Name
  - Product Price
  - Product Category
  - Add to Cart Button
- Display products in a responsive grid layout.
- Show a loading indicator while fetching products.
- Handle API errors appropriately.

### B. Product Details Page

- Display complete information about a selected product.
- Show product image, title, price, category, and description.
- Include an Add to Cart button.
- Navigate to the product details page using React Router.

### C. Search and Filter Functionality

- Implement product search by name.
- Filter products by category.
- Implement price sorting:
  - Low to High
  - High to Low

### D. Shopping Cart

- Display all products added to the cart.
- Increase product quantity.
- Decrease product quantity.
- Remove individual products from the cart.
- Display product quantity and price.
- Calculate the subtotal and total price.
- Display an appropriate message when the cart is empty.

### E. Navigation Bar

Create a responsive navigation bar containing:

- Application Logo or Name
- Home
- Cart
- Cart Item Count

The cart item count should update automatically whenever products are added or removed.

**API Endpoint:**

https://fakestoreapi.com/products

You can use the following API to fetch product categories:

https://fakestoreapi.com/products/categories

## 4. Redux State Management Requirements

You must use Redux Toolkit to manage the shopping cart.

Create a Redux Store and a Cart Slice.

Your Cart Slice should include the following reducers:

1. **addToCart:** Add a product to the shopping cart.
2. **removeFromCart:** Remove a product from the shopping cart.
3. **increaseQuantity:** Increase the quantity of a selected product.
4. **decreaseQuantity:** Decrease the quantity of a selected product.
5. **clearCart:** Remove all products from the shopping cart.

You must use:

- `configureStore()`
- `createSlice()`
- `useSelector()`
- `useDispatch()`

**Important:** Cart data must be managed through Redux Toolkit. Do not use local component state for the main shopping cart functionality.

## 5. Bonus Features (Optional)

Students can implement the following features for additional appreciation:

- Add a product to the Wishlist.
- Save cart data in LocalStorage.
- Display a success message after adding a product to the cart.
- Create a Checkout Page.
- Display an order summary.
- Add a confirmation message before removing a product.

These features are optional and are not mandatory for the main assignment.

## 6. Submission Guidelines

Follow these instructions carefully when submitting your assignment.

### A. GitHub Repository

- Create a new public GitHub repository for this assignment.
- Give your repository a meaningful name, such as `react-ecommerce-assignment`.
- Push your complete source code to the repository.
- Make sure your repository contains all necessary project files.
- Do not upload the `node_modules` folder.
- Include a proper README.md file.

### B. README.md Requirements

Your README.md file must contain:

1. Project Name
2. Project Description
3. Technologies Used
4. Main Features
5. Installation Instructions
6. How to Run the Project
7. Live Project Link (if deployed)

### C. Project Deployment

Deploy your project using any suitable hosting platform, such as:

- Vercel
- Netlify

**Deployment is recommended.** If you deploy your project, include the live URL in your submission.

### D. Final Submission Format

Submit the following information:

- GitHub Repository URL:

### E. Important Submission Rules

- Submit your own work.
- Do not copy another student's complete project.
- Make sure the application runs without errors.
- Ensure all required features are working before submission.
- Keep your GitHub repository public.
- Late submissions may be subject to penalties according to class policy.