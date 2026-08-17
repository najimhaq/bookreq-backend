import { Router } from 'express';

import { updateMyProfileImage } from '../controllers/user.controller.js';
import { requireAuth } from '../middlewares/require-auth.js';
import { uploadProfileImage } from '../middlewares/upload-profile-image.js';

export const userRouter = Router();

userRouter.patch(
  '/me/profile-image',
  requireAuth,
  uploadProfileImage.single('image'),
  updateMyProfileImage
);
