//src/controller/admin.controller.ts
import type { RequestHandler } from 'express';

import { prisma } from '../lib/prisma.js';

export const getAdminDashboard: RequestHandler = async (_req, res, next) => {
  try {
    const [totalUsers, totalBooks, totalAuthors, recentUsers, recentBooks] =
      await Promise.all([
        prisma.user.count(),
        prisma.book.count(),
        prisma.author.count(),

        prisma.user.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            role: true,
            createdAt: true,
            _count: {
              select: {
                books: true,
              },
            },
          },
        }),

        prisma.book.findMany({
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            id: true,
            title: true,
            coverImageUrl: true,
            status: true,
            createdAt: true,
            author: {
              select: {
                id: true,
                name: true,
              },
            },
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        }),
      ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalBooks,
        totalAuthors,
        recentUsers,
        recentBooks,
      },
    });
  } catch (error) {
    next(error);
  }
};
