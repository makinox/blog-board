import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  visitor_id: number | null;
  email_verified: boolean;
  created_at: string;
}

interface AuthStore extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateUser: (user: Partial<User>) => void;
  getUser: () => User | null;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user: User, token: string) => set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false
      }),

      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      }),

      setLoading: (loading: boolean) => set({ isLoading: loading }),

      getUser: () => get().user,

      updateUser: (userData: Partial<User>) => set((state) => ({
        user: state.user ? { ...state.user, ...userData } : null
      })),

      clearAuth: () => set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false
      })
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      })
    }
  )
); 