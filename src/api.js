import axios from 'axios';
const baseURL = `${process.env.REACT_APP_MULTISTORE_API}/api`;

//PRODUCTS
export const getUserProducts = () => {
    return axios.get(`${baseURL}/products/me`, {withCredentials: true})
}

export const getProductsByCategory = (categoryId) => {
    return axios.get(`${baseURL}/products/by-category/${categoryId}`)
}

export const getProducts = (query = null, limit = 0, stock = 'false') => {
    return axios.get(query ? `${baseURL}/products?query=${query}&limit=${limit}&stock=${stock}` : `${baseURL}/products?limit=${limit}&stock=${stock}`);
}

export const addProduct = (product) => {
    //name, description, image_url, category, quantity, price, createdBy
    return axios.post(`${baseURL}/products`, product, {withCredentials: true});
}

export const deleteProduct = (id) => {
    return axios.delete(`${baseURL}/products/${id}`, {withCredentials: true});
}

export const getProduct = (id) => {
    return axios.get(`${baseURL}/products/${id}`);
}

export const updateProduct = (updatedProduct, id) => {
    return axios.put(`${baseURL}/products/${id}`, updatedProduct, {withCredentials: true});
}

export const sellProduct = (quantity, id) => {
    return axios.put(`${baseURL}/products/${id}/sell`, quantity, {withCredentials: true});
}

export const uploadFile = (uploadData) => {
    return axios.post(`${baseURL}/upload`, uploadData, {withCredentials: true});
}
//END PRODUCTS

//CATEGORIES
export const getUserCategories = () => {
    return axios.get(`${baseURL}/categories/me`, {withCredentials: true})
}

//Read - only categories created by user and the admin
export const getCategories = () => {
    return axios.get(`${baseURL}/categories`, {withCredentials: true})
}

export const getAllCategories = () => {
    return axios.get(`${baseURL}/categories/all`);
}

export const addCategory = (category) => {
    //name, description, image_url, category, quantity, price, createdBy
    return axios.post(`${baseURL}/categories`, category, {withCredentials: true});
}

export const deleteCategory = (id) => {
    return axios.delete(`${baseURL}/categories/${id}`, {withCredentials: true});
}

export const getCategory = (id) => {
    return axios.get(`${baseURL}/categories/${id}`);
}

export const updateCategory = (updatedCategory, id) => {
    return axios.put(`${baseURL}/categories/${id}`, updatedCategory, {withCredentials: true});
}
//END CATEGORIES

//ORDERS
export const getAllOrders = () => {
    return axios.get(`${baseURL}/orders`)
}

export const getSales = () => {
    return axios.get(`${baseURL}/orders/sales`, {withCredentials: true})
}

export const getPurchases = () => {
    return axios.get(`${baseURL}/orders/purchases`, {withCredentials: true})
}

export const addOrder = (order) => {
    //products, client, orderDate, status
    return axios.post(`${baseURL}/orders`, order, {withCredentials: true});
}

export const deleteOrder = (id) => {
    return axios.delete(`${baseURL}/orders/${id}`, {withCredentials: true});
}

export const getOrder = (id) => {
    return axios.get(`${baseURL}/orders/${id}`, {withCredentials: true});
}

export const updateOrder = (updatedOrder, id) => {
    return axios.put(`${baseURL}/orders/${id}`, updatedOrder, {withCredentials: true});
}

export const addComment = (orderId, to, comment) => {
    return axios.put(`${baseURL}/orders/${orderId}/comment`, {to, comment}, {withCredentials: true});
}

export const updateStatus = (orderId, status) => {
    return axios.put(`${baseURL}/orders/${orderId}/status`, status, {withCredentials: true})
}
//END ORDERS

/* AUTHENTICATION ROUTES */
export const signup = (username, password, fullName, email) => {
    return axios.post(`${baseURL}/signup`, {username, password, fullName, email});
}

export const login = (username, password) => {
    return axios.post(`${baseURL}/login`, {username, password}, {withCredentials: true});
}

export const logout = () => {
    return axios.post(`${baseURL}/logout`, null, {withCredentials: true});
}

export const loggedin = () => {
    return axios.get(`${baseURL}/loggedin`, {withCredentials: true});
}

export const addToCart = (product) => {
    return axios.post(`${baseURL}/cart/add`, product, {withCredentials: true});
}

export const removeFromCart = (product) => {
    return axios.post(`${baseURL}/cart/remove`, product, {withCredentials: true});
}

export const updateProfile = (newData) => {
    return axios.post(`${baseURL}/profile`, newData, {withCredentials: true});
}

export const updateEmail = (email) => {
    return axios.post(`${baseURL}/profile/email`, email, {withCredentials: true});
}
/* END AUTHENTICATION ROUTES */

//Google api
export const getLatLng = (postcode) => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${postcode}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`);
}

export const getAddress = (latLng) => {
    return axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latLng.lat},${latLng.lng}&language=en&key=${process.env.REACT_APP_GOOGLE_API_KEY}`);
}