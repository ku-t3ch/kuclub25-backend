import { Router } from 'express';
import { getCampuses } from '../controllers/campus.controller';
import { authenticateClient } from '../middlewares/jwt.middlewares';

const router = Router();

router.get('/', authenticateClient, getCampuses);

export default router;