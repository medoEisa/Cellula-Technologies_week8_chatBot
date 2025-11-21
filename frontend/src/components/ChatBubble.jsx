export default function ChatBubble({ sender, content }) {
  const isUser = sender === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} my-2 animate-slideIn`}>
      <div className={`p-3 rounded-xl max-w-xs break-words shadow-lg
        ${isUser ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-800 text-black dark:text-white"}`}>
        {content}
      </div>
    </div>
  );
}
