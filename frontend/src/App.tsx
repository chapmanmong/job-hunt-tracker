import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { useAuth } from "./context/AuthContext";

function App() {
  const [route, setRoute] = useState<"home" | "login" | "signup">("home");
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div style={{ padding: 20 }}>
        <nav>
          <span>Welcome, {user}!</span>
          <button onClick={logout} style={{ marginLeft: 20 }}>
            Logout
          </button>
        </nav>
        <h1>Job Hunt Tracker</h1>
        <p>You are logged in. Job tracking features coming soon!</p>
      </div>
    );
  }

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
