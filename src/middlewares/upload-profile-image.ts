// src/middlewares/upload-profile-image.ts
import type { Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadProfileImage = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },

  fileFilter: (
    _req: Request,
    file: Express.Multer.File,
    callback: FileFilterCallback
  ): void => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new Error('Only JPEG, PNG, and WebP image files are allowed.'));
      return;
    }

    callback(null, true);
  },
});
