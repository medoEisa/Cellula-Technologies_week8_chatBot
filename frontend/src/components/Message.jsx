export default function Message({ message }) {
  const isUser = message.sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2`}>
      <div className={`${isUser ? "bubble-user" : "bubble-agent"} p-3 rounded-lg max-w-xs fade-in`}>
        {message.content}
      </div>
    </div>
  );
}
