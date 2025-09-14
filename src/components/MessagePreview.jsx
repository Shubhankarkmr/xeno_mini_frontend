import React from "react";

const MessagePreview = ({ message, recipient }) => {
  return (
    <div style={styles.container}>
      <h3>Message Preview</h3>
      <div style={styles.recipient}>To: {recipient || "Customer Name"}</div>
      <div style={styles.messageBox}>{message || "Your personalized message will appear here..."}</div>
    </div>
  );
};

const styles = {
  container: { padding: "15px", border: "1px solid #ddd", borderRadius: "10px", marginBottom: "20px" },
  recipient: { marginBottom: "10px", fontWeight: "bold" },
  messageBox: { padding: "10px", background: "#f9f9f9", borderRadius: "8px", minHeight: "60px" }
};

export default MessagePreview;

