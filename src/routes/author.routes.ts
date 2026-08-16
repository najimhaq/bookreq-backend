import { Router } from 'express';

import { createAuthor, getAuthors } from '../controllers/author.controller.js';

export const authorRouter = Router();

authorRouter.route('/').get(getAuthors).post(createAuthor);
