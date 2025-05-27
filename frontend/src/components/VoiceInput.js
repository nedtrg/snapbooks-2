import React, { useState } from "react";

export default function VoiceInput({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleVoiceInput = () => {
    setError(null);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      setLoading(true);

      try {
        // Step 1: Send voice text to backend (OpenAI parsing is done server-side)
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/parse-voice`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: transcript }),
          }
        );

        if (!response.ok) throw new Error("Failed to parse voice input");

        const transaction = await response.json();

        onResult(transaction); // Show parsed result in the UI

        // Step 2: Save transaction to backend
        const saveRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/submit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(transaction),
          }
        );

        if (!saveRes.ok) throw new Error("Failed to save transaction");

        alert("✅ Transaction saved successfully!");
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    recognition.onerror = (event) => {
      setError(`Speech recognition error: ${event.error}`);
    };

    recognition.start();
  };

  return (
    <div>
      <button
        onClick={handleVoiceInput}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 disabled:bg-gray-400"
        disabled={loading}
      >
        {loading ? "Processing..." : "🎤 Speak Transaction"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  );
}
