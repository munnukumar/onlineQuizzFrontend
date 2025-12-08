import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";

// Dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";


// Admin Pages
import AdminUsers from "./pages/admin/UserList";
import AdminUserDetails from "./pages/admin/UserDetails";


import Leaderboard from "./components/Leaderboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ====================== */}
        {/*   ADMIN ROUTES        */}
        {/* ====================== */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminUserDetails />
            </ProtectedRoute>
          }
        />

        {/* <Route
          path="/admin/quizzes"
          element={
            <ProtectedRoute role="admin">
              <AdminQuizList />
            </ProtectedRoute>
          }
        /> */}

        {/* ====================== */}
        {/*     USER ROUTES       */}
        {/* ====================== */}
        {/* <Route
          path="/user"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/user/profile"
          element={
            <ProtectedRoute role="user">
              <UserProfile />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/user/quizzes"
          element={
            <ProtectedRoute role="user">
              <UserQuizzes />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/user/quizzes/:quizId"
          element={
            <ProtectedRoute role="user">
              <AttemptQuiz />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute role="any">
              <Leaderboard />
            </ProtectedRoute>
          }
        />

        {/* Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
