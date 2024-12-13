import prisma from '../utils/db.js';
import { AppError } from '../utils/errors.js';
import { schemaSchema } from '../utils/validators.js';

// export const createSchema = async (req, res, next) => {
//   try {
//     const { name, structure } = schemaSchema.parse(req.body);
    
//     const schema = await prisma.schema.create({
//       data: {
//         name,
//         description: structure.description,
//         createdBy: { connect: { id: req.user.id } },
//         sections: {
//           create: structure.sections.map((section, index) => ({
//             name: section.name,
//             order: index,
//             elements: {
//               create: section.elements.map((element, elemIndex) => ({
//                 label: element.label,
//                 order: elemIndex,
//                 elementType: { connect: { name: element.type } },
//               })),
//             },
//           })),
//         },
//       },
//       include: {
//         sections: {
//           include: {
//             elements: true,
//           },
//         },
//       },
//     });
    
//     res.json(schema);
//   } catch (error) {
//     next(new AppError(error.message, 400));
//   }
// };

export const createSchema = async (req, res, next) => {
  try {
    const { name, structure } = schemaSchema.parse(req.body);

    // Check if the user is authenticated
    if (!req.user || !req.user.id) {
      throw new AppError('User not authenticated', 401);
    }

    // Create the schema
    const schema = await prisma.schema.create({
      data: {
        name,
        description: structure.description,
        createdBy: { connect: { id: req.user.id } },
        sections: {
          create: structure.sections.map((section, index) => ({
            name: section.name,
            order: index,
            elements: {
              create: section.elements.map(async (element, elemIndex) => {
                // Check if the element type exists
                const elementType = await prisma.elementType.findUnique({
                  where: { name: element.type },
                });

                if (!elementType) {
                  throw new AppError(`Element type '${element.type}' not found`, 400);
                }

                return {
                  label: element.label,
                  order: elemIndex,
                  elementType: { connect: { id: elementType.id } }, // Connect using ID
                };
              }),
            },
          })),
        },
      },
      include: {
        sections: {
          include: {
            elements: true,
          },
        },
      },
    });

    res.json(schema);
  } catch (error) {
    next(new AppError(error.message, 400));
  }
};

export const getSchemas = async (req, res, next) => {
  try {
    const schemas = await prisma.schema.findMany({
      where: { userId: req.user.id },
      include: {
        sections: {
          include: {
            elements: {
              include: {
                elementType: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(schemas);
  } catch (error) {
    next(new AppError('Failed to fetch schemas', 500));
  }
};

export const getSchemaById = async (req, res, next) => {
  try {
    const schema = await prisma.schema.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        sections: {
          include: {
            elements: {
              include: {
                elementType: true,
              },
            },
          },
        },
      },
    });
    
    if (!schema) {
      throw new AppError('Schema not found', 404);
    }
    
    if (schema.userId !== req.user.id) {
      throw new AppError('Not authorized', 403);
    }
    
    res.json(schema);
  } catch (error) {
    next(error);
  }
};