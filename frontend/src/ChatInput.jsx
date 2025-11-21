import { useState } from 'react';

export default function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    onSend(text);
    setText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex space-x-2">
      <textarea
        className="flex-1 p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
      />
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        onClick={handleSend}
      >
        Send
      </button>
    </div>
  );
}
