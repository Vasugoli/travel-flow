import useAuthStore from '@/store/authStore';
import type { UserPayload } from '@/store/authStore';

export interface UseAuthResult {
  user: UserPayload | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const useAuth = (): UseAuthResult => {
  const store = useAuthStore();
  return {
    user: store.user,
    loading: store.loading,
    login: store.login,
    logout: store.logout,
  };
};

export default useAuth;
