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

export const getAdminUsers: RequestHandler = async (req, res, next) => {
  try {
    const rawPage = Number(req.query.page ?? 1);
    const rawLimit = Number(req.query.limit ?? 10);
    const search =
      typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 10;

    const where = search
      ? {
          OR: [
            {
              name: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
            {
              email: {
                contains: search,
                mode: 'insensitive' as const,
              },
            },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
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

      prisma.user.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
