import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";

export default function ChatWindow({ messages }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-gray-50 dark:bg-gray-900 transition">
      {messages.map((msg, idx) => (
        <ChatBubble key={idx} sender={msg.sender} content={msg.content} />
      ))}
      <div ref={bottomRef}></div>
    </div>
  );
}
