import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import type { PrismaClient } from '@prisma/client';
import type { JwtPayload } from '../plugins/auth.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fushion-dev-jwt-secret-change-in-production';
const ACCESS_TOKEN_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
const BCRYPT_ROUNDS = 12;

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
  }) {
    // Check if user exists
    const existing = await this.prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw Object.assign(new Error('An account with this email already exists'), {
        statusCode: 409,
        code: 'EMAIL_EXISTS',
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email: data.email.toLowerCase(),
        passwordHash,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone || null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    // Generate tokens
    const tokens = await this.generateTokenPair(user.id, user.role);

    return { user, ...tokens };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        avatarUrl: true,
        passwordHash: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      },
    });

    if (!user || user.deletedAt) {
      throw Object.assign(new Error('Invalid email or password'), {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      throw Object.assign(new Error('Invalid email or password'), {
        statusCode: 401,
        code: 'INVALID_CREDENTIALS',
      });
    }

    const tokens = await this.generateTokenPair(user.id, user.role);

    // Remove passwordHash from response
    const { passwordHash: _, deletedAt: __, ...safeUser } = user;

    return { user: safeUser, ...tokens };
  }

  async refreshToken(refreshTokenValue: string) {
    // Find the refresh token
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: refreshTokenValue },
      include: {
        user: {
          select: {
            id: true,
            role: true,
            deletedAt: true,
          },
        },
      },
    });

    if (!storedToken || storedToken.expiresAt < new Date() || storedToken.user.deletedAt) {
      // Delete the token if it exists but is expired
      if (storedToken) {
        await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      }
      throw Object.assign(new Error('Invalid or expired refresh token'), {
        statusCode: 401,
        code: 'INVALID_REFRESH_TOKEN',
      });
    }

    // Rotate: delete old token, create new pair
    await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
    const tokens = await this.generateTokenPair(storedToken.user.id, storedToken.user.role);

    return tokens;
  }

  async logout(refreshTokenValue: string) {
    await this.prisma.refreshToken.deleteMany({
      where: { token: refreshTokenValue },
    });
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        emailVerified: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
        vendor: {
          select: {
            id: true,
            storeName: true,
            storeSlug: true,
            status: true,
          },
        },
      },
    });

    if (!user) {
      throw Object.assign(new Error('User not found'), {
        statusCode: 404,
        code: 'USER_NOT_FOUND',
      });
    }

    return user;
  }

  // ─── Private helpers ───────────────────────────────────

  private async generateTokenPair(userId: string, role: string) {
    // Access token — short lived JWT
    const accessToken = jwt.sign(
      { userId, role } satisfies Omit<JwtPayload, 'iat' | 'exp'>,
      JWT_SECRET,
      { expiresIn: ACCESS_TOKEN_EXPIRY as any },
    );

    // Refresh token — opaque UUID stored in DB
    const refreshTokenValue = uuidv4();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenValue,
        userId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }
}
