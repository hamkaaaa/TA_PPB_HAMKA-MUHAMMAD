import express from "express";
import { MoodController } from "../controllers/moodController.js";
import { optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", MoodController.getAll);
router.get("/:id", optionalAuth, MoodController.getById);
router.post("/", MoodController.create);
router.put("/:id", MoodController.update);
router.delete("/:id", MoodController.remove);

export default router;

