import { useState } from 'react'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import TasksPage from './pages/TasksPage'



function App() {


  return (
    <>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/tasks" element={<TasksPage status={null} title="All Tasks" showStats />} />
      <Route path="/tasks/pending" element={<TasksPage status="pending" title="Pending Tasks" />} />
      <Route path="/tasks/completed" element={<TasksPage status="completed" title="Completed Tasks" />} />
      
    </Routes>
      
    </>
  )
}

export default App
