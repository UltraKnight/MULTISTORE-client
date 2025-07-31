import axios from 'axios';
import type { Category } from './types/category';
import type { GeocodeResponse } from './types/google_api';
import type { Order } from './types/order';
import type { Product } from './types/product';
import type { Rate } from './types/review';
import type { User } from './types/user';
const baseURL = `${import.meta.env.REACT_APP_MULTISTORE_API}/api`;

//PRODUCTS
export const getUserProducts = () => {
  return axios.get<Product[]>(`${baseURL}/products/me`, { withCredentials: true });
};

export const getProductsByCategory = (categoryId: string) => {
  return axios.get<Product[]>(`${baseURL}/products/by-category/${categoryId}`);
};

export const getProducts = (query: string | null = null, limit = 0, stock = 'false') => {
  return axios.get<Product[]>(
    query
      ? `${baseURL}/products?query=${query}&limit=${limit}&stock=${stock}`
      : `${baseURL}/products?limit=${limit}&stock=${stock}`,
  );
};

export const addProduct = (product: Product) => {
  //name, description, image_url, category, quantity, price, createdBy
  return axios.post(`${baseURL}/products`, product, { withCredentials: true });
};

export const deleteProduct = (id: string) => {
  return axios.delete(`${baseURL}/products/${id}`, { withCredentials: true });
};

export const getProduct = (id: string) => {
  return axios.get<Product>(`${baseURL}/products/${id}`);
};

export const updateProduct = (updatedProduct: Product, id: string) => {
  return axios.put(`${baseURL}/products/${id}`, updatedProduct, { withCredentials: true });
};

export const sellProduct = (quantity: { quantity: number }, id: string) => {
  return axios.put(`${baseURL}/products/${id}/sell`, quantity, { withCredentials: true });
};

export const uploadFile = (uploadData: FormData) => {
  return axios.post(`${baseURL}/upload`, uploadData, { withCredentials: true });
};
//END PRODUCTS

//CATEGORIES
export const getUserCategories = () => {
  return axios.get<Category[]>(`${baseURL}/categories/me`, { withCredentials: true });
};

//Read - only categories created by user and the admin
export const getCategories = () => {
  return axios.get<Category[]>(`${baseURL}/categories`, { withCredentials: true });
};

export const getAllCategories = () => {
  return axios.get<Category[]>(`${baseURL}/categories/all`);
};

export const addCategory = (categoryName: { name: string }) => {
  //name, description, image_url, category, quantity, price, createdBy
  return axios.post(`${baseURL}/categories`, categoryName, { withCredentials: true });
};

export const deleteCategory = (id: string) => {
  return axios.delete(`${baseURL}/categories/${id}`, { withCredentials: true });
};

export const getCategory = (id: string) => {
  return axios.get<Category>(`${baseURL}/categories/${id}`);
};

export const updateCategory = (updatedCategory: { name: string }, id: string) => {
  return axios.put(`${baseURL}/categories/${id}`, updatedCategory, { withCredentials: true });
};
//END CATEGORIES

//ORDERS
export const getAllOrders = () => {
  return axios.get<Order[]>(`${baseURL}/orders`);
};

export const getSales = () => {
  return axios.get<Order[]>(`${baseURL}/orders/sales`, { withCredentials: true });
};

export const getPurchases = () => {
  return axios.get<Order[]>(`${baseURL}/orders/purchases`, { withCredentials: true });
};

export const addOrder = (order: Order) => {
  return axios.post(`${baseURL}/orders`, order, { withCredentials: true });
};

export const deleteOrder = (id: string) => {
  return axios.delete(`${baseURL}/orders/${id}`, { withCredentials: true });
};

export const getOrder = (id: string) => {
  return axios.get<Order>(`${baseURL}/orders/${id}`, { withCredentials: true });
};

export const updateOrder = (updatedOrder: Order, id: string) => {
  return axios.put(`${baseURL}/orders/${id}`, updatedOrder, { withCredentials: true });
};

export const addComment = (orderId: string, to: string, comment: string) => {
  return axios.put(`${baseURL}/orders/${orderId}/comment`, { to, comment }, { withCredentials: true });
};

export const updateStatus = (orderId: string, status: { status: string }) => {
  return axios.put(`${baseURL}/orders/${orderId}/status`, status, { withCredentials: true });
};
//END ORDERS

/* AUTHENTICATION ROUTES */
export const signup = (username: string, password: string, fullName: string, email: string) => {
  return axios.post(`${baseURL}/signup`, { username, password, fullName, email });
};

export const login = (username: string, password: string) => {
  return axios.post(`${baseURL}/login`, { username, password }, { withCredentials: true });
};

export const logout = () => {
  return axios.post(`${baseURL}/logout`, null, { withCredentials: true });
};

export const loggedin = () => {
  return axios.get<User>(`${baseURL}/loggedin`, { withCredentials: true });
};

export const addToCart = (product: { product: string | null; quantity: number }) => {
  return axios.post(`${baseURL}/cart/add`, product, { withCredentials: true });
};

export const removeFromCart = (product: { product: string | null; quantity: number }) => {
  return axios.post(`${baseURL}/cart/remove`, product, { withCredentials: true });
};

export const updateProfile = (newData: User) => {
  return axios.post(`${baseURL}/profile`, newData, { withCredentials: true });
};

export const updateEmail = (email: { email: string }) => {
  return axios.post(`${baseURL}/profile/email`, email, { withCredentials: true });
};

export const confirmEmail = (id: string) => {
  return axios.get(`${baseURL}/email/confirm/${id}`);
};

export const sendEmail = (email: string, id: string) => {
  return axios.post(`${baseURL}/email/send`, { email: email, id: id }, { withCredentials: true });
};

/* END AUTHENTICATION ROUTES */

//Google api
export const getLatLng = (postcode: string) => {
  return axios.get<GeocodeResponse>( // REFCTOR: type this
    `https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${
      import.meta.env.REACT_APP_GOOGLE_API_KEY
    }`,
  );
};

export const getAddress = (latLng: { lat: number; lng: number }) => {
  return axios.get<GeocodeResponse>(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&language=en&key=${
      import.meta.env.REACT_APP_GOOGLE_API_KEY
    }`,
  );
};

//REVIEWS
export const addRate = (rate: Omit<Rate, 'createdBy'> & { createdBy: string }) => {
  return axios.post(`${baseURL}/rates/add`, rate, { withCredentials: true });
};

export const getRates = (productId: string) => {
  return axios.get<Rate[]>(`${baseURL}/rates/${productId}`, { withCredentials: true });
};

export const deleteRate = (rateId: string) => {
  return axios.delete(`${baseURL}/rates/${rateId}`, { withCredentials: true });
};
