import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/Login";
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from "./pages/ResetPassword";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import Forbidden from "./pages/Forbidden";

import PublicLayout from "./routes/PublicLayout";
import { getStudentRoutes } from "./routes/studentRoutes";
import { getTeacherRoutes } from "./routes/teacherRoutes";
import { getAdminRoutes } from "./routes/adminRoutes";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          className: '',
          style: {
            border: '2px solid #1e3a8a',
            padding: '16px',
            color: '#1e3a8a',
            borderRadius: '1rem',
            fontWeight: '900',
            fontStyle: 'italic',
            textTransform: 'uppercase',
            boxShadow: '0 10px 15px -3px rgba(30, 58, 138, 0.2), 0 4px 6px -2px rgba(30, 58, 138, 0.1)'
          },
          success: {
            style: {
              background: '#f8fafc',
              borderLeft: '6px solid #1e3a8a', // Blue representing Gema successful operations
            },
            iconTheme: {
              primary: '#1e3a8a',
              secondary: '#fff',
            },
          },
          error: {
            style: {
              background: '#fff',
              borderLeft: '6px solid #f97316', // Orange indicating errors
              color: '#f97316',
              borderColor: '#f97316'
            },
            iconTheme: {
              primary: '#f97316',
              secondary: '#fff',
            },
          },
        }}
      />

      <Routes>
        <Route path="/*" element={<PublicLayout />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forbidden" element={<Forbidden />} />

        {/* --- RUTAS PROTEGIDAS (DASHBOARD) --- */}
        <Route path="/dashboard">
          {getStudentRoutes()}
          {getTeacherRoutes()}
          {getAdminRoutes()}
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
