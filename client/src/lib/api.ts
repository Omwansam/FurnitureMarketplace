import { apiRequest } from "./queryClient";

// API functions for categories
export const getCategories = () => fetch("/api/categories").then(res => res.json());
export const getCategory = (id: number) => fetch(`/api/categories/${id}`).then(res => res.json());

// API functions for products
export const getProducts = (params?: { 
  categoryId?: number, 
  featured?: boolean, 
  isNew?: boolean,
  search?: string,
  limit?: number,
  offset?: number
}) => {
  const queryParams = new URLSearchParams();
  
  if (params?.categoryId) queryParams.append('categoryId', params.categoryId.toString());
  if (params?.featured !== undefined) queryParams.append('featured', params.featured.toString());
  if (params?.isNew !== undefined) queryParams.append('isNew', params.isNew.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.limit) queryParams.append('limit', params.limit.toString());
  if (params?.offset) queryParams.append('offset', params.offset.toString());
  
  const queryString = queryParams.toString();
  return fetch(`/api/products${queryString ? `?${queryString}` : ''}`).then(res => res.json());
};

export const getProduct = (id: number) => fetch(`/api/products/${id}`).then(res => res.json());
export const getProductBySlug = (slug: string) => fetch(`/api/products/slug/${slug}`).then(res => res.json());

export const createProduct = (productData: any) => 
  apiRequest("POST", "/api/products", productData).then(res => res.json());

export const updateProduct = (id: number, productData: any) => 
  apiRequest("PUT", `/api/products/${id}`, productData).then(res => res.json());

export const deleteProduct = (id: number) => 
  apiRequest("DELETE", `/api/products/${id}`);

// API functions for cart
export const getCart = (userId: number) => fetch(`/api/cart/${userId}`).then(res => res.json());

export const addToCart = (cartItem: { userId: number, productId: number, quantity: number }) =>
  apiRequest("POST", "/api/cart", cartItem).then(res => res.json());

export const updateCartItem = (id: number, quantity: number) =>
  apiRequest("PUT", `/api/cart/${id}`, { quantity }).then(res => res.json());

export const removeCartItem = (id: number) =>
  apiRequest("DELETE", `/api/cart/${id}`);

// API functions for orders
export const getOrders = (userId?: number) => {
  const queryParams = userId ? `?userId=${userId}` : '';
  return fetch(`/api/orders${queryParams}`).then(res => res.json());
};

export const getOrder = (id: number) => fetch(`/api/orders/${id}`).then(res => res.json());

export const createOrder = (orderData: any) =>
  apiRequest("POST", "/api/orders", orderData).then(res => res.json());

export const updateOrderStatus = (id: number, status: string) =>
  apiRequest("PUT", `/api/orders/${id}/status`, { status }).then(res => res.json());

// API functions for authentication
export const login = (credentials: { username: string, password: string }) =>
  apiRequest("POST", "/api/login", credentials).then(res => res.json());

export const register = (userData: any) =>
  apiRequest("POST", "/api/register", userData).then(res => res.json());

// API functions for reviews
export const getProductReviews = (productId: number) =>
  fetch(`/api/products/${productId}/reviews`).then(res => res.json());

export const createReview = (reviewData: any) =>
  apiRequest("POST", "/api/reviews", reviewData).then(res => res.json());
