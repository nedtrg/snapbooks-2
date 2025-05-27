"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { IconMicrophone, IconCamera, IconBook } from "@tabler/icons-react";
import VoiceInput from "../components/VoiceInput";
import PhotoUpload from "../components/PhotoUpload";

export default function Home() {
  const [message, setMessage] = useState("");
  const [voiceTransaction, setVoiceTransaction] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}`)
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => console.error("Error:", err));
  }, []);

  return (
    <main className="min-h-screen p-6 bg-black text-white">
      <motion.div
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex justify-center items-center gap-3 mb-4">
          <IconBook size={36} className="text-yellow-400" />
          <h1 className="text-4xl font-bold">SnapBooks</h1>
        </div>

        <p className="text-lg mb-6 text-gray-300">
          SnapBooks helps small shopkeepers record income and expenses using
          voice and photo input—powered by AI.
        </p>

        <motion.div
          className="space-y-8 bg-gray-900 p-6 rounded-xl shadow-lg"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div>
            <div className="flex items-center gap-2 mb-2">
              <IconMicrophone size={24} className="text-blue-500" />
              <span className="font-semibold">Voice Transaction</span>
            </div>
            <VoiceInput onResult={setVoiceTransaction} />
          </div>

          {voiceTransaction && (
            <motion.div
              className="bg-green-700 p-4 rounded text-left text-sm"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h2 className="font-semibold mb-2 text-white">
                Parsed Transaction:
              </h2>
              <pre className="text-green-200">
                {JSON.stringify(voiceTransaction, null, 2)}
              </pre>
            </motion.div>
          )}

          <div>
            <div className="flex items-center gap-2 mb-2">
              <IconCamera size={24} className="text-pink-500" />
              <span className="font-semibold">Upload Receipt</span>
            </div>
            <PhotoUpload onUpload={setPhotoPreview} />
          </div>

          {photoPreview && (
            <motion.div
              className="mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Image
                src={photoPreview}
                alt="Uploaded"
                className="rounded-lg mx-auto"
                width={300}
                height={200}
              />
            </motion.div>
          )}
        </motion.div>

        {message && (
          <p className="mt-6 text-sm text-gray-500 italic">{message}</p>
        )}
      </motion.div>
    </main>
  );
}
