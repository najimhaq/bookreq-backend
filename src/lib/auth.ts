import { betterAuth } from 'better-auth';
import { prismaAdapter } from '@better-auth/prisma-adapter';

import { env } from '../config/env.js';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  appName: 'Bookraq',

  baseURL: env.BETTER_AUTH_URL,

  trustedOrigins: [env.CLIENT_URL],

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  emailAndPassword: {
    enabled: true,
  },
});
