export default function ChatMessage({ message }) {
    const isUser = message.sender === 'user';
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`rounded-lg p-3 max-w-xs ${isUser ? 'bg-indigo-600 text-white' : 'bg-white text-gray-800 shadow'}`}>
          {message.text}
        </div>
      </div>
    );
  }
  