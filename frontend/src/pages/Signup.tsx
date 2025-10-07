import { useState } from "react";
import { postJson } from "../api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await postJson("http://localhost:5000/auth/signup", {
        email,
        password,
      });
      setMessage(JSON.stringify(data));
    } catch (err) {
      setMessage(String(err));
    }
  }

  return (
    <div>
      <h2>Signup</h2>
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
        <button type="submit">Signup</button>
      </form>
      <div>{message}</div>
    </div>
  );
}
