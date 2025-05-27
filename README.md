SnapBooks
SnapBooks is a mobile/web application designed to help small retailers effortlessly track income and expenses using voice input, receipt photos, and AI assistance. Built with a human-centered approach, SnapBooks makes bookkeeping fast, simple, and joyful — no spreadsheets or accounting jargon required.

🚀 Features
🎤 Voice Input: Say transactions like "I earned 500 from sales" — AI extracts the data.

📸 Photo Upload: Snap a picture of a receipt — OCR + GPT parse the transaction.

🧠 AI-Powered Parsing: OpenAI interprets messy receipts or spoken phrases and converts them to clean JSON.

📊 Transaction History: View your income/expense records in a friendly format.

☁️ Cloud Backend: Built with Express.js, MongoDB, and OpenAI API integration.

🛠️ Tech Stack
Frontend	Backend	AI / OCR
Next.js	Express.js	OpenAI GPT-4
Tailwind CSS	MongoDB (Mongoose)	Tesseract.js
Tabler Icons	REST API	Multer (image upload)

📸 Screenshots
Add relevant screenshots or a GIF walkthrough here.

📦 Installation
1. Clone the repository
bash
Copy
Edit
git clone https://github.com/your-username/snapbooks.git
cd snapbooks
2. Setup the backend
bash
Copy
Edit
cd backend
npm install
Create a .env file in backend/:

env
Copy
Edit
PORT=5000
MONGO_URI=your_mongodb_connection_string
OPENAI_API_KEY=your_openai_api_key
Start the backend:

bash
Copy
Edit
npm start
3. Setup the frontend
bash
Copy
Edit
cd ../frontend
npm install
Create a .env.local file in frontend/:

env
Copy
Edit
NEXT_PUBLIC_API_URL=http://localhost:5000/api
Start the frontend:

bash
Copy
Edit
npm run dev
