import { Router } from 'express';

import { env } from '../config/env.js';
import { prisma } from '../lib/prisma.js';

export const healthRouter = Router();

healthRouter.get('/', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;

  res.status(200).json({
    success: true,
    message: 'BookRaq API and database are running',
    environment: env.NODE_ENV,
  });
});
