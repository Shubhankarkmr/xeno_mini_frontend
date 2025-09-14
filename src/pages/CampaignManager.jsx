// src/components/AIGenerateMessages.jsx
import React, { useState } from "react";

const API_URL = "http://localhost:5000/api";

export default function AIGenerateMessages() {
  const [objective, setObjective] = useState("");
  const [audience, setAudience] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateMessages = async () => {
    if (!objective.trim()) {
      setError("Campaign objective is required");
      return;
    }
    setError("");
    setLoading(true);
    setMessages([]);

    try {
      const res = await fetch(`${API_URL}/ai/generate-messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ objective, audience }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessages(data.messages || []);
      } else {
        setError(data.message || "Failed to generate messages");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate messages");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">AI Message Generator</h2>

      <div className="mb-2">
        <label className="block font-medium">Campaign Objective</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          placeholder="E.g., bring back inactive users"
        />
      </div>

      <div className="mb-2">
        <label className="block font-medium">Audience (optional)</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="E.g., users who spent > ₹5K"
        />
      </div>

      <button
        onClick={generateMessages}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Messages"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {messages.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Suggested Messages:</h3>
          <ul className="list-disc list-inside space-y-1">
            {messages.map((msg, idx) => (
              <li key={idx} className="bg-gray-100 p-2 rounded">
                {msg}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
