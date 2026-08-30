import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';

import { env } from '../config/env.js';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: ['http://localhost:3000', env.CLIENT_URL].filter(
    (origin): origin is string => Boolean(origin)
  ),

  emailAndPassword: {
    enabled: true,
  },

  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
        input: false,
      },
    },
  },
});
