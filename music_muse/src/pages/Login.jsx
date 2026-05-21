import { useState } from "react";
import { useAuthStore } from "../store/authStore";
import { useNavigate } from "react-router-dom";

function Login() {

  const login = useAuthStore((state) => state.login);

  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      await login(form);

      navigate("/");

    } catch (err) {

      console.error(err.response?.data);

      setError("Invalid username or password");
    }
  };

  return (

    <div className="min-h-screen bg-[#05050a] flex items-center justify-center">

      <form
        onSubmit={handleSubmit}
        className="w-[380px] bg-[#111118] p-8 rounded-3xl border border-[#222]"
      >

        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome Back
        </h1>

        <p className="text-zinc-400 mb-8">
          Login to continue
        </p>

        {error && (
          <div className="bg-red-500/10 text-red-400 p-3 rounded-xl mb-4 text-sm">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Username"
          className="w-full p-4 rounded-xl bg-[#1a1a24] text-white outline-none mb-4"
          onChange={(e) =>
            setForm({
              ...form,
              username: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-4 rounded-xl bg-[#1a1a24] text-white outline-none mb-6"
          onChange={(e) =>
            setForm({
              ...form,
              password: e.target.value,
            })
          }
        />

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 transition-all p-4 rounded-xl text-white font-semibold"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default Login;