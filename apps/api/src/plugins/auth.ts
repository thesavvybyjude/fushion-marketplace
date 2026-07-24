import fp from 'fastify-plugin';
import jwt from 'jsonwebtoken';
import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';

export interface JwtPayload {
  userId: string;
  role: string;
  iat?: number;
  exp?: number;
}

declare module 'fastify' {
  interface FastifyRequest {
    user: JwtPayload | null;
  }
  interface FastifyInstance {
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
    requireRole: (...roles: string[]) => (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}

export const authPlugin = fp(
  async (fastify: FastifyInstance) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new Error('FATAL: JWT_SECRET environment variable is required');
    }

    // Decorator to add user to request (null if no token)
    fastify.decorateRequest('user', null);

    // Authentication decorator — verifies JWT and attaches user
    fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
      const authHeader = request.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return reply.status(401).send({
          success: false,
          error: { code: 'UNAUTHORIZED', message: 'Access token required' },
        });
      }

      const token = authHeader.substring(7);

      try {
        const payload = jwt.verify(token, JWT_SECRET) as JwtPayload;
        request.user = payload;
      } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
          return reply.status(401).send({
            success: false,
            error: { code: 'TOKEN_EXPIRED', message: 'Access token has expired' },
          });
        }
        return reply.status(401).send({
          success: false,
          error: { code: 'INVALID_TOKEN', message: 'Invalid access token' },
        });
      }
    });

    // Alias: requireAuth is the same as authenticate
    fastify.decorate('requireAuth', async (request: FastifyRequest, reply: FastifyReply) => {
      return fastify.authenticate(request, reply);
    });

    // Role-based access control decorator
    fastify.decorate(
      'requireRole',
      (...roles: string[]) =>
        async (request: FastifyRequest, reply: FastifyReply) => {
          // First authenticate
          await fastify.authenticate(request, reply);
          if (reply.sent) return;

          // Then check role
          if (!request.user || !roles.includes(request.user.role)) {
            return reply.status(403).send({
              success: false,
              error: {
                code: 'FORBIDDEN',
                message: 'You do not have permission to access this resource',
              },
            });
          }
        },
    );
  },
  { name: 'auth' },
);
