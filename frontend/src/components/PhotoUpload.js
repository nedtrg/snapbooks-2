"use client";
import React, { useState } from "react";
import Image from "next/image";
import { FileImage, Loader2, CheckCircle2 } from "lucide-react";

export default function PhotoUpload({ onResult }) {
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setError(null);
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("photo", file);

    try {
      // Step 1: Parse transaction from receipt
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/parse-photo`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) throw new Error("Failed to process receipt image");
      const transaction = await response.json();
      onResult(transaction);

      // Step 2: Submit parsed transaction
      const submitRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/submit`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transaction),
        }
      );

      if (!submitRes.ok) throw new Error("Failed to save transaction");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 p-6 rounded-xl shadow-md text-white">
      <label className="block text-sm font-semibold mb-2 items-center gap-2">
        <FileImage size={20} /> Upload Receipt
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="block w-full text-sm text-white file:mr-4 file:py-2 file:px-4
          file:rounded file:border-0 file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white hover:file:bg-blue-700"
      />

      {preview && (
        <div className="mt-4">
          <Image
            src={preview}
            alt="Receipt Preview"
            width={300}
            height={200}
            className="rounded-md mx-auto"
          />
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center mt-4 text-blue-400">
          <Loader2 className="animate-spin mr-2" /> Processing image...
        </div>
      )}

      {success && (
        <div className="flex items-center justify-center mt-4 text-green-500">
          <CheckCircle2 className="mr-2" /> Transaction saved successfully!
        </div>
      )}

      {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
    </div>
  );
}
