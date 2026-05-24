import { create } from 'zustand';
import api from '@/utils/api';

export interface UserPayload {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'dispatcher';
}

interface AuthState {
  user: UserPayload | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
  loading: false,
  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({ user, loading: false });
      }
    } catch (error: any) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      set({ user: null, loading: false });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    set({ user: null });
  },
  initializeAuth: async () => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');

    if (token && savedUser) {
      set({ user: JSON.parse(savedUser) });
      try {
        const res = await api.get('/auth/me');
        if (res.data.success) {
          localStorage.setItem('user', JSON.stringify(res.data.user));
          set({ user: res.data.user });
        }
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null });
      }
    }
  },
}));

export default useAuthStore;
