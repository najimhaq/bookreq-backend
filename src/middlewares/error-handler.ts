import type { ErrorRequestHandler } from 'express';

import { env } from '../config/env.js';
import { AppError } from '../utils/app-error.js';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  console.error('❌ Unexpected server error:', error);

  return res.status(500).json({
    success: false,
    message:
      env.NODE_ENV === 'production'
        ? 'Something went wrong.'
        : 'Internal server error.',
  });
};
