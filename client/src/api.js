import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Auth API
export const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const login = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Products API
export const getProducts = async (params = {}) => {
  const response = await axios.get(`${API_URL}/products`, { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const createProduct = async (productData) => {
  const response = await axios.post(`${API_URL}/products`, productData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/products/${id}`, productData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/products/${id}`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Orders API
export const createOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders`, orderData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getMyOrders = async () => {
  const response = await axios.get(`${API_URL}/orders/my`, {
    headers: getAuthHeader()
  });
  return response.data;
};

// Razorpay API
export const createRazorpayOrder = async (orderData) => {
  const response = await axios.post(`${API_URL}/orders/razorpay/create`, orderData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const verifyRazorpayPayment = async (paymentData) => {
  const response = await axios.post(`${API_URL}/orders/razorpay/verify`, paymentData, {
    headers: getAuthHeader()
  });
  return response.data;
};

export const getRazorpayKey = async () => {
  const response = await axios.get(`${API_URL}/orders/razorpay/key`);
  return response.data;
};
