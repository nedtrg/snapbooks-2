const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");

const transactionRoutes = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/parse-voice", require("./routes/parse-voice"));
app.use("/api/parse-photo", require("./routes/parse-photo"));
app.use("/api/submit", require("./routes/submit"));

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.use("/api/transactions", transactionRoutes);

app.get("/", (req, res) => {
  res.send("SnapBooks API is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
