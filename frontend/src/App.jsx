import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FiSend, FiLogOut, FiPlus } from "react-icons/fi";

function App() {
  const [view, setView] = useState(""); // "login", "signup", "chat"
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [message, setMessage] = useState("");
  const [userInput, setUserInput] = useState("");
  const [conversations, setConversations] = useState([{ id: 1, name: "New Chat", history: [] }]);
  const [activeConvId, setActiveConvId] = useState(1);
  const [typing, setTyping] = useState(false);
  const chatEndRef = useRef(null);

  const backendUrl = "http://localhost:8000";

  // ----------------- Auth -----------------
  const handleSignup = async () => {
    try {
      const res = await axios.post(`${backendUrl}/signup`, { username, email, password });
      setMessage(`🎉 Signup successful! User ID: ${res.data.id}`);
      setView("login");
    } catch (err) {
      setMessage(err.response?.data?.detail || "Signup failed ❌");
    }
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${backendUrl}/login`, { email, password });
      setToken(res.data.access_token);
      setMessage(`✅ Welcome ${res.data.username}`);
      setView("chat");

      // Load history if any
      const historyRes = await axios.get(`${backendUrl}/history`, {
        headers: { Authorization: res.data.access_token }
      });
      if (historyRes.data && historyRes.data.length) {
        setConversations([{ id: 1, name: "New Chat", history: historyRes.data }]);
      }
    } catch (err) {
      setMessage(err.response?.data?.detail || "Login failed ❌");
    }
  };

  const handleLogout = () => {
    setToken(null);
    setView("");
    setConversations([{ id: 1, name: "New Chat", history: [] }]);
    setActiveConvId(1);
    setMessage("👋 Logged out successfully.");
  };

  // ----------------- Chat -----------------
  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const newUserMsg = { sender: "user", content: userInput, timestamp: new Date() };
    setConversations(prev => prev.map(conv => conv.id === activeConvId ? { ...conv, history: [...conv.history, newUserMsg] } : conv));
    setUserInput("");
    setTyping(true);

    try {
      const res = await axios.post(
        `${backendUrl}/chat`,
        { user_input: userInput },
        { headers: { Authorization: token } }
      );

      setTimeout(() => {
        const agentMsg = {
          sender: "agent",
          content: res.data.response,
          tool: res.data.tool_used || "",
          timestamp: new Date()
        };
        setConversations(prev => prev.map(conv => conv.id === activeConvId ? { ...conv, history: [...conv.history, agentMsg] } : conv));
        setTyping(false);
      }, 1000 + Math.random() * 1000);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Failed to send message ❌");
      setTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, typing, activeConvId]);

  const addConversation = () => {
    const newId = conversations.length + 1;
    setConversations([...conversations, { id: newId, name: "New Chat", history: [] }]);
    setActiveConvId(newId);
  };

  const bubbleStyle = (sender) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: sender === "user" ? "flex-end" : "flex-start",
    background: sender === "user" ? "#2575fc" : "#1c1c1c",
    color: sender === "user" ? "#fff" : "#fff",
    padding: "12px 18px",
    borderRadius: "15px",
    maxWidth: "70%",
    margin: "6px 0",
    wordBreak: "break-word",
    fontSize: "1rem"
  });

  const messageHeaderStyle = {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "4px",
    fontSize: "0.8rem",
    color: "#aaa"
  };

  const toolStyle = {
    fontSize: "0.75rem",
    color: "#888",
    marginTop: "4px"
  };

  const containerStyle = {
    display: "flex",
    height: "100vh",
    fontFamily: "Arial, sans-serif",
    background: "#000",
    color: "#fff"
  };

  const sidebarStyle = {
    width: 220,
    background: "#111",
    display: "flex",
    flexDirection: "column",
    padding: "10px"
  };

  const convButtonStyle = (active) => ({
    padding: "10px",
    marginBottom: "6px",
    background: active ? "#2575fc" : "#222",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    textAlign: "left",
    fontSize: "1rem"
  });

  const chatContainerStyle = {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    padding: "20px",
    overflowY: "auto"
  };

  const inputBarStyle = {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #333",
    background: "#111",
  };

  const inputStyle = {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    border: "1px solid #333",
    outline: "none",
    fontSize: "1rem",
    background: "#222",
    color: "#fff"
  };

  const buttonStyle = {
    padding: "10px 22px",
    marginLeft: "10px",
    borderRadius: "10px",
    border: "none",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "0.3s",
    background: "#2575fc",
    color: "#fff",
  };

  return (
    <div style={containerStyle}>
      {view === "chat" ? (
        <>
          {/* Sidebar */}
          <div style={sidebarStyle}>
            <h3 style={{ marginBottom: 10 }}>Conversations</h3>
            {conversations.map(conv => (
              <button
                key={conv.id}
                style={convButtonStyle(conv.id === activeConvId)}
                onClick={() => setActiveConvId(conv.id)}
              >
                {conv.name}
              </button>
            ))}
            <button style={{ ...convButtonStyle(false), marginTop: 10, background: "#2575fc" }} onClick={addConversation}>
              <FiPlus style={{ marginRight: 5 }} /> New Chat
            </button>
            <button style={{ ...buttonStyle, marginTop: "auto" }} onClick={handleLogout}>
              <FiLogOut style={{ marginRight: 5 }} /> Logout
            </button>
          </div>

          {/* Chat Area */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
            <div style={chatContainerStyle}>
              {conversations.find(c => c.id === activeConvId)?.history.map((msg, idx) => (
                <div key={idx} style={bubbleStyle(msg.sender)}>
                  <div style={messageHeaderStyle}>
                    <span>{msg.sender === "user" ? "You" : "Agent"}</span>
                    <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div>{msg.content}</div>
                  {msg.tool && msg.sender === "agent" && (
                    <div style={toolStyle}>🛠 Tool used: {msg.tool}</div>
                  )}
                </div>
              ))}
              {typing && (
                <div style={bubbleStyle("agent")}>
                  <div style={messageHeaderStyle}>
                    <span>Agent</span>
                    <span>...</span>
                  </div>
                  <div>🤖 Agent is typing<span className="typing-dots"><span>.</span><span>.</span><span>.</span></span></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input bar */}
            <div style={inputBarStyle}>
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                style={inputStyle}
              />
              <button style={buttonStyle} onClick={sendMessage}>
                <FiSend />
              </button>
            </div>
          </div>
        </>
      ) : (
        // Login / Signup Centered
        <div style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          width: "100%"
        }}>
          <h1 style={{ marginBottom: 20 }}>Cellula Chat App</h1>
          {!view && (
            <div>
              <button style={buttonStyle} onClick={() => setView("login")}>Login</button>
              <button style={{ ...buttonStyle, marginLeft: 10, background: "#6a11cb" }} onClick={() => setView("signup")}>Signup</button>
            </div>
          )}
          {view && (
            <div style={{ marginTop: 20, width: "80%", maxWidth: 400 }}>
              {view === "signup" && (
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  style={{ display: "block", margin: "10px auto", padding: 10, width: "100%", borderRadius: 10, border: "1px solid #333", background: "#222", color: "#fff" }}
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ display: "block", margin: "10px auto", padding: 10, width: "100%", borderRadius: 10, border: "1px solid #333", background: "#222", color: "#fff" }}
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ display: "block", margin: "10px auto", padding: 10, width: "100%", borderRadius: 10, border: "1px solid #333", background: "#222", color: "#fff" }}
              />
              {view === "signup" ? (
                <button style={{ ...buttonStyle, marginTop: 10, width: "100%" }} onClick={handleSignup}>Signup</button>
              ) : (
                <button style={{ ...buttonStyle, marginTop: 10, width: "100%" }} onClick={handleLogin}>Login</button>
              )}
            </div>
          )}
          {message && <p style={{ color: "yellow", textAlign: "center", marginTop: 10 }}>{message}</p>}
        </div>
      )}

      <style>
        {`
          .typing-dots span {
            animation: blink 1.4s infinite;
            display: inline-block;
            margin-left: 2px;
          }
          .typing-dots span:nth-child(1) { animation-delay: 0s; }
          .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
          .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
          @keyframes blink {
            0%, 80%, 100% { opacity: 0; }
            40% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

export default App;
