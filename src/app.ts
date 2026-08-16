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

app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    maxAge: 86_400,
  })
);

app.all('/api/auth/*splat', toNodeHandler(auth));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

//routes
// app.use('/api/profile', profileRouter);

//health check
app.use('/api/health', healthRouter);

//author routes
app.use('/api/authors', authorRouter);


//error & not found middleware
app.use(notFound);

app.use(errorHandler);

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
