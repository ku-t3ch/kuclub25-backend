import { Router } from 'express';
import { 
  getOrganizationsAll, 
  getOrganizationById 
} from '../controllers/organization.controller';
import { authenticateClient } from '../middlewares/jwt.middlewares';

const router = Router();

router.get('/', authenticateClient, getOrganizationsAll);
router.get('/:id', authenticateClient, getOrganizationById);

export default router;