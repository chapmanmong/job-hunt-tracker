import { Router } from "express";
import { getJobs, createJob, updateJob, deleteJob } from "./jobController";
import { authenticateToken } from "../middleware/auth";

const router = Router();

// All job routes require authentication
router.use(authenticateToken);

router.get("/", getJobs);
router.post("/", createJob);
router.put("/:id", updateJob);
router.delete("/:id", deleteJob);

export default router;
