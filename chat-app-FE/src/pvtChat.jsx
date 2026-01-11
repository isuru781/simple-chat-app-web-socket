import React, { useState, useRef, useEffect } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";

const PrivateChat = () => {
  const stompClient = useRef(null);
  const [connected, setConnected] = useState(false);
  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // 🔌 Connect to WebSocket
  const connect = () => {
    if (!username.trim()) return alert("Please enter a username");

    // IMPORTANT: We pass the username as a query param so the 
    // HandshakeHandler on the backend can identify this session.
    const socket = new SockJS(`http://localhost:8080/websocket?user=${username}`);
    stompClient.current = Stomp.over(socket);

    // Optional: Disable noisy debug logging in console
    // stompClient.current.debug = null;

    stompClient.current.connect({}, () => {
      setConnected(true);
      console.log("✅ Connected as:", username);

      // 📥 Subscribe to private queue
      // Spring converts "/user/queue/private" to a unique path for THIS user
      stompClient.current.subscribe("/user/queue/private", (payload) => {
        const msg = JSON.parse(payload.body);
        setMessages((prev) => [...prev, msg]);
      });
    }, (error) => {
      console.error("Connection Error: ", error);
      setConnected(false);
    });
  };

  // 📤 Send private message
  const sendMessage = () => {
    if (!message.trim() || !receiver.trim()) return;

    const chatMessage = {
      sender: username,
      receiver: receiver,
      content: message,
      type: "CHAT",
    };

    // Send to the @MessageMapping("/private-chat") in your Controller
    stompClient.current.send(
      "/app/private-chat",
      {},
      JSON.stringify(chatMessage)
    );

    // Show your own message in the UI
    setMessages((prev) => [...prev, chatMessage]);
    setMessage("");
  };

  // Disconnect on component unmount
  useEffect(() => {
    return () => {
      if (stompClient.current !== null && connected) {
        stompClient.current.disconnect();
      }
    };
  }, [connected]);

  return (
    <div style={styles.container}>
      {!connected ? (
        <div style={styles.loginBox}>
          <h2>🔐 Join Private Chat</h2>
          <input
            style={styles.input}
            placeholder="Enter your username..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button style={styles.button} onClick={connect}>Connect</button>
        </div>
      ) : (
        <div style={styles.chatBox}>
          <div style={styles.header}>
            <h3>👤 {username} <span style={styles.onlineStatus}>(Online)</span></h3>
          </div>

          <div style={styles.messageArea}>
            {messages.length === 0 && <p style={{textAlign: 'center', color: '#888'}}>No messages yet.</p>}
            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  ...styles.messageWrapper,
                  justifyContent: msg.sender === username ? "flex-end" : "flex-start",
                }}
              >
                <div
                  style={{
                    ...styles.messageBubble,
                    background: msg.sender === username ? "#dcf8c6" : "#ffffff",
                    border: msg.sender === username ? "none" : "1px solid #ddd",
                  }}
                >
                  <small style={styles.senderName}>
                    {msg.sender === username ? "You" : msg.sender} → {msg.receiver}
                  </small>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={styles.footer}>
            <input
              style={styles.smallInput}
              placeholder="Send to..."
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
            />
            <div style={styles.inputGroup}>
              <input
                style={styles.input}
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button style={styles.sendButton} onClick={sendMessage}>Send</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Simple CSS-in-JS Styles
const styles = {
  container: { maxWidth: 500, margin: "50px auto", fontFamily: "Segoe UI, Tahoma, Geneva, Verdana, sans-serif" },
  loginBox: { padding: 20, border: "1px solid #ddd", borderRadius: 8, textAlign: "center", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" },
  chatBox: { border: "1px solid #ddd", borderRadius: 8, display: "flex", flexDirection: "column", height: "550px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)", background: "#f0f2f5" },
  header: { padding: "10px 20px", background: "#075e54", color: "white", borderTopLeftRadius: 8, borderTopRightRadius: 8 },
  onlineStatus: { fontSize: "12px", color: "#25d366" },
  messageArea: { flex: 1, padding: 20, overflowY: "auto", display: "flex", flexDirection: "column" },
  messageWrapper: { display: "flex", marginBottom: 10 },
  messageBubble: { padding: "8px 12px", borderRadius: 12, maxWidth: "70%", boxShadow: "0 1px 1px rgba(0,0,0,0.1)" },
  senderName: { fontSize: 10, color: "#666", display: "block", marginBottom: 4 },
  footer: { padding: 15, background: "white", borderBottomLeftRadius: 8, borderBottomRightRadius: 8 },
  inputGroup: { display: "flex", gap: 5, marginTop: 10 },
  input: { flex: 1, padding: 10, borderRadius: 20, border: "1px solid #ccc", outline: "none" },
  smallInput: { width: "100%", padding: "8px 12px", borderRadius: 4, border: "1px solid #eee", fontSize: 13 },
  button: { padding: "10px 20px", background: "#075e54", color: "white", border: "none", borderRadius: 4, cursor: "pointer" },
  sendButton: { padding: "10px 20px", background: "#128c7e", color: "white", border: "none", borderRadius: 20, cursor: "pointer" }
};

export default PrivateChat;