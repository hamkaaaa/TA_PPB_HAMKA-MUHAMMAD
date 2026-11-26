import express from "express";
import { TrackController } from "../controllers/trackController.js";
import { optionalAuth, requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, TrackController.getAll);
router.get("/genres", optionalAuth, TrackController.getGenres);
router.get("/:id/preview", optionalAuth, TrackController.getPreview);
router.get("/:id", optionalAuth, TrackController.getById);
router.post("/", requireAuth, TrackController.create);
router.put("/:id", requireAuth, TrackController.update);
router.delete("/:id", requireAuth, TrackController.remove);

export default router;
