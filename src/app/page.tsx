"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/app/hooks/useSocket";

export default function Home() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSendMessage = useCallback(() => {
    if (message.trim() && socket) {
      socket.emit("message", message);
      setMessage("");
    }
  }, [message, socket]);

  useEffect(() => {
    if (socket) {
      console.log("Socket is available in the component");

      const handleMessage = (msg: string) => {
        console.log("Message from server:", msg);
        setMessages((prevMessages) => [...prevMessages, msg]);
      };

      socket.on("message", handleMessage);

      return () => {
        socket.off("message", handleMessage);
        console.log("Listener removed on cleanup");
      };
    }
  }, [socket]);

  return (
    <div>
      <h1>Welcome to Next.js with Socket.IO</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send Message</button>

      <div>
        <h2>Messages from Server:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
