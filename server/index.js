import "dotenv/config";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";   // baaki imports ke saath

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("API running 🚀"));
app.use("/api/auth", authRoutes);                  // app.get("/") ke neeche

const PORT = process.env.PORT || 8000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`🚀 Server on port ${PORT}`));
});
