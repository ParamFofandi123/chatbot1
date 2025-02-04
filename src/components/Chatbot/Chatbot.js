import React, { useState, useEffect } from "react";
import "./Chatbot.css";
import icon from "../Assets/chatbot.gif"; // Import chatbot icon

export const Chatbot = () => {
  const [messages, setMessages] = useState([]); // Store chat messages
  const [input, setInput] = useState(""); // Store user input
  const [isChatOpen, setIsChatOpen] = useState(false); // Toggle chatbot visibility
  const [loading, setLoading] = useState(false); // Tracks if bot is responding
  const [username, setUsername] = useState("User"); // Store formatted username

  useEffect(() => {
    let storedUsername = localStorage.getItem("username") || "User";
    storedUsername = storedUsername.replace(/[0-9]/g, ""); // Remove numbers
    storedUsername =
      storedUsername.charAt(0).toUpperCase() + storedUsername.slice(1);
    setUsername(storedUsername); // Set formatted username

    if (isChatOpen && messages.length === 0) {
      setMessages([
        {
          role: "bot",
          content: `Hello ${storedUsername}! How can I assist you today?`,
        },
      ]);
    }
  }, [isChatOpen]); // Runs when `isChatOpen` changes

  const sendMessage = async () => {
    if (!input.trim() || loading) return; // Prevent empty or duplicate messages

    const newMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput(""); // Clear input field
    setLoading(true); // Show loading state

    try {
      const response = await fetch("http://localhost:4000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from the server.");
      }

      const data = await response.json();
      const botReply = {
        role: "bot",
        content: formatMessageContent(data.reply),
      };
      setMessages((prev) => [...prev, botReply]);
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false); // Re-enable input
    }
  };

  const formatMessageContent = (content) => {
    return content.replace(
      /(\*\*|##|###)(.*?)(\*\*|##|###)/g,
      (match, p1, p2) => {
        return `<strong>${p2}</strong>`; // Wrap special text in <strong> tags
      }
    );
  };

  return (
    <div className="Chat-bot">
      {!isChatOpen && (
        <div className="chat-icon-container">
          <img
            src={icon}
            className="chat-icon"
            onClick={() => setIsChatOpen(true)}
            alt="Chatbot Icon"
          />
        </div>
      )}

      {isChatOpen && (
        <div className="chat-container">
          <div className="chat-header">
            <i>AI Chatbot</i>
            <button className="close-chat" onClick={() => setIsChatOpen(false)}>
              ✖
            </button>
          </div>
          <div className="chat-messages">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`message ${msg.role === "user" ? "user" : "bot"}`}
                dangerouslySetInnerHTML={{
                  __html:
                    msg.role === "bot"
                      ? formatMessageContent(msg.content)
                      : msg.content,
                }}
              />
            ))}
          </div>
          <div className="chat-input-container">
            <input
              className="chat-input"
              type="text"
              placeholder={`Type your message, ${username}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => !loading && e.key === "Enter" && sendMessage()} // Handle Enter key
              disabled={loading} // Disable input when loading
            />
            <button
              className="send-button"
              onClick={sendMessage}
              disabled={loading}
            >
              {loading ? "..." : "Send"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
