import { Router } from "express";
import { saveMemory, getMemories, deleteMemory, getRecentMemories, searchMemories} from "../controllers/memoryController.js";

const router = Router();

router.post("/save", saveMemory);
router.get("/", getMemories);
router.delete("/:id", deleteMemory);
router.get("/recent", getRecentMemories);
router.get("/search", searchMemories);


export default router;