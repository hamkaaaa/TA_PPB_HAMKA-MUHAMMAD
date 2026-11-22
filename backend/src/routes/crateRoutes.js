import express from "express";
import { CrateController } from "../controllers/crateController.js";

const router = express.Router();

router.get("/", CrateController.getAll);
router.get("/:id", CrateController.getById);
router.post("/", CrateController.create);
router.put("/:id", CrateController.update);
router.delete("/:id", CrateController.remove);
router.post("/:id/tracks", CrateController.addTrack);
router.delete("/:id/tracks/:trackId", CrateController.removeTrack);

export default router;

