import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import JobsPage from "./pages/JobsPage";
import { useAuth } from "./context/AuthContext";
import { Button } from "./components/ui/button";

function App() {
  const [route, setRoute] = useState<"home" | "login" | "signup">("home");
  const { isAuthenticated, user, logout } = useAuth();

  if (isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <nav className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 py-4 shadow-sm">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">Job Hunt Tracker</div>
              <span className="text-sm text-slate-600 dark:text-slate-400">Welcome, {user}!</span>
            </div>
            <Button variant="outline" onClick={logout}>
              Logout
            </Button>
          </div>
        </nav>
        <JobsPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      {route === "home" && (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="w-full max-w-2xl text-center">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl p-12">
              <h1 className="text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-4">Job Hunt Tracker</h1>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Track and manage all your job applications in one place</p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => setRoute("login")} size="lg" className="text-base px-8">
                  Login
                </Button>
                <Button onClick={() => setRoute("signup")} variant="outline" size="lg" className="text-base px-8">
                  Sign Up
                </Button>
              </div>

              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                <div className="p-4">
                  <div className="text-3xl mb-2">📊</div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Track Progress</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Monitor your application status and stay organized</p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">📝</div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Manage Contacts</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Keep track of recruiters and hiring managers</p>
                </div>
                <div className="p-4">
                  <div className="text-3xl mb-2">🎯</div>
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">Stay Focused</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Never miss a follow-up or interview date</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {route === "login" && <Login onBack={() => setRoute("home")} />}
      {route === "signup" && <Signup onBack={() => setRoute("home")} />}
    </div>
  );
}

export default App;
