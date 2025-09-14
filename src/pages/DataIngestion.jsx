import React, { useState } from "react";
import Papa from "papaparse"; // for CSV preview

export default function DataIngestion() {
  const [type, setType] = useState("customers"); // customers | orders
  const [mode, setMode] = useState("json"); // json | file
  const [jsonData, setJsonData] = useState("");
  const [file, setFile] = useState(null);
  const [response, setResponse] = useState(null);

  const handleFile = (e) => setFile(e.target.files[0]);

  // Simulate JSON ingestion
  const handleJsonIngest = () => {
    try {
      const parsed = JSON.parse(jsonData);
      setResponse({
        success: true,
        message: `${parsed.length || 1} ${type} ingested successfully.`,
      });
    } catch (err) {
      setResponse({ success: false, message: "❌ Invalid JSON format" });
    }
  };

  // Simulate CSV ingestion
  const handleFileIngest = () => {
    if (!file) return setResponse({ success: false, message: "❌ Please select a CSV file" });

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setResponse({
          success: true,
          message: `${results.data.length} ${type} ingested successfully from CSV.`,
        });
      },
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📊 Data Ingestion (Frontend Only)</h1>

      {/* Select Type */}
      <div className="mb-4">
        <label className="font-semibold">Data Type:</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          <option value="customers">Customers</option>
          <option value="orders">Orders</option>
        </select>
      </div>

      {/* Select Mode */}
      <div className="mb-4">
        <label className="font-semibold">Mode:</label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          className="ml-2 p-2 border rounded"
        >
          <option value="json">Paste JSON</option>
          <option value="file">Upload CSV</option>
        </select>
      </div>

      {/* JSON Input */}
      {mode === "json" && (
        <div className="mb-6">
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            rows={10}
            placeholder='[{"name":"Alice","email":"alice@example.com"}]'
            className="w-full border p-2 rounded font-mono"
          />
          <button
            onClick={handleJsonIngest}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Simulate JSON Ingestion
          </button>
        </div>
      )}

      {/* File Upload */}
      {mode === "file" && (
        <div className="mb-6">
          <input type="file" accept=".csv" onChange={handleFile} />
          <button
            onClick={handleFileIngest}
            className="ml-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Simulate CSV Ingestion
          </button>
        </div>
      )}

      {/* Response */}
      {response && (
        <div
          className={`p-4 rounded mt-4 ${
            response.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {response.message}
        </div>
      )}

      {/* Mock API Docs */}
      <div className="mt-10 border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">📖 API Documentation (Frontend Mock)</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm">
{`POST /api/ingest/customers/json
Body: [ { "name": "Alice", "email": "alice@example.com" } ]

POST /api/ingest/orders/json
Body: [ { "orderId": "123", "amount": 2500, "customerId": "c1" } ]

POST /api/ingest/customers/upload
FormData: file (CSV)

POST /api/ingest/orders/upload
FormData: file (CSV)`}
        </pre>
      </div>
    </div>
  );
}
