import { Router } from 'express';
import { getOrganizationTypes } from '../controllers/organizationType.controller';
import { authenticateClient } from '../middlewares/jwt.middlewares';

const router = Router();

router.get('/', authenticateClient, getOrganizationTypes);

export default router;