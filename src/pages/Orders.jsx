import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../styles/orders.css";

export default function Orders() {
  const [searchParams] = useSearchParams();
  const customerId = searchParams.get("customerId");

  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    customer: customerId || "",
    items: [{ productName: "", quantity: 1, price: 0 }],
    status: "pending",
  });
  const [editingOrderId, setEditingOrderId] = useState(null);
  const [message, setMessage] = useState("");

  // Fetch Orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("https://backend-hvgn.onrender.com/api/orders", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) setOrders(data.data);
      else setMessage("❌ " + data.message);
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Handle Form Changes
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...form.items];
    updatedItems[index][name] = value;
    setForm({ ...form, items: updatedItems });
  };

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { productName: "", quantity: 1, price: 0 }],
    });
  };

  const removeItem = (index) => {
    const updatedItems = [...form.items];
    updatedItems.splice(index, 1);
    setForm({ ...form, items: updatedItems });
  };

  const resetForm = () => {
    setForm({
      customer: customerId || "",
      items: [{ productName: "", quantity: 1, price: 0 }],
      status: "pending",
    });
    setEditingOrderId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingOrderId
        ? `https://backend-hvgn.onrender.com/api/orders/${editingOrderId}`
        : "https://backend-hvgn.onrender.com/api/orders";
      const method = editingOrderId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage(editingOrderId ? "✅ Order updated successfully!" : "✅ Order created successfully!");
        resetForm();
        fetchOrders();
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving order");
    }
  };

  const handleEdit = (order) => {
    setForm({
      customer: order.customer?._id || "",
      items: order.items,
      status: order.status,
    });
    setEditingOrderId(order._id);
    setMessage("✏️ Editing order...");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this order?")) return;
    try {
      const res = await fetch(`https://backend-hvgn.onrender.com/api/orders/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setMessage("🗑️ Order deleted");
        fetchOrders();
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting order");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const res = await fetch(`https://backend-hvgn.onrender.com/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage("✅ Status updated");
        fetchOrders();
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error updating status");
    }
  };

  return (
    <div className="orders-container">
      <h1 className="orders-title">📦 Manage Orders</h1>

      {message && <p className="orders-message">{message}</p>}

      {/* Create / Edit Order Form */}
      <form onSubmit={handleSubmit} className="orders-form">
        <h2>{editingOrderId ? "✏️ Edit Order" : "➕ Create New Order"}</h2>

        {form.items.map((item, index) => (
          <div key={index} className="order-item-row">
            <input
              type="text"
              name="productName"
              placeholder="Product Name"
              value={item.productName}
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            <input
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={item.quantity}
              min="1"
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={item.price}
              min="0"
              onChange={(e) => handleItemChange(index, e)}
              required
            />
            {form.items.length > 1 && (
              <button
                type="button"
                className="remove-item-btn"
                onClick={() => removeItem(index)}
              >
                ❌
              </button>
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={addItem} className="add-item-btn">
            ➕ Add Item
          </button>
          <button type="submit" className="orders-submit">
            {editingOrderId ? "Update Order" : "Save Order"}
          </button>
          {editingOrderId && (
            <button
              type="button"
              onClick={resetForm}
              className="cancel-btn"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Orders Table */}
      <div className="orders-table-container">
        <h2>All Orders</h2>
        <table className="orders-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Items</th>
              <th>Total</th>
              <th>Status</th>
              <th>Order Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>
                  <strong>{order.customer?.name}</strong> <br />
                  <small>{order.customer?.email}</small>
                </td>
                <td>
                  {order.items.map((i, idx) => (
                    <div key={idx} className="order-item">
                      {i.productName} ({i.quantity} × ₹{i.price})
                    </div>
                  ))}
                </td>
                <td className="total-cell">₹{order.totalAmount}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
                <td>{new Date(order.orderDate).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => handleEdit(order)}
                    className="edit-btn"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="delete-btn"
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan="6" className="no-orders">
                  No orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
