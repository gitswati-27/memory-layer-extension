import { Router } from "express";
import { saveMemory, getMemories, deleteMemory, getRecentMemories, searchMemories, getMemoriesByCollection, semanticSearch, chatWithMemory} from "../controllers/memoryController.js";

const router = Router();

router.post("/save", saveMemory);
router.get("/", getMemories);
router.delete("/:id", deleteMemory);
router.get("/recent", getRecentMemories);
router.get("/search", searchMemories);
router.get("/collection/:collectionId", getMemoriesByCollection);
router.get("/semantic-search", semanticSearch);
router.post("/chat", chatWithMemory);


export default router;