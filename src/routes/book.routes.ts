import { Router } from 'express';

import { createBook } from '../controllers/book.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

export const bookRouter = Router();

bookRouter.post('/', requireAuth, createBook);
