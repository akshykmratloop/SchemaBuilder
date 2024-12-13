import prisma from '../utils/db.js';
import { AppError } from '../utils/errors.js';
import { contentSchema } from '../utils/validators.js';

export const createContent = async (req, res, next) => {
  try {
    const { schema_id, data } = contentSchema.parse(req.body);
    
    const schema = await prisma.schema.findUnique({
      where: { id: schema_id },
    });
    
    if (!schema) {
      throw new AppError('Schema not found', 404);
    }
    
    if (schema.userId !== req.user.id) {
      throw new AppError('Not authorized', 403);
    }
    
    const content = await prisma.content.create({
      data: {
        schema: { connect: { id: schema_id } },
        data: JSON.stringify(data),
      },
    });
    
    res.json(content);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getContentBySchemaId = async (req, res, next) => {
  try {
    const schemaId = parseInt(req.params.schemaId);
    
    const schema = await prisma.schema.findUnique({
      where: { id: schemaId },
    });
    
    if (!schema) {
      throw new AppError('Schema not found', 404);
    }
    
    if (schema.userId !== req.user.id) {
      throw new AppError('Not authorized', 403);
    }
    
    const content = await prisma.content.findMany({
      where: { schemaId },
      orderBy: { createdAt: 'desc' },
    });
    
    res.json(content.map(item => ({
      ...item,
      data: JSON.parse(item.data),
    })));
  } catch (error) {
    next(new AppError('Failed to fetch content', 500));
  }
};