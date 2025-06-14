import { Router } from 'express';
import { 
  getOrganizationsAll, 
  getOrganizationById ,
  updateViewsCount
} from '../controllers/organization.controller';
import { authenticateClient } from '../middlewares/jwt.middlewares';

const router = Router();

router.get('/', authenticateClient, getOrganizationsAll);
router.get('/:id', authenticateClient, getOrganizationById);
router.put('/:id/views', authenticateClient, updateViewsCount);

export default router;