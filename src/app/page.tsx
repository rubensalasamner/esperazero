"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/app/hooks/useSocket";

export default function Home() {
  const socket = useSocket(); // Custom hook to initialize socket connection
  const [message, setMessage] = useState(""); // State to manage input value
  const [messages, setMessages] = useState<string[]>([]); // State to store messages from server

  // Function to handle sending a message
  const handleSendMessage = useCallback(() => {
    if (message.trim() && socket) {
      // Check if message is not just whitespace
      socket.emit("message", message); // Emit the message to the server
      setMessage(""); // Clear the input field after sending
    }
  }, [message, socket]);

  // Effect to setup socket listeners
  useEffect(() => {
    if (socket) {
      console.log("Socket is available in the component");

      // Listener for receiving messages from the server
      const handleMessage = (msg: string) => {
        console.log("Message from server:", msg);
        setMessages((prevMessages) => [...prevMessages, msg]); // Add the message to the list
      };

      socket.on("message", handleMessage);

      // Cleanup listener on component unmount or socket changes
      return () => {
        socket.off("message", handleMessage);
        console.log("Listener removed on cleanup");
      };
    }
  }, [socket]); // Only run when socket instance changes

  return (
    <div>
      <h1>Welcome to Next.js with Socket.IO</h1>
      <input
        type="text"
        value={message} // Controlled input value
        onChange={(e) => setMessage(e.target.value)} // Update state on input change
        placeholder="Type a message"
      />
      <button onClick={handleSendMessage}>Send Message</button>

      <div>
        <h2>Messages from Server:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li> // Display received messages
          ))}
        </ul>
      </div>
    </div>
  );
}
