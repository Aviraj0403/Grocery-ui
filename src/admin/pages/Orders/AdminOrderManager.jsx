import React, { useEffect, useState } from 'react';
import axios from '../../../utils/Axios';
import toast from 'react-hot-toast';
import AdminOrderDetails from './AdminOrderDetails';

// ── Payment method badge ─────────────────────────────────────────────────────
const PaymentMethodBadge = ({ method }) => {
  if (method === 'ONLINE') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
        💳 Online
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-300">
      💵 COD
    </span>
  );
};

// ── Payment status badge ─────────────────────────────────────────────────────
const PaymentStatusBadge = ({ status }) => {
  const styles = {
    Paid: 'bg-green-100 text-green-700 border-green-200',
    Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    Failed: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${styles[status] || styles.Pending}`}>
      {status}
    </span>
  );
};

const getOrderDetailsAdmin = async (orderId) => {
  const res = await axios.get(`/getOrderDetailsAdmin/${orderId}`);
  if (res.data.success) return res.data.order;
  throw new Error('Failed to fetch order details');
};

const AdminOrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Month and Year filter state
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  // Fetch orders with optional month/year filter
  const fetchOrders = async (filter = {}) => {
    try {
      setLoading(true);

      const params = {};
      if (filter.month) params.month = Number(filter.month);
      if (filter.year) params.year = Number(filter.year);

      // Debug logs (remove if you want)
      console.log('Fetching orders with params:', params);

      const res = await axios.get('/getAllOrders', { params });
      setOrders(res.data.orders || []);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    try {
      setLoadingDetails(true);
      const order = await getOrderDetailsAdmin(orderId);
      setSelectedOrder(order);
    } catch (error) {
      toast.error('Failed to fetch order details');
    } finally {
      setLoadingDetails(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(`/updateOrderStatus/${id}`, { orderStatus: status });
      toast.success('Order status updated');
      fetchOrders({ month: filterMonth, year: filterYear });
      if (selectedOrder && selectedOrder._id === id) {
        fetchOrderDetails(id);
      }
    } catch {
      toast.error('Update failed');
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`/deleteOrder/${id}`);
      toast.success('Order deleted');
      setOrders(orders.filter(order => order._id !== id));
      if (selectedOrder && selectedOrder._id === id) setSelectedOrder(null);
    } catch {
      toast.error('Delete failed');
    }
  };

  // Fetch all orders on mount (no filter)
  useEffect(() => {
    fetchOrders();
  }, []);

  // Handler to apply month-year filter
  const applyFilter = () => {
    if (!filterMonth || !filterYear) {
      toast.error('Please select both month and year');
      return;
    }
    fetchOrders({ month: filterMonth, year: filterYear });
    setSelectedOrder(null);
  };

  // Clear filter handler
  const clearFilter = () => {
    setFilterMonth('');
    setFilterYear('');
    fetchOrders();
    setSelectedOrder(null);
  };

  // Year options from 2020 to current year
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let y = currentYear; y >= 2020; y--) years.push(y);

  // Boolean: is filter applied?
  const isFilterApplied = filterMonth !== '' && filterYear !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold mb-4">Manage Orders</h2>

      {/* Month-Year filter */}
      <div className="mb-6 flex flex-wrap items-end gap-4">
        <div>
          <label htmlFor="monthSelect" className="block font-semibold mb-1">Month:</label>
          <select
            id="monthSelect"
            value={filterMonth}
            onChange={e => setFilterMonth(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Month</option>
            {[
              '01', '02', '03', '04', '05', '06',
              '07', '08', '09', '10', '11', '12'
            ].map(m => (
              <option key={m} value={m}>
                {new Date(0, parseInt(m) - 1).toLocaleString('default', { month: 'long' })}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="yearSelect" className="block font-semibold mb-1">Year:</label>
          <select
            id="yearSelect"
            value={filterYear}
            onChange={e => setFilterYear(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Year</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <button
          onClick={applyFilter}
          className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
          aria-label="Apply month and year filter"
        >
          Apply Filter
        </button>

        {/* Show Clear Filter only if filter is applied */}
        {isFilterApplied && (
          <button
            onClick={clearFilter}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded shadow hover:bg-gray-400 transition"
            aria-label="Clear filter"
          >
            Clear Filter
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden sm:block overflow-x-auto bg-white shadow rounded">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-left">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Method</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr
                    key={order._id}
                    className={`border-t cursor-pointer ${selectedOrder?._id === order._id ? 'bg-blue-50' : ''}`}
                    onClick={() => fetchOrderDetails(order._id)}
                  >
                    <td className="px-4 py-2">{order._id.slice(0, 8)}...</td>
                    <td className="px-4 py-2">{order.user?.userName || 'Guest'}</td>
                    <td className="px-4 py-2">₹{order.totalAmount}</td>
                    <td className="px-4 py-2">
                      <select
                        value={order.orderStatus}
                        onClick={e => e.stopPropagation()}
                        onChange={e => updateStatus(order._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-2"><PaymentMethodBadge method={order.paymentMethod} /></td>
                    <td className="px-4 py-2"><PaymentStatusBadge status={order.paymentStatus} /></td>
                    <td className="px-4 py-2">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td
                      className="px-4 py-2 text-right"
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="space-y-4 sm:hidden">
            {orders.map(order => (
              <div
                key={order._id}
                className={`bg-white p-4 rounded shadow text-sm space-y-2 cursor-pointer ${selectedOrder?._id === order._id ? 'bg-blue-50' : ''}`}
                onClick={() => fetchOrderDetails(order._id)}
              >
                <div><strong>Order ID:</strong> {order._id.slice(0, 10)}...</div>
                <div><strong>User:</strong> {order.user?.userName || 'Guest'}</div>
                <div><strong>Total:</strong> ₹{order.totalAmount}</div>
                <div className="flex items-center gap-2">
                  <strong>Method:</strong> <PaymentMethodBadge method={order.paymentMethod} />
                </div>
                <div className="flex items-center gap-2">
                  <strong>Payment:</strong> <PaymentStatusBadge status={order.paymentStatus} />
                </div>
                <div><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</div>
                <div>
                  <label className="block text-xs text-gray-500">Status:</label>
                  <select
                    value={order.orderStatus}
                    onClick={e => e.stopPropagation()}
                    onChange={e => updateStatus(order._id, e.target.value)}
                    className="w-full border rounded px-2 py-1 mt-1"
                  >
                    {['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    deleteOrder(order._id);
                  }}
                  className="text-red-600 hover:underline text-right block mt-2"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>

          {/* Order details panel */}
          {selectedOrder && (
            <AdminOrderDetails order={selectedOrder} onClose={() => setSelectedOrder(null)} />
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrderManager;
