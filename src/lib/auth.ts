import { prismaAdapter } from '@better-auth/prisma-adapter';
import { betterAuth } from 'better-auth';

import { env } from '../config/env.js';
import { prisma } from './prisma.js';

export const auth = betterAuth({
  appName: 'BookRaq',

  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),

  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  trustedOrigins: [env.CLIENT_URL],

  emailAndPassword: {
    enabled: true,
  },
});
