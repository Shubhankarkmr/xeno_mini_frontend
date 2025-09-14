import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/campaign.css';

const API_URL = "https://backend-hvgn.onrender.com/api";

export default function CampaignPage() {
  const navigate = useNavigate();

  // User state (Google Auth)
  const [user, setUser] = useState(null);

  // Campaign states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [segmentRules, setSegmentRules] = useState({
    logic: "AND",
    spend: { operator: ">", value: 10000 },
    visits: { operator: "<", value: 3 },
    inactiveDays: { operator: ">", value: 90 },
  });
  const [audienceSize, setAudienceSize] = useState(null);
  const [message, setMessage] = useState("");

  // AI states
  const [aiSegmentInput, setAiSegmentInput] = useState("");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiTags, setAiTags] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_URL}/auth`, {
          credentials: "include",
        });
        const data = await res.json();
        if (res.ok) setUser(data.user);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  // Parse AI segment rules
  const parseSegmentRules = async () => {
    if (!aiSegmentInput.trim()) return setMessage("❌ Describe the audience first");
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_URL}/ai/parse-segment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: aiSegmentInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setSegmentRules(data.rules);
        setMessage("✅ Segment rules updated from AI input");
      } else {
        setMessage("❌ Failed to parse segment: " + (data.message || ""));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ AI parsing error");
    } finally {
      setLoadingAI(false);
    }
  };

  // Fetch AI message suggestions
  const fetchAiSuggestions = async () => {
    if (!name.trim()) return setMessage("❌ Campaign name required for AI suggestions");
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_URL}/ai/generate-messages`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          objective: name,
          audience: `Spend ${segmentRules.spend.operator} ${segmentRules.spend.value}, Visits ${segmentRules.visits.operator} ${segmentRules.visits.value}, Inactive Days ${segmentRules.inactiveDays.operator} ${segmentRules.inactiveDays.value}`
        }),
      });
      const data = await res.json();
      if (res.ok) setAiSuggestions(data.suggestions || []);
      else setMessage("❌ Failed to fetch AI suggestions: " + (data.message || ""));
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to fetch AI suggestions");
    } finally {
      setLoadingAI(false);
    }
  };

  // Fetch AI tags
  const fetchAiTags = async () => {
    if (!name.trim()) return setMessage("❌ Campaign name required for AI tagging");
    setLoadingAI(true);
    try {
      const res = await fetch(`${API_URL}/ai/auto-tag`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          audience: JSON.stringify(segmentRules)
        }),
      });
      const data = await res.json();
      if (res.ok) setAiTags(data.tags || []);
      else setMessage("❌ Failed to fetch AI tags");
    } catch (err) {
      console.error(err);
      setMessage("❌ AI tagging error");
    } finally {
      setLoadingAI(false);
    }
  };

  // Preview audience
  const previewAudience = async () => {
    if (!name.trim()) return setMessage("❌ Campaign name is required for preview");
    try {
      const res = await fetch(`${API_URL}/campaigns/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, segmentRules, preview: true }),
      });
      const data = await res.json();
      if (res.ok) {
        setAudienceSize(data.audienceSize);
        setMessage(`✅ Audience previewed: ${data.audienceSize} customers`);
      } else {
        setMessage("❌ " + (data.message || "Failed to preview audience"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to preview audience");
    }
  };

  // Create campaign
  const createCampaign = async () => {
    if (!name.trim()) return setMessage("❌ Campaign name is required");
    try {
      const res = await fetch(`${API_URL}/campaigns/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, segmentRules, tags: aiTags }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Campaign created successfully!");
        setName("");
        setDescription("");
        setAudienceSize(null);
        setAiSuggestions([]);
        setAiTags([]);
        navigate("/campaign-history");
      } else {
        setMessage("❌ " + (data.message || "Failed to create campaign"));
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create campaign");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create Campaign</h1>

      {user && <p className="text-gray-700 mb-4">Welcome, {user.name}</p>}

      {message && (
        <p className={`mb-4 px-4 py-2 rounded ${message.startsWith("✅") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
          {message}
        </p>
      )}

      <div className="space-y-5">
        <input type="text" placeholder="Campaign Name" value={name} onChange={(e)=>setName(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition" />

        <textarea placeholder="Description" value={description} onChange={(e)=>setDescription(e.target.value)}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none transition resize-none" rows={4} />

        {/* AI Segment Input */}
        <div className="mt-4">
          <input type="text" placeholder="Describe audience in natural language..." value={aiSegmentInput}
            onChange={(e)=>setAiSegmentInput(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none transition" />
          <button onClick={parseSegmentRules} disabled={loadingAI}
            className="mt-2 bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg">Parse Segment Rules</button>
        </div>

        {/* Segment Rules */}
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 mt-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-3">Segment Rules</h2>
          {["spend","visits","inactiveDays"].map(rule => (
            <div key={rule} className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
              <span className="w-32 font-medium text-gray-600">{rule.charAt(0).toUpperCase()+rule.slice(1)}:</span>
              <select value={segmentRules[rule].operator} 
                onChange={(e)=>setSegmentRules({...segmentRules,[rule]:{...segmentRules[rule],operator:e.target.value}})}
                className="border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none">
                <option value=">">More than</option>
                <option value="<">Less than</option>
              </select>
              <input type="number" value={segmentRules[rule].value}
                onChange={(e)=>setSegmentRules({...segmentRules,[rule]:{...segmentRules[rule],value:+e.target.value}})}
                className="border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-400 outline-none"/>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button onClick={previewAudience} className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">Preview Audience</button>
          <button onClick={fetchAiSuggestions} disabled={loadingAI} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg">{loadingAI?"Loading...":"AI Message Suggestions"}</button>
          <button onClick={fetchAiTags} disabled={loadingAI} className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg">{loadingAI?"Loading...":"AI Auto-Tags"}</button>
          <button onClick={createCampaign} className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg">Create Campaign</button>
        </div>

        {/* Audience Size */}
        {audienceSize!==null && <p className="mt-3 text-gray-700 font-medium">Audience Size: {audienceSize}</p>}

        {/* AI Suggestions */}
        {aiSuggestions.length>0 && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">AI Suggestions:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {aiSuggestions.map((msg,i)=><li key={i} className="text-gray-700">{msg}</li>)}
            </ul>
          </div>
        )}

        {/* AI Tags */}
        {aiTags.length>0 && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-700 mb-2">AI Suggested Tags:</h3>
            <ul className="list-disc pl-5 space-y-1">
              {aiTags.map((tag,i)=><li key={i} className="text-gray-700">{tag}</li>)}
            </ul>
          </div>
        )}

      </div>
    </div>
  );
} 
