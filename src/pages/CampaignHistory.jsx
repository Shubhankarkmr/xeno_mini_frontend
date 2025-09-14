import React, { useState, useEffect } from "react";
import '../styles/CampaignHistory.css';

const API_URL = "http://localhost:5000/api";

export default function CampaignHistory() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  // Fetch campaign history
  const fetchCampaignHistory = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/campaigns/history`, {
        method: "GET",
        credentials: "include", // important if using HttpOnly cookies
      });
      const data = await res.json();
      if (res.ok) {
        const list = Array.isArray(data.data) ? data.data : [];
        // sort latest first
        list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setCampaigns(list);
      } else {
        setMessage("❌ " + (data.message || "Failed to fetch campaigns"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignHistory();
  }, []);

  // Send campaign
  const sendCampaign = async (id) => {
    try {
      const res = await fetch(`${API_URL}/campaigns/${id}/send`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        alert(`✅ Sent: ${data.campaign.sent}, Failed: ${data.campaign.failed}`);
        fetchCampaignHistory(); // refresh
      } else {
        alert("❌ " + (data.message || "Failed to send campaign"));
      }
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send campaign");
    }
  };

  if (loading) return <p className="p-4">Loading campaigns...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">📢 Campaign History</h1>
      {message && <p className="mb-2 text-red-500">{message}</p>}

      {campaigns.length === 0 ? (
        <p>No campaigns found. Please create a campaign first.</p>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Status</th>
              <th className="text-left p-2">Audience</th>
              <th className="text-left p-2">Sent</th>
              <th className="text-left p-2">Failed</th>
              <th className="text-left p-2">Created</th>
              <th className="text-left p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{c.name || "Untitled"}</td>
                <td className="p-2">{c.status || "draft"}</td>
                <td className="p-2">{c.audienceSize ?? 0}</td>
                <td className="p-2">{c.sent ?? 0}</td>
                <td className="p-2">{c.failed ?? 0}</td>
                <td className="p-2">
                  {c.createdAt ? new Date(c.createdAt).toLocaleString() : "-"}
                </td>
                <td className="p-2">
                  <button
                    onClick={() => sendCampaign(c._id)}
                    disabled={c.status === "sent"}
                    className={`px-3 py-1 rounded ${
                      c.status === "sent"
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-purple-500 text-white hover:bg-purple-600"
                    }`}
                  >
                    {c.status === "sent" ? "Sent" : "Send"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}


