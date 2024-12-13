import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../utils/db.js';
import { AppError } from '../utils/errors.js';
import { loginSchema } from '../utils/validators.js';

export const login = async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, isSuperUser: user.isSuperUser },
      process.env.JWT_SECRET || 'your-secret-key'
    );

    res.json({ token });
  } catch (error) {
    next(error);
  }
};