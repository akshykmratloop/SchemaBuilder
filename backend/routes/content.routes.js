import { Router } from 'express';
import { authenticateToken } from '../middleware/auth.js';
import { createContent, getContentBySchemaId } from '../controllers/content.controller.js';

const router = Router();

router.post('/', authenticateToken, createContent);
router.get('/:schemaId', authenticateToken, getContentBySchemaId);

export default router;