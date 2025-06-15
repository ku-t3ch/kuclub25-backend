import { Router } from 'express';
import { 
  getAllProjects, 
  getProjectById, 
  getProjectsByOrganization,

} from '../controllers/project.controller';
import { authenticateClient } from '../middlewares/jwt.middlewares';

const router = Router();
router.get('/organization/:orgId', authenticateClient, getProjectsByOrganization);
router.get('/', authenticateClient, getAllProjects);
router.get('/:id', authenticateClient, getProjectById);

export default router;