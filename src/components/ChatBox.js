import React, { useState } from "react";
import "./ChatBox.css";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Hiển thị trạng thái loading

  // Hàm xử lý gửi tin nhắn
  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Hiển thị tin nhắn của người dùng
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setLoading(true); // Bắt đầu loading

    try {
      // Gửi yêu cầu POST đến API
      const response = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: input }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the API");
      }

      const data = await response.json();

      // Hiển thị câu trả lời từ API
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: data.answer },
      ]);
    } catch (error) {
      // Hiển thị thông báo lỗi nếu API không thành công
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "bot", text: "Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau." },
      ]);
    } finally {
      setLoading(false); // Dừng loading
    }
  };

  // Lắng nghe phím Enter
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Ngăn xuống dòng
      handleSendMessage();
    }
  };

  return (
    <div className="chatbot-container">
      {/* Header */}
      <div className="chatbot-header">Chatbot</div>

      {/* Message Area */}
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message ${
              msg.sender === "user" ? "chatbot-message-user" : "chatbot-message-bot"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="chatbot-message chatbot-message-bot">
            Đang xử lý...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="chatbot-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown} // Gửi khi nhấn Enter
          placeholder="Nhập câu hỏi..."
          className="chatbot-input-field"
        />
        <button onClick={handleSendMessage} className="chatbot-send-button">
          Gửi
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
