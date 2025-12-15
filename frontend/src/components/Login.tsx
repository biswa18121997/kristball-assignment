import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../state/UserContext";

export default function Login() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState<any>(null);
  const navigate = useNavigate();
  const userCtx = useContext(UserContext);

  if (!userCtx) {
    throw new Error("Login must be used inside UserProvider");
  }
  const { setData } = userCtx;

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setResponse(data);

      if (data.success) {
        setData({
          token: data.token,
          userDetails: data.userData,
        });
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="w-[80vw] relative left-[10vw] h-screen top-[10vh]">
      <div className="flex flex-col justify-center items-center h-4/5 w-3/4">
        <h1 className="text-3xl font-serif underline">
          Login / Sign in User
        </h1>

        <form
          onSubmit={handleLogin}
          className="flex flex-col border p-4 rounded-2xl w-[80vw] md:w-2/3"
        >
          <label>Email</label>
          <input
            type="text"
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 bg-neutral-400 rounded-3xl m-2"
          />

          <label>Password</label>
          <div className="flex items-center">
            <input
              type={show ? "text" : "password"}
              onChange={(e) => setPassword(e.target.value)}
              className="p-2 bg-neutral-400 rounded-3xl m-2 w-full"
            />
            {/* <i
              onClick={() => setShow(!show)}
              className={show ? "fa-solid fa-eye" : "fa-solid fa-eye-low-vision"}
            /> */}
          </div>

          <button className="p-2 m-2 rounded-2xl border w-full">
            Login
          </button>

          <Link to="/register">
            <button className="p-2 m-2 rounded-2xl border w-full bg-green-400">
              Register
            </button>
          </Link>

          {!response?.success && (
            <p className="text-red-500 text-center">{response?.message}</p>
          )}
        </form>
      </div>
    </div>
  );
}
