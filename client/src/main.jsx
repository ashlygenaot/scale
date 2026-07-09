import React from "react";
import ReactDOM from "react-dom/client";
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

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
  <Route path="/" element={<Login />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />

  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/logbook" element={<Logbook />} />

  <Route path="/session/new" element={<NewEntry />} />

  <Route
    path="/session/:sessionId"
    element={<Session />}
  />

  <Route
    path="/session/:sessionId/new-climb"
    element={<NewClimb />}
  />

  <Route
    path="/session/:sessionId/climb/:climbId/edit"
    element={<EditClimb />}
  />

  <Route path="/projects" element={<Projects />} />
</Routes>
  </BrowserRouter>
);