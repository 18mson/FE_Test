import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/Pages/Auth/ProtectedRoute';
import LoginPage from './components/Pages/Auth/LoginPage';
import Layout from './components/Layout/Layout';
import DashboardPage from './components/Pages/Dashboard/DashboardPage';
import DailyTrafficReportPage from './components/Pages/Reports/DailyTrafficReportPage';
import GateMasterDataPage from './components/Pages/Gates/GateMasterDataPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <DashboardPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Layout>
                  <DailyTrafficReportPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gates"
            element={
              <ProtectedRoute>
                <Layout>
                  <GateMasterDataPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;