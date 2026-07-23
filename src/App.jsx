import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageCourses from './pages/admin/ManageCourses';
import ViewFeedback from './pages/admin/ViewFeedback';
import StudentDashboard from './pages/student/StudentDashboard';
import MyFeedback from './pages/student/MyFeedback';
import FeedbackForm from './pages/student/FeedbackForm';
import { initializeMockData } from './utils/mockData';
import './styles/global.css';

function App() {
  useEffect(() => {
    initializeMockData();
  }, []);
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <AdminDashboard />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <ManageCourses />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/feedback"
              element={
                <ProtectedRoute requiredRole="admin">
                  <AdminLayout>
                    <ViewFeedback />
                  </AdminLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/student"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <StudentDashboard />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/my-feedback"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <MyFeedback />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/feedback/:courseId"
              element={
                <ProtectedRoute requiredRole="student">
                  <StudentLayout>
                    <FeedbackForm />
                  </StudentLayout>
                </ProtectedRoute>
              }
            />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
