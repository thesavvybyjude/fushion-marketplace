import type { Role } from '../constants/index.js';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  role: Role;
  emailVerified: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile extends User {
  vendor: {
    id: string;
    storeName: string;
    storeSlug: string;
    status: string;
  } | null;
}
