//src/middlewares/require-auth.ts
import type { RequestHandler } from 'express';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from '../lib/auth.js';
import { AppError } from '../utils/app-error.js';

export const requireAuth: RequestHandler = async (req, _res, next) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      throw new AppError('Authentication required', 401);
    }

    req.user = {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
      role: session.user.role as 'USER' | 'ADMIN',
    };

    next();
  } catch (error) {
    next(error);
  }
};
