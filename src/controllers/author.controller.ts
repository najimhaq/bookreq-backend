import type { RequestHandler } from 'express';

import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/app-error.js';
import { createAuthorSchema } from '../validations/author.validation.js';

export const createAuthor: RequestHandler = async (req, res) => {
  const parsedBody = createAuthorSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError('Invalid author data', 400);
  }

  const author = await prisma.author.create({
    data: {
      ...parsedBody.data,
      bio: parsedBody.data.bio ?? null,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Author created successfully',
    data: author,
  });
};

export const getAuthors: RequestHandler = async (_req, res) => {
  const authors = await prisma.author.findMany({
    orderBy: {
      name: 'asc',
    },
  });

  res.status(200).json({
    success: true,
    data: authors,
  });
};
