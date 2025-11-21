import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Signup({ onSignup }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignup = async () => {
    try {
      const res = await axios.post("http://localhost:8000/signup", { username, email, password });
      const tokenRes = await axios.post("http://localhost:8000/login", { email, password });
      onSignup({ username: res.data.username, user_id: res.data.id, token: tokenRes.data.access_token });
    } catch (e) {
      setError(e.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-green-400 to-blue-500">
      <div className="bg-white p-10 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">Sign Up</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input type="text" placeholder="Username" className="w-full mb-4 p-2 border rounded input-focus" value={username} onChange={e => setUsername(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full mb-4 p-2 border rounded input-focus" value={email} onChange={e => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full mb-4 p-2 border rounded input-focus" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleSignup} className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition mb-2">Sign Up</button>
        <p className="text-center text-gray-500">Already have an account? <Link to="/" className="text-blue-500 hover:underline">Login</Link></p>
      </div>
    </div>
  );
}
