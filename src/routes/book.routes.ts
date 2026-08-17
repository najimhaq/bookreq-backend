import { Router } from 'express';

import { createBook, getMyBooks } from '../controllers/book.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';

export const bookRouter = Router();

bookRouter.use(requireAuth);

bookRouter.route('/').get(getMyBooks).post(createBook);
