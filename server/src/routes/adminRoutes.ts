import { Router } from "express";
import { AdminController } from "../controllers/adminController";

const router = Router();

// GET /api/admin/conversations
router.get("/conversations", AdminController.getConversations);
router.post("/conversations/:conversationId/reply", AdminController.replyToConversation);

export default router;
