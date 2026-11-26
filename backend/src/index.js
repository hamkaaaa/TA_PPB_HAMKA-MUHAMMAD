import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import moodRoutes from "./routes/moodRoutes.js";
import trackRoutes from "./routes/trackRoutes.js";
import crateRoutes from "./routes/crateRoutes.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    app: "TempoMatch API",
    description: "RESTful API Direktori Lagu berdasarkan BPM dan Mood untuk DJ",
    endpoints: {
      auth: "/api/auth",
      moods: "/api/moods",
      tracks: "/api/tracks",
      crates: "/api/crates",
    },
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/tracks", trackRoutes);
app.use("/api/crates", crateRoutes);

const port = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`TempoMatch API running on port ${port}`);
  });
}

export default app;

