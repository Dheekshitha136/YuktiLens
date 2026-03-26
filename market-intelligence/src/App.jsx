import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'

import Login from './pages/Login'
import Signup from './pages/Signup'
import Onboarding from './pages/Onboarding'
import Dashboard from './pages/Dashboard'

// 🔐 Protected Route FIXED
function ProtectedRoute({ session, loading, children }) {
  // Wait until session is loaded
  if (loading) {
    return (
      <div style={{
        padding: '30px',
        color: 'white',
        background: '#020617',
        minHeight: '100vh'
      }}>
        Loading...
      </div>
    )
  }

  // If no session → go to login
  if (!session) {
    return <Navigate to="/login" replace />
  }

  return children
}

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 🔥 Get session initially
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    // 🔥 Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  // 🔥 Optional loading screen (initial)
  if (loading) {
    return (
      <div style={{
        padding: '30px',
        color: 'white',
        background: '#020617',
        minHeight: '100vh'
      }}>
        Loading...
      </div>
    )
  }

  return (
    <Routes>

      {/* 🔐 Redirect if already logged in */}
      <Route
        path="/login"
        element={session ? <Navigate to="/onboarding" /> : <Login />}
      />

      <Route
        path="/signup"
        element={session ? <Navigate to="/onboarding" /> : <Signup />}
      />

      {/* 🔐 Protected Routes */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute session={session} loading={loading}>
            <Dashboard session={session} />
          </ProtectedRoute>
        }
      />

      {/* 🔥 Smart fallback route */}
      <Route
        path="*"
        element={
          session
            ? <Navigate to="/dashboard" replace />
            : <Navigate to="/login" replace />
        }
      />

    </Routes>
  )
}

export default App