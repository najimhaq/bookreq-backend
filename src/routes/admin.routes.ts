// src/routes/admin.routes.ts
import { Router } from 'express';

import {
  getAdminBooks,
  getAdminDashboard,
  getAdminUsers,
  getAdminAuthors,
  createAdminAuthor,
} from '../controllers/admin.controller.js';
import { requireAdmin } from '../middlewares/require-admin.js';
import { requireAuth } from '../middlewares/require-auth.js';

export const adminRouter = Router();

adminRouter.use(requireAuth);
adminRouter.use(requireAdmin);

adminRouter.get('/dashboard', getAdminDashboard);
adminRouter.get('/users', getAdminUsers);
adminRouter.get('/books', getAdminBooks);
adminRouter.get('/authors', getAdminAuthors);
adminRouter.post('/authors', createAdminAuthor);
