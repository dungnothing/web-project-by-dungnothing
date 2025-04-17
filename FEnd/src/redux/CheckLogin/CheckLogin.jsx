import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

const CheckLogin = () => {
  const accessToken = useSelector((state) => state.auth.user.accessToken) // Lấy token từ Redux store
  return accessToken ? <Outlet /> : <Navigate to="/" replace />
}

export default CheckLogin
