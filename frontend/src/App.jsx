// frontend/src/App.jsx
// 🎯 Main App Component - Router setup

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context Providers
import { ThemeProvider } from '@context/ThemeContext';
import { AuthProvider } from '@context/AuthContext';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import PublicRoute from './routes/PublicRoute';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';

// Pages
import HistoryPage     from '@pages/HistoryPage';
import LandingPage     from '@pages/LandingPage';
import LoginPage       from '@pages/LoginPage';
import RegisterPage    from '@pages/RegisterPage';
import Dashboard       from '@pages/Dashboard';
import UploadPage      from '@pages/UploadPage';
import AnalysisResults from '@pages/AnalysisResults';
import ATSBreakdown    from '@pages/ATSBreakdown';
import SkillsGap       from '@pages/SkillsGap';
import JobMatch        from '@pages/JobMatch';
import ProfilePage     from '@pages/ProfilePage';
import PricingPage     from '@pages/PricingPage';
import NotFoundPage    from '@pages/NotFoundPage';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* 🍞 Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              className: 'hot-toast',
              success: {
                iconTheme: { primary: '#10B981', secondary: '#fff' },
              },
              error: {
                iconTheme: { primary: '#EF4444', secondary: '#fff' },
              },
            }}
          />

          <Routes>
            {/* ════════════════════════════════════════ */}
            {/* 🌍 PUBLIC ROUTES (no sidebar)            */}
            {/* ════════════════════════════════════════ */}
            <Route path="/"        element={<LandingPage />} />
            <Route path="/pricing" element={<PricingPage />} />

            <Route
              path="/login"
              element={
                <PublicRoute>
                  <LoginPage />
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <RegisterPage />
                </PublicRoute>
              }
            />

            {/* ════════════════════════════════════════ */}
            {/* 🔒 PROTECTED ROUTES (with sidebar)       */}
            {/* All wrapped with DashboardLayout         */}
            {/* ════════════════════════════════════════ */}
      <Route
  element={
    <ProtectedRoute>
      <DashboardLayout />
    </ProtectedRoute>
  }
>
  <Route path="/dashboard"        element={<Dashboard />} />
  <Route path="/upload"           element={<UploadPage />} />
  <Route path="/analysis/:id"     element={<AnalysisResults />} />
  <Route path="/ats/:id"          element={<ATSBreakdown />} />
  <Route path="/skills-gap/:id"   element={<SkillsGap />} />
  <Route path="/job-match/:id"    element={<JobMatch />} />
  <Route path="/profile"          element={<ProfilePage />} />
  <Route path="/history"          element={<HistoryPage />} /> 
</Route>

            {/* 🚫 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;