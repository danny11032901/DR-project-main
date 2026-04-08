import { create } from "zustand";

export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

type AppState = {
  accessToken: string | null;
  refreshToken: string | null;
  user: UserProfile | null;
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: UserProfile | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
};

export const useAppStore = create<AppState>((set, get) => ({
  accessToken: localStorage.getItem("retinaiq_access_token"),
  refreshToken: localStorage.getItem("retinaiq_refresh_token"),
  user: (() => {
    try {
      const raw = localStorage.getItem("retinaiq_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  })(),
  setTokens: (access, refresh) => {
    localStorage.setItem("retinaiq_access_token", access);
    localStorage.setItem("retinaiq_refresh_token", refresh);
    set({ accessToken: access, refreshToken: refresh });
  },
  setUser: (user) => {
    if (user) {
      localStorage.setItem("retinaiq_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("retinaiq_user");
    }
    set({ user });
  },
  logout: () => {
    localStorage.removeItem("retinaiq_access_token");
    localStorage.removeItem("retinaiq_refresh_token");
    localStorage.removeItem("retinaiq_user");
    set({ accessToken: null, refreshToken: null, user: null });
  },
  isAuthenticated: () => !!get().accessToken,
}));
