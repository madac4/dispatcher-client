import { create } from 'zustand';
import {
  getAccessToken,
  getEmail,
  getRefreshToken,
  getRole,
  removeTokens,
  setAccessToken,
  setEmail,
  setRefreshToken,
  setRole,
} from '../cookies';
import { UserRole } from '../models/auth.model';
import { AuthService } from '../services/authService';

interface AuthState {
  userId: string | null;
  userRole: UserRole | null;
  userEmail: string | null;
  isAuthenticated: () => boolean;
  email: () => string | null;
  setUser: (accessToken: string, refreshToken: string) => void;
  accessToken: () => string | null;
  refreshToken: () => string | null;
  getTokens: () => { accessToken: string | null; refreshToken: string | null };
  role: () => UserRole | null;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  userId: null,
  userRole: null,
  userEmail: null,
  email: () => getEmail() || null,
  role: () => getRole() || null,
  isAuthenticated: () => getAccessToken() && getRefreshToken(),
  accessToken: () => getAccessToken() || null,
  refreshToken: () => getRefreshToken() || null,
  setUser: (accessToken, refreshToken) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);

    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    setRole(payload.role);
    setEmail(payload.email);
    set({
      userId: payload.userId,
      userRole: payload.role,
      userEmail: payload.email,
    });
  },
  getTokens: () => ({
    accessToken: getAccessToken() || null,
    refreshToken: getRefreshToken() || null,
  }),
  logout: async () => {
    await AuthService.logout();
    removeTokens();
    set({ userRole: null, userEmail: null, userId: null });
    window.location.href = '/';
  },
}));
