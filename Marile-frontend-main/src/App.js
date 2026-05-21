import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminHistory from "./pages/AdminHistory";
import AdminLayout from "./components/AdminLayout";
import CashierLayout from "./components/CashierLayout";
import CashierDashboard from "./pages/CashierDashboard";
import CashierProducts from "./pages/CashierProduct";
import CashierHistory from "./pages/CashierHistory";
import Settings from "./pages/Settings";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/history"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <Settings role="Admin" />
            </ProtectedRoute>
          }
        />

        {/* Cashier Routes */}
        <Route
          path="/cashier"
          element={
            <ProtectedRoute allowedRole="cashier">
              <CashierDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/products"
          element={
            <ProtectedRoute allowedRole="cashier">
              <CashierProducts />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/history"
          element={
            <ProtectedRoute allowedRole="cashier">
              <CashierHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cashier/settings"
          element={
            <ProtectedRoute allowedRole="cashier">
              <Settings role="Cashier" />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
