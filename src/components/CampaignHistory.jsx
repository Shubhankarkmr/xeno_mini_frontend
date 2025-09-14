import React from "react";

const CampaignHistory = ({ campaigns }) => {
  return (
    <div style={styles.container}>
      <h3>Campaign History</h3>
      {campaigns.length === 0 ? (
        <p>No campaigns yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Audience Size</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {campaigns.map((c, i) => (
              <tr key={i}>
                <td>{c.name}</td>
                <td>{c.audienceSize}</td>
                <td style={{ color: c.status === "FAILED" ? "red" : "green" }}>{c.status}</td>
                <td>{new Date(c.date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const styles = {
  container: { padding: "15px", border: "1px solid #ddd", borderRadius: "10px", marginBottom: "20px" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { borderBottom: "1px solid #ccc", padding: "8px" },
  td: { padding: "8px", borderBottom: "1px solid #eee" },
};

export default CampaignHistory;
