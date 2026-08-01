// frontend/src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import StudentLogin from './pages/StudentLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import StudentDashboard from './pages/StudentDashboard'; // <-- අලුතෙන් එකතු කළා
import AdminDashboard from './pages/AdminDashboard';     // <-- අලුතෙන් එකතු කළා
import LandingPage from './pages/LandingPage';

// 🔒 Student Route Guard
const StudentProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'student') {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// 🔒 Admin Route Guard
const AdminProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  if (!token || role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<StudentLogin />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <StudentProtectedRoute>
            <StudentDashboard />
          </StudentProtectedRoute>
        } />
        
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;