import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import ComplaintList from './pages/ComplaintList'
import NewComplaint from './pages/NewComplaint'
import ComplaintDetails from './pages/ComplaintDetails'
import TrackStatus from './pages/TrackStatus'
import AdminAnalytics from './pages/AdminAnalytics'
import UserManagement from './pages/UserManagement'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* All Logged In Users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/track" element={<TrackStatus />} />
          <Route path="/complaints" element={<ComplaintList />} />
          <Route path="/complaints/:id" element={<ComplaintDetails />} />
        </Route>

        {/* User Only */}
        <Route element={<ProtectedRoute allowedRoles={['User']} />}>
          <Route path="/complaints/new" element={<NewComplaint />} />
        </Route>

        {/* Admin Only */}
        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/analytics" element={<AdminAnalytics />} />
          <Route path="/users" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App