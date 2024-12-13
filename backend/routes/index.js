import { Router } from 'express';
import authRoutes from './auth.routes.js';
import schemaRoutes from './schema.routes.js';
import elementRoutes from './element.routes.js';
import contentRoutes from './content.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/schemas', schemaRoutes);
router.use('/elements', elementRoutes);
router.use('/content', contentRoutes);

export default router;