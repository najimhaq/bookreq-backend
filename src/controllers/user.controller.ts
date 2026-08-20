import type { RequestHandler } from 'express';

import { prisma } from '../lib/prisma.js';
import { uploadProfileImageToImgBB } from '../lib/upload-profile-image.js';

export const updateMyProfileImage: RequestHandler = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'Please select an image file.',
    });
  }

  const imageUrl = await uploadProfileImageToImgBB(req.file, req.user.id);

  const user = await prisma.user.update({
    where: {
      id: req.user.id,
    },
    data: {
      image: imageUrl,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return res.status(200).json({
    success: true,
    data: user,
  });
};

export const getMyProfile: RequestHandler = async (req, res) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required.',
    });
  }

  const user = await prisma.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
    },
  });

  return res.status(200).json({
    success: true,
    data: user,
  })
}

