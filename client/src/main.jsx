import React from "react";
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./index.css";
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Logbook from "./pages/Logbook";
import Session from "./pages/Session";
import NewEntry from "./pages/NewEntry";
import NewClimb from "./pages/NewClimb";
import EditClimb from "./pages/EditClimb";
import Projects from "./pages/Projects";
import Analytics from "./pages/Analytics";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <AuthProvider>
    <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/logbook" element={<ProtectedRoute><Logbook /></ProtectedRoute>} />

  <Route path="/sessions/new" element={<ProtectedRoute><NewEntry /></ProtectedRoute>} />

  <Route
    path="/sessions/:sessionId"
    element={<ProtectedRoute><Session /></ProtectedRoute>}
  />

  <Route
    path="/sessions/:sessionId/new-climb"
    element={<ProtectedRoute><NewClimb /></ProtectedRoute>}
  />

  <Route
    path="/sessions/:sessionId/climb/:climbId/edit"
    element={<ProtectedRoute><EditClimb /></ProtectedRoute>}
  />

  <Route path="/projects" element={<ProtectedRoute><Projects/></ProtectedRoute>} />

  <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>}/>

</Routes>
</AuthProvider>
  </BrowserRouter>
);