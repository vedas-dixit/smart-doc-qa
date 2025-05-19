"use client"
import { useState } from "react";

export default function Home() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [context, setContext] = useState("");
  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setFileName(file.name);
    setContext("");
    setAnswer("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setContext(data.text || "");
    } catch (e) {
      setContext("");
      alert("Failed to extract text from document.");
    } finally {
      setUploading(false);
    }
  };

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, context }),
      });
      const data = await res.json();
      setAnswer(data.answer || "No answer returned.");
    } catch (e) {
      setAnswer("Error getting answer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "40px auto", padding: 20 }}>
      <h1>Ask a Question from Document</h1>
      <input
        type="file"
        accept=".pdf,.txt,.docx"
        onChange={handleFileChange}
        disabled={uploading}
        style={{ marginBottom: 12 }}
      />
      {fileName && <div style={{ marginBottom: 8 }}>Uploaded: {fileName}</div>}
      <textarea
        value={context}
        onChange={e => setContext(e.target.value)}
        placeholder="Document context will appear here..."
        rows={6}
        style={{ width: "100%", marginBottom: 12, padding: 8 }}
        disabled={uploading}
      />
      <input
        type="text"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Type your question..."
        style={{ width: "100%", padding: 8, marginBottom: 8 }}
        onKeyDown={e => { if (e.key === "Enter") handleAsk(); }}
        disabled={loading || uploading}
      />
      <button onClick={handleAsk} disabled={loading || uploading || !question.trim() || !context.trim()} style={{ padding: 8, width: "100%" }}>
        {loading ? "Asking..." : "Ask"}
      </button>
      <div style={{ marginTop: 24, minHeight: 40 }}>
        {answer && <div><b>Answer:</b> {answer}</div>}
      </div>
    </div>
  );
}
