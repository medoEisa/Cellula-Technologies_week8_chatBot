import { useState } from "react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) throw new Error("Login failed");
      const data = await res.json();
      localStorage.setItem("token", data.access_token);
      onLogin(data.access_token);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Login</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full p-2 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        value={email} onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full p-2 mb-4 rounded-lg border focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        value={password} onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
      >
        Login
      </button>
    </div>
  );
}
