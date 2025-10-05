import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

// Pages
import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import WorkspaceCreation from './pages/auth/WorkspaceCreation'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/ContactsSimple'
import ContactDetail from './pages/ContactDetail'
import Tasks from './pages/Tasks'
import Pipeline from './pages/Pipeline'
import Reports from './pages/Reports'
import TeamMemberDashboard from './pages/TeamMemberDashboard'
import MyTasks from './pages/MyTasks'
import MyContacts from './pages/MyContacts'
import Settings from './pages/Settings'
import Team from './pages/Team'

// Layout
import AppLayout from './components/layout/AppLayout'

// Context
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppProviders } from './context/Providers'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  if (loading && !initialized) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  if (loading && !initialized) {
    return <div>Loading...</div>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProviders>
          <div className="App">
            <Toaster position="top-center" />
                  <Routes>
                    {/* Public Routes */}
                    <Route
                      path="/login"
                      element={
                        <PublicRoute>
                          <Login />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/signup"
                      element={
                        <PublicRoute>
                          <Signup />
                        </PublicRoute>
                      }
                    />
                    <Route
                      path="/workspace/create"
                      element={
                        <ProtectedRoute>
                          <WorkspaceCreation />
                        </ProtectedRoute>
                      }
                    />

                    {/* Protected Routes */}
                    <Route
                      path="/"
                      element={
                        <ProtectedRoute>
                          <AppLayout />
                        </ProtectedRoute>
                      }
                    >
                      {/* Redirect user based on role on root */}
                      <Route index element={<RoleRedirect />} />

                      {/* Founder routes */}
                      <Route path="dashboard" element={<Dashboard />} />
                      <Route path="contacts" element={<Contacts />} />
                      <Route path="contacts/:id" element={<ContactDetail />} />
                      <Route path="tasks" element={<Tasks />} />
                      <Route path="pipeline" element={<Pipeline />} />
                      <Route path="team" element={<Team />} />
                      <Route path="my-tasks" element={<MyTasks />} />
                      <Route path="my-contacts" element={<MyContacts />} />
                      <Route path="reports" element={<Reports />} />
                      <Route path="settings" element={<Settings />} />

                      {/* Team member route */}
                      <Route path="team-dashboard" element={<TeamMemberDashboard />} />
                    </Route>
                  </Routes>

                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 4000,
                      style: {
                        background: '#fff',
                        color: '#374151',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        borderRadius: '12px',
                      },
                    }}
                  />
          </div>
        </AppProviders>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App

// Redirect user at root path based on role
function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />

  if (user.role === 'team') {
    return <Navigate to="/team-dashboard" replace />
  }

  // Default founder dashboard
  return <Navigate to="/dashboard" replace />
}
