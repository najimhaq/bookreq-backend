import type { RequestHandler } from 'express';

import { prisma } from '../lib/prisma.js';
import { AppError } from '../utils/app-error.js';
import { createBookSchema } from '../validations/book.validation.js';

export const createBook: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const parsedBody = createBookSchema.safeParse(req.body);

  if (!parsedBody.success) {
    throw new AppError(
      parsedBody.error.issues[0]?.message ?? 'Invalid book data',
      400
    );
  }

  const {
    title,
    authorName,
    status,
    publishedYear,
    description,
    coverImageUrl,
  } = parsedBody.data;

  const book = await prisma.book.create({
    data: {
      title,
      status,
      publishedYear: publishedYear ?? null,
      description: description ?? null,
      coverImageUrl: coverImageUrl ?? null,

      user: {
        connect: {
          id: req.user.id,
        },
      },

      author: {
        connectOrCreate: {
          where: {
            name: authorName,
          },
          create: {
            name: authorName,
          },
        },
      },
    },

    include: {
      author: true,
    },
  });

  res.status(201).json({
    success: true,
    message: 'Book added to your library',
    data: book,
  });
};

//get my books
export const getMyBooks: RequestHandler = async (req, res) => {
  if (!req.user) {
    throw new AppError('Authentication required', 401);
  }

  const books = await prisma.book.findMany({
    where: {
      userId: req.user.id,
    },

    include: {
      author: {
        select: {
          id: true,
          name: true,
        },
      },
    },

    orderBy: {
      createdAt: 'desc',
    },
  });

  res.status(200).json({
    success: true,
    data: books,
  });
};
