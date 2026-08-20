//src/controller/admin.controller.ts
import type { RequestHandler } from 'express';

import type { Prisma, ReadingStatus } from '../generated/prisma/client.js';
import { prisma } from '../lib/prisma.js';
import { createAuthorSchema } from '../validations/author.validation.js';

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

export const getAdminBooks: RequestHandler = async (req, res, next) => {
  try {
    const rawPage = Number(req.query.page ?? 1);
    const rawLimit = Number(req.query.limit ?? 10);

    const search =
      typeof req.query.search === 'string' ? req.query.search.trim() : '';

    const rawStatus =
      typeof req.query.status === 'string' ? req.query.status : '';

    const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;

    const limit =
      Number.isInteger(rawLimit) && rawLimit > 0 ? Math.min(rawLimit, 50) : 10;

    const allowedStatuses = new Set<ReadingStatus>([
      'WANT_TO_READ',
      'READING',
      'COMPLETED',
    ]);

    const status = allowedStatuses.has(rawStatus as ReadingStatus)
      ? (rawStatus as ReadingStatus)
      : undefined;

    const where: Prisma.BookWhereInput = {
      ...(status ? { status } : {}),

      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: 'insensitive',
                },
              },
              {
                author: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                user: {
                  name: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
              {
                user: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              },
            ],
          }
        : {}),
    };

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          publishedYear: true,
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

      prisma.book.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: books,
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

export const getAdminAuthors: RequestHandler = async (req, res, next) => {
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
          name: {
            contains: search,
            mode: 'insensitive' as const,
          },
        }
      : {};

    const [authors, total] = await Promise.all([
      prisma.author.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          bio: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              books: true,
            },
          },
        },
      }),

      prisma.author.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: authors,
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

export const createAdminAuthor: RequestHandler = async (req, res, next) => {
  try {
    const parsed = createAuthorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: parsed.error.issues[0]?.message ?? 'Invalid author data.',
      });
    }

    const author = await prisma.author.create({
      data: {
        ...parsed.data,
        bio: parsed.data.bio ?? null,
      },
      select: {
        id: true,
        name: true,
        bio: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            books: true,
          },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Author created successfully.',
      data: author,
    });
  } catch (error) {
    next(error);
  }
};
