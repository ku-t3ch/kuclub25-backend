import { Router } from "express";
import { 
  getOrganizationsAll, 
  getOrganizationById, 
  updateViewCount
} from "../controllers/organization.controller";
import { authenticateClient } from "../middlewares/jwt.middlewares";

const router = Router();

router.get('/', authenticateClient, getOrganizationsAll);
router.get('/:id', authenticateClient, getOrganizationById);
router.put('/:id/views', authenticateClient, updateViewCount);

export default router;