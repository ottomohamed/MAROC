import { useState } from "react";

export default function ClaudeChat() {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", content: message };
    setChatLog([...chatLog, userMessage]);
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: message }),
      });
      const data = await res.json();

      setChatLog((prev) => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setChatLog((prev) => [...prev, { role: "assistant", content: "حدث خطأ في الاتصال بـ Claude" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border rounded p-4 w-full max-w-md mx-auto">
      <div className="h-64 overflow-y-auto border-b mb-4 p-2">
        {chatLog.map((msg, i) => (
          <div key={i} className={msg.role === "user" ? "text-right text-blue-700" : "text-left text-green-700"}>
            <p>{msg.content}</p>
          </div>
        ))}
        {loading && <p className="text-gray-400">جاري الرد...</p>}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 border rounded p-2"
          placeholder="اكتب رسالتك هنا..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">
          إرسال
        </button>
      </div>
    </div>
  );
}
