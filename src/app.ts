//src/app.ts
import cors from 'cors';
import express, { type Request, type Response } from 'express';
import helmet from 'helmet';
import { toNodeHandler } from 'better-auth/node';

import { env } from './config/env.js';
import { auth } from './lib/auth.js';

import { notFound } from './middlewares/not-found.js';
import { errorHandler } from './middlewares/error-handler.js';
import { healthRouter } from './routes/health.routes.js';
import { authorRouter } from './routes/author.routes.js';
import { bookRouter } from './routes/book.routes.js';
import { userRouter } from './routes/user.routes.js';
import { adminRouter } from './routes/admin.routes.js';

export const app = express();

app.use(
  helmet({
    hsts:
      env.NODE_ENV === 'production'
        ? {
            maxAge: 31_536_000,
          }
        : false,
  })
);

const allowedOrigins = ['http://localhost:3000', env.CLIENT_URL].filter(
  (origin): origin is string => Boolean(origin)
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86_400,
  })
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));


//health check
app.use('/api/health', healthRouter);

//profile routes
app.use('/api/users', userRouter);

//author routes
app.use('/api/authors', authorRouter);

//book routes
app.use('/api/books', bookRouter);

//admin routes
app.use('/api/admin', adminRouter);

// একটি Protected Route
app.get('/api/protected', async (req: Request, res: Response) => {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized! Please login.' });
  }

  return res.json({
    message: 'Welcome to the protected route!',
    user: session.user,
  });
});

//error & not found middleware
app.use(notFound);

app.use(errorHandler);
