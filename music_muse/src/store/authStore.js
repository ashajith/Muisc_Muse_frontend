import { create } from "zustand";
import axios from "axios";

const API = "http://127.0.0.1:8000/api";

export const useAuthStore = create((set) => ({

  user: null,

  token: localStorage.getItem("token") || null,

  login: async ({ username, password }) => {

    const res = await axios.post(
      `${API}/login/`,
      {
        username,
        password,
      }
    );

    const token = res.data.access;

    localStorage.setItem("token", token);

    axios.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${token}`;

    set({
      token,
      user: {
        username,
      },
    });
  },

  logout: () => {

    localStorage.removeItem("token");

    delete axios.defaults.headers.common[
      "Authorization"
    ];

    set({
      user: null,
      token: null,
    });
  },

}));