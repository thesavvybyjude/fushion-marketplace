import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from '../../services/auth.service.js';
import { registerSchema, loginSchema } from '@fushion/shared/validators';

export async function authRoutes(fastify: FastifyInstance) {
  const authService = new AuthService(fastify.prisma);

  // ─── POST /register ────────────────────────────────────
  fastify.post(
    '/register',
    {
      schema: {
        tags: ['Auth'],
        description: 'Register a new buyer account',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 8 },
            firstName: { type: 'string', minLength: 2 },
            lastName: { type: 'string', minLength: 2 },
            phone: { type: 'string' },
          },
          required: ['email', 'password', 'firstName', 'lastName'],
        },
      },
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = registerSchema.parse(request.body);
      const result = await authService.register(data);

      const cookieOpts = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      };

      reply.setCookie('refreshToken', result.refreshToken, cookieOpts);

      return reply.status(201).send({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    },
  );

  // ─── POST /login ───────────────────────────────────────
  fastify.post(
    '/login',
    {
      schema: {
        tags: ['Auth'],
        description: 'Login with email and password',
        body: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
      },
      config: {
        rateLimit: { max: 10, timeWindow: '1 minute' },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { email, password } = loginSchema.parse(request.body);
      const result = await authService.login(email, password);

      reply.setCookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken,
        },
      });
    },
  );

  // ─── POST /refresh ────────────────────────────────────
  fastify.post(
    '/refresh',
    {
      schema: {
        tags: ['Auth'],
        description: 'Refresh access token using refresh token cookie',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const refreshToken = request.cookies.refreshToken;

      if (!refreshToken) {
        return reply.status(401).send({
          success: false,
          error: { code: 'NO_REFRESH_TOKEN', message: 'Refresh token required' },
        });
      }

      const tokens = await authService.refreshToken(refreshToken);

      reply.setCookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 7 * 24 * 60 * 60,
      });

      return reply.send({
        success: true,
        data: { accessToken: tokens.accessToken },
      });
    },
  );

  // ─── POST /logout ─────────────────────────────────────
  fastify.post(
    '/logout',
    {
      schema: {
        tags: ['Auth'],
        description: 'Logout and invalidate refresh token',
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const refreshToken = request.cookies.refreshToken;

      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      reply.clearCookie('refreshToken', { path: '/' });

      return reply.send({
        success: true,
        data: { message: 'Logged out successfully' },
      });
    },
  );

  // ─── GET /me ───────────────────────────────────────────
  fastify.get(
    '/me',
    {
      schema: {
        tags: ['Auth'],
        description: 'Get current user profile',
        security: [{ bearerAuth: [] }],
      },
      preHandler: [fastify.authenticate],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await authService.getProfile(request.user!.userId);

      return reply.send({
        success: true,
        data: user,
      });
    },
  );
}
