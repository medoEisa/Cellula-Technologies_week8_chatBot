import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Message from "../components/Message";
import Spinner from "../components/Spinner";
import Navbar from "../components/Navbar";

export default function Chat({ user, onLogout }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const sendMessage = async () => {
    if (!input) return;
    const userMessage = { sender: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8000/chat", { user_input: input }, { headers: { Authorization: user.token } });
      const agentMessage = { sender: "agent", content: res.data.response };
      setMessages(prev => [...prev, agentMessage]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-b from-purple-100 to-blue-100">
      <Navbar user={user} onLogout={onLogout} />
      <div className="flex-1 p-4 overflow-auto">
        {messages.map((msg, i) => <Message key={i} message={msg} />)}
        {loading && <Spinner />}
        <div ref={bottomRef}></div>
      </div>
      <div className="p-4 flex gap-2 bg-white border-t">
        <input className="flex-1 p-2 border rounded input-focus" value={input} onChange={e => setInput(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === "Enter" && sendMessage()} />
        <button onClick={sendMessage} className="bg-purple-500 text-white px-4 rounded hover:bg-purple-600 transition">Send</button>
      </div>
    </div>
  );
}
