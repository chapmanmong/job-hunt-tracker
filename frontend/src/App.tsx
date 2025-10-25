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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Job Hunt Tracker
              </h1>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => setRoute("home")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  route === "home"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Home
              </button>
              <button
                onClick={() => setRoute("login")}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  route === "login"
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setRoute("signup")}
                className={`px-4 py-2 rounded-md text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors ${
                  route === "signup" ? "bg-blue-700" : ""
                }`}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {route === "home" && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Simple Hero Section */}
          <div className="text-center py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Job Hunt Tracker
            </h1>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              A simple tool to help you organize and track your job
              applications, interviews, and follow-ups.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setRoute("signup")}
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Get Started
              </button>
              <button
                onClick={() => setRoute("login")}
                className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium border border-blue-600 hover:bg-blue-50 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Simple Features */}
          <div className="grid md:grid-cols-3 gap-6 py-12">
            <div className="text-center">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Track Applications
              </h3>
              <p className="text-sm text-gray-600">
                Keep track of job applications and their status
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6m-6 0a2 2 0 00-2 2v8a2 2 0 002 2h6a2 2 0 002-2V9a2 2 0 00-2-2"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Manage Interviews
              </h3>
              <p className="text-sm text-gray-600">
                Schedule and track interview progress
              </p>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                View Progress
              </h3>
              <p className="text-sm text-gray-600">
                See your job search progress at a glance
              </p>
            </div>
          </div>
        </div>
      )}

      {route === "login" && (
        <div className="max-w-md mx-auto py-12">
          <Login />
        </div>
      )}

      {route === "signup" && (
        <div className="max-w-md mx-auto py-12">
          <Signup />
        </div>
      )}
    </div>
  );
}

export default App;
