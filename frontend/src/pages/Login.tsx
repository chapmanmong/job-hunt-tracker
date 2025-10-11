import { useState } from "react";
import { postJson } from "../api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const { login } = useAuth();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await postJson("http://localhost:5000/auth/login", {
        email,
        password,
      });
      if (data.token) {
        login(data.token, email);
        setMessage("Logged in successfully!");
      } else {
        setMessage(JSON.stringify(data));
      }
    } catch (err) {
      setMessage(String(err));
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={submit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <div>{message}</div>
    </div>
  );
}
