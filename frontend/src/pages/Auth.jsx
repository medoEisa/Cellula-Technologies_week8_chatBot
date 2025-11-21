import { useState } from "react";
import axios from "axios";

export default function Auth({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8000/login", { email, password });
      onLogin({ username: res.data.username, user_id: res.data.user_id, token: res.data.access_token });
    } catch (e) {
      setError("Invalid credentials");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-500">Login</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input type="email" placeholder="Email" className="w-full mb-4 p-2 border rounded input-focus" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded input-focus" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleLogin} className="w-full bg-purple-500 text-white p-2 rounded hover:bg-purple-600 transition">Login</button>
      </div>
    </div>
  );
}
