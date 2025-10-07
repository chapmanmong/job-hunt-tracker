import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [route, setRoute] = useState<"home" | "login" | "signup">("home");

  return (
    <div style={{ padding: 20 }}>
      <nav>
        <button onClick={() => setRoute("home")}>Home</button>
        <button onClick={() => setRoute("login")}>Login</button>
        <button onClick={() => setRoute("signup")}>Signup</button>
      </nav>

      {route === "home" && (
        <>
          <h1>Job Hunt Tracker</h1>
          <p>Use the buttons above to navigate to auth pages.</p>
        </>
      )}

      {route === "login" && <Login />}
      {route === "signup" && <Signup />}
    </div>
  );
}

export default App;
