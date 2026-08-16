import type { NextFunction, Request, Response } from 'express';
import { fromNodeHeaders } from 'better-auth/node';

import { auth } from '../lib/auth.js';

declare global {
  namespace Express {
    interface Request {
      session?: any;
      user?: any;
    }
  }
}

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized. Please sign in.',
      });
    }

    req.session = session.session;
    req.user = session.user;

    next();
  } catch (error) {
    next(error);
  }
};
