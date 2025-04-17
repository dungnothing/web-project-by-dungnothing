/* eslint-disable no-console */
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import socket from './utils/socket' // Import socket
import SignIn from './pages/Auth/sign-in/SignIn'
import SignUp from './pages/Auth/sign-up/SignUp'
import Board from '~/pages/Broads/Board'
import HomePage from './components/HomePage/HomePage'
import User from '~/pages/Users/User'
import Dashboard from './pages/Dashboard/Dashboard'
import CheckLogin from './redux/CheckLogin/CheckLogin'
import UpgradeVip from './pages/Dashboard/DashboardContent/Setting/UpgradeVip'

function App() {
  useEffect(() => {
    // Kết nối socket khi App mount
    socket.on('connect', () => {
      console.log('🔌Chào dũng đại ca. Kết nối Socket.IO thành công:', socket.id)
    })

    socket.on('message', (msg) => {
      console.log('Tin nhắn từ server:', msg)
    })

    return () => {
      socket.off('message')
    }
  }, [])

  const [starredBoards, setStarredBoards] = useState({ title: [], starBoardIds: [] }) // Lưu trạng thái sao

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<CheckLogin />}>
          <Route path="/dashboard" element={<Dashboard starredBoards={starredBoards} setStarredBoards={setStarredBoards} />} />
          <Route path="/boards/:boardId" element={<Board starredBoards={starredBoards} setStarredBoards={setStarredBoards} />} />
          <Route path="/user" element={<User />} />
          <Route path="/upgrade-vip" element={<UpgradeVip/>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
