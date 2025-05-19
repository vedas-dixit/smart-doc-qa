// Utility functions for API interactions

export async function uploadDocument(file: File): Promise<{ text: string }> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await fetch("https://docubot-ai.onrender.com/upload", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    throw new Error("Failed to upload document");
  }
  return res.json();
}

export async function askQuestion(question: string, context: string): Promise<{ answer: string }> {
  const res = await fetch("https://docubot-ai.onrender.com/ask", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, context }),
  });
  if (!res.ok) {
    throw new Error("Failed to get answer");
  }
  return res.json();
} 