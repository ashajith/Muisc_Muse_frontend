import { create } from "zustand";
import axios from "axios";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,

  login: async ({ username, password }) => {
    const res = await axios.post(
      "http://127.0.0.1:8000/api/login/",
      { username, password }
    );

    const token = res.data.access;

    localStorage.setItem("token", token);

    set({
      token,
      user: { username },
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null });
  },
}));