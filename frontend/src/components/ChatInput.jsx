import { useState } from "react";

export default function ChatInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  return (
    <div className="flex p-4 border-t bg-white dark:bg-gray-800">
      <input
        className="flex-1 p-2 border rounded-lg mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-700 dark:text-white"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type your message..."
      />
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 rounded-lg transition"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
