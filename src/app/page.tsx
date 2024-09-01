"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket} from "@/app/hooks/useSocket";

export default function Home() {
  const socket = useSocket();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([])

  useEffect(() => {
    if(socket) {
      console.log("Socket is available");

      const handleMessage = (msg: string) => {
        console.log("Message from server");
        setMessages((prevMessages) => [...prevMessages, msg])
      }

      socket.on("message", handleMessage);

      return () => {
        socket.off("message", handleMessage);
        console.log("Listener removed on cleanup")
      }
    }
  }, [socket])


  const handleSendMessage = useCallback(() => {
    if( message && socket) {
      socket.emit("message", message)
      setMessage("");
    }
  }, [message, socket])

  return(
      <div>
        <h1>Socket IO very cool very groovey stuff. Hard times dosent lanst only hard peple.</h1>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={handleSendMessage}>Send message</button>

        <div>
          <h2>Someone sent you a message</h2>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
        </div>

      </div>
  )
}
