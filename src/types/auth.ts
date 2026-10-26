export type UserRole = 'admin' | 'user';

export interface SessionPayload {
  role: UserRole;
  authTime: number;
}
