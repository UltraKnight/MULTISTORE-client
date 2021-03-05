import axios from 'axios';
const baseURL = `${process.env.REACT_APP_MULTISTORE_API}/api`;

//PRODUCTS
export const getUserProducts = () => {
    return axios.get(`${baseURL}/products/me`)
}

export const getProductsByCategory = (categoryId) => {
    return axios.get(`${baseURL}/products/${categoryId}`)
}

export const getAllProducts = () => {
    return axios.get(`${baseURL}/products`);
}

export const addProduct = (product) => {
    //name, description, image_url, category, quantity, price, createdBy
    return axios.post(`${baseURL}/products`, product);
}

export const deleteProduct = (id) => {
    return axios.delete(`${baseURL}/products/${id}`);
}

export const getProduct = (id) => {
    return axios.get(`${baseURL}/products/${id}`);
}

export const updateProduct = (updatedProduct) => {
    return axios.put(`${baseURL}/products/${updatedProduct.id}`, updatedProduct);
}

export const uploadFile = (uploadData) => {
    return axios.post(`${baseURL}/upload`, uploadData);
}
//END PRODUCTS

//CATEGORIES
export const getUserCategories = () => {
    return axios.get(`${baseURL}/categories/me`)
}

//Read - only categories created by user and the admin
export const getCategories = () => {
    return axios.get(`${baseURL}/categories`)
}

export const addCategory = (category) => {
    //name, description, image_url, category, quantity, price, createdBy
    return axios.post(`${baseURL}/categories`, category);
}

export const deleteCategory = (id) => {
    return axios.delete(`${baseURL}/categories/${id}`);
}

export const getCategory = (id) => {
    return axios.get(`${baseURL}/categories/${id}`);
}

export const updateCategory = (updatedCategory) => {
    return axios.put(`${baseURL}/categories/${updatedCategory.id}`, updatedCategory);
}
//END CATEGORIES

//ORDERS
export const getUserOrders = () => {
    return axios.get(`${baseURL}/orders/me`)
}

//Read - only categories created by user and the admin
export const getAllOrders = () => {
    return axios.get(`${baseURL}/orders`)
}

export const getSales = () => {
    return axios.get(`${baseURL}/orders/sales`)
}

export const getPurchases = () => {
    return axios.get(`${baseURL}/orders/purchases`)
}

export const addOrder = (order) => {
    //products, seller, client, orderDate, status
    return axios.post(`${baseURL}/orders`, order);
}

export const deleteOrder = (id) => {
    return axios.delete(`${baseURL}/orders/${id}`);
}

export const getOrder = (id) => {
    return axios.get(`${baseURL}/orders/${id}`);
}

export const updateOrder = (updatedOrder) => {
    return axios.put(`${baseURL}/orders/${updatedOrder.id}`, updatedOrder);
}

export const addComment = (orderId, comment) => {
    return axios.put(`${baseURL}/orders/${orderId}`, comment);
}
//END ORDERS

/* AUTHENTICATION ROUTES */
export const signup = (username, password) => {
    return axios.post(`${baseURL}/signup`, {username, password});
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
