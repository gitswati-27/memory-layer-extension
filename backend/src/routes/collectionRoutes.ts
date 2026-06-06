import { Router } from "express";

import {
  createCollection,
  getCollections,
} from "../controllers/collectionController.js";

const router = Router();

router.post("/", createCollection);
router.get("/", getCollections);

export default router;