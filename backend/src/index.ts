import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./auth/authRoutes";
import { initDb } from "./db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Job Hunt Tracker API running");
});

const PORT = process.env.PORT || 5000;
initDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);
    process.exit(1);
  });
