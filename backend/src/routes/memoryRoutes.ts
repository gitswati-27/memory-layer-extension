import { Router } from "express";
import { saveMemory } from "../controllers/memoryController.js";

const router = Router();

router.post("/save", saveMemory);

export default router;