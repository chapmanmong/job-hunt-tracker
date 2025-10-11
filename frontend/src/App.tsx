import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobsPage from "./pages/JobsPage";
import { useAuth } from "./context/AuthContext";

function App() {
  const [route, setRoute] = useState<"home" | "login" | "signup">("home");
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div>
        <nav
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "white",
          }}
        >
          <span style={{ fontWeight: 500 }}>Welcome, {user}!</span>
          <button
            onClick={logout}
            style={{
              padding: "8px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "6px",
              background: "white",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </nav>
        <JobsPage />
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
