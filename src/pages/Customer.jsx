import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/cust.css";

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: { street: "", city: "", state: "", zip: "", country: "India" },
  });
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await fetch("https://backend-hvgn.onrender.com/api/customers", {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setCustomers(data.data);
      } else if (res.status === 401) {
        navigate("/login");
      } else {
        setMessage("❌ " + data.message);
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error fetching customers");
      setIsSuccess(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (["street", "city", "state", "zip", "country"].includes(name)) {
      setForm({ ...form, address: { ...form.address, [name]: value } });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingId
        ? `https://backend-hvgn.onrender.com/api/customers/${editingId}`
        : "https://backend-hvgn.onrender.com/api/customers";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(editingId ? "✅ Customer updated!" : "✅ Customer added!");
        setIsSuccess(true);
        setForm({
          name: "",
          email: "",
          phone: "",
          address: { street: "", city: "", state: "", zip: "", country: "India" },
        });
        setEditingId(null);
        fetchCustomers();
      } else if (res.status === 401) {
        navigate("/login");
      } else {
        setMessage("❌ " + data.message);
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error saving customer");
      setIsSuccess(false);
    }
  };

  // Edit
  const handleEdit = (cust) => {
    setForm({
      name: cust.name,
      email: cust.email,
      phone: cust.phone,
      address: {
        street: cust.address?.street || "",
        city: cust.address?.city || "",
        state: cust.address?.state || "",
        zip: cust.address?.zip || "",
        country: cust.address?.country || "India",
      },
    });
    setEditingId(cust._id);
    setMessage("");
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const res = await fetch(`https://backend-hvgn.onrender.com/api/customers/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();

      if (data.success) {
        setMessage("🗑️ Customer deleted");
        setIsSuccess(true);
        fetchCustomers();
      } else if (res.status === 401) navigate("/login");
      else {
        setMessage("❌ " + data.message);
        setIsSuccess(false);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error deleting customer");
      setIsSuccess(false);
    }
  };

  return (
    <div className="customers-container">
      <h1 className="page-title">👥 Manage Customers</h1>
      <p className="page-subtitle">
        Add, edit, and organize your customers with ease.
      </p>

      {/* Form */}
      <div className="form-card">
        <h2>{editingId ? "✏️ Edit Customer" : "➕ Add New Customer"}</h2>
        <form onSubmit={handleSubmit} className="customer-form">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" required />
          <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" />
          <input name="street" value={form.address.street} onChange={handleChange} placeholder="Street" />
          <input name="city" value={form.address.city} onChange={handleChange} placeholder="City" />
          <input name="state" value={form.address.state} onChange={handleChange} placeholder="State" />
          <input name="zip" value={form.address.zip} onChange={handleChange} placeholder="ZIP" />
          <input name="country" value={form.address.country} onChange={handleChange} placeholder="Country" />
          <button type="submit" className="btn-primary">
            {editingId ? "Update Customer" : "Add Customer"}
          </button>
        </form>
      </div>

      {/* Message */}
      {message && <p className={`message ${isSuccess ? "success" : "error"}`}>{message}</p>}

      {/* Table */}
      <div className="table-container">
        <table className="customers-table">
          <thead>
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>City</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(cust => (
              <tr key={cust._id}>
                <td>{cust.name}</td>
                <td>{cust.email}</td>
                <td>{cust.phone || "-"}</td>
                <td>{cust.address?.city || "-"}</td>
                <td>
                  <button className="btn-edit" onClick={() => handleEdit(cust)}>Edit</button>
                  <button className="btn-delete" onClick={() => handleDelete(cust._id)}>Delete</button>
                  <Link to={`/orders?customerId=${cust._id}`} className="btn-link">Give Order</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
