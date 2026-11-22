import express from "express";
import { TrackController } from "../controllers/trackController.js";

const router = express.Router();

router.get("/", TrackController.getAll);
router.get("/genres", TrackController.getGenres);
router.get("/:id", TrackController.getById);
router.post("/", TrackController.create);
router.put("/:id", TrackController.update);
router.delete("/:id", TrackController.remove);

export default router;

