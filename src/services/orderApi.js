import Axios from '../utils/Axios';

// ========== USER API CALLS ==========

// Create a new order (COD)
export const createOrder = async (orderData) => {
  const res = await Axios.post('/createOrder', orderData);
  return res.data;
};

// ── Razorpay Payment APIs ────────────────────────────────────────────────────

// Step 1: Create a Razorpay order on backend and get order_id
export const createRazorpayOrder = async (amount) => {
  const res = await Axios.post('/createRazorpayOrder', { amount });
  return res.data; // { success, razorpayOrderId, amount, currency, key }
};

// Step 2: Verify payment signature and persist order to DB
export const verifyPayment = async (paymentData) => {
  const res = await Axios.post('/verifyPayment', paymentData);
  return res.data; // { success, order }
};

// Place order from cart
export const placeOrderFromCart = async () => {
  const res = await Axios.post('/placeOrderFromCart');
  return res.data;
};

// Get logged-in user's orders
export const getUserOrders = async () => {
  const res = await Axios.get('/getUserOrders');
  return res.data.order1;
};

// Get one user order by ID
export const getUserOrderById = async (orderId) => {
  const res = await Axios.get(`/getUserOrderById/${orderId}`);
  return res.data.order;
};

// ========== ADMIN API CALLS ==========

// Get all orders (admin)
export const getAllOrders = async () => {
  const res = await Axios.get('/getAllOrders');
  return res.data.orders;
};

// Update order status/payment by order ID
export const updateOrderStatus = async (orderId, statusData) => {
  const res = await Axios.put(`/updateOrderStatus/${orderId}`, statusData);
  return res.data;
};

// Delete order by ID
export const deleteOrder = async (orderId) => {
  const res = await Axios.delete(`/deleteOrder/${orderId}`);
  return res.data;
};

// Get orders filtered by date range (e.g. today, 15days, 1month)
export const getFilteredOrders = async (filter = {}) => {
  const res = await Axios.get('/filter', {
    params: filter, // Spread the filter object here
  });
  return res.data; // or res.data.orders depending on your backend response
};


// Get one user order by ID
// Get all orders for a specific user by user ID (admin)
export const getOrdersByUserId = async (userId) => {
  const res = await Axios.get(`/getOrdersByUserId/${userId}`);
  return res.data.orders;
};

// Get total products count
export const getTotalProducts = async () => {
  const res = await Axios.get("/totalProducts");
  return res.data; // { totalProducts: 10 }
};

// Get total orders count
export const getTotalOrders = async () => {
  const res = await Axios.get("/getTotalOrders");
  return res.data; // { totalProducts: 25 } — wrong key name
};

// Get total customers count
export const getTotalCustomers = async () => {
  const res = await Axios.get("/user/gettotalusers");
  return res.data; // { totalProducts: 15 } — wrong key name
};

// Get today's orders
export const getTodayOrders = async () => {
  const res = await Axios.get('/getTodayOrders');
  return res.data.orders;
};

