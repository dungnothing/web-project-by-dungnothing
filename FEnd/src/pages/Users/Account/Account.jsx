import { useState, useRef } from 'react'
import Avatar from '@mui/material/Avatar'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import UploadIcon from '@mui/icons-material/Upload'
import TextField from '@mui/material/TextField'
import BadgeIcon from '@mui/icons-material/Badge'
import InputAdornment from '@mui/material/InputAdornment'
import EmailIcon from '@mui/icons-material/Email'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PasswordIcon from '@mui/icons-material/Password'
import { updateProfileAPI, updatePasswordAPI, updateAvatarAPI, deleteAccountAPI } from '~/apis'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { updateUserInfo, addNotification } from '~/redux/features/authSlice'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from 'react-router-dom'
import { logout } from '~/redux/features/authSlice'
import VerifiedIcon from '@mui/icons-material/Verified'

function Account() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.auth.user)
  const [userName, setUserName] = useState(user.userName)
  const [editableName, setEditableName] = useState(userName)
  const [avatar, setAvatar] = useState(user.avatar)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [verifyNewPassword, setVerifyNewPassword] = useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showVerifyNewPassword, setShowVerifyNewPassword] = useState(false)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const navigate = useNavigate()

  const emailUser = user.email

  const fileInputRef = useRef(null)

  // Delete account
  const handleDeleteClick = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  // Change infomation
  const handleNameChange = (event) => {
    setEditableName(event.target.value)
  }

  const handleChangePassword = async () => {
    if (newPassword !== verifyNewPassword) {
      toast.error('Mật khẩu mới không khớp!')
      return
    }
    try {
      await updatePasswordAPI({ token: user.token, currentPassword, newPassword })
      toast.success('Đổi mật khẩu thành công!')
      dispatch(addNotification({
        token: user.token,
        message: 'Mật khẩu đã đổi lúc ' + new Date().toLocaleString()
      }))
    } catch (error) {
      toast.error('Sai mật khẩu hiện tại rồi!')
    }
  }

  const handleUpdateName = async () => {
    try {
      await updateProfileAPI({ token: user.token, newUserName: editableName })
      setUserName(editableName)
      dispatch(updateUserInfo({ userName: editableName }))
      dispatch(addNotification({
        token: user.token,
        message: 'Tên tài khoản được đổi thành ' + editableName + ' lúc ' + new Date().toLocaleString()
      }))
      toast.success('Đổi tên thành công!')
    } catch (error) {
      toast.error('Đổi tên thất bại!')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleChangeAvatar = async (event) => {
    const file = event.target.files[0]
    const formData = new FormData()
    formData.append('avatar', file)
    formData.append('token', user.token)
    try {
      const response = await updateAvatarAPI(formData)
      dispatch(updateUserInfo({ avatar: response.avatar }))
      dispatch(addNotification({
        token: user.token,
        message: 'Ảnh đại diện đã được đổi lúc ' + new Date().toLocaleString()
      }))
      setAvatar(response.avatar)
      toast.success('Đổi ảnh đại diện thành công!')
    } catch (error) {
      toast.error('Đổi ảnh đại diện thất bại!')
    }
  }

  const handleConfirmDelete = async () => {
    try {
      await deleteAccountAPI()
      toast.success('Xóa tài khoản thành công')
      setOpenDeleteDialog(false)
      setTimeout(() => {
        dispatch(logout())
        navigate('/')
      }, 3000)
    } catch (error) {
      toast.error('Thất bại')
    }
  }

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: 2
    }}>
      <Box sx={{ width: '500px', display: 'flex', alignItems: 'center', padding: 1 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Avatar
            src={avatar}
            sx={{ width: 60, height: 60 }}
          />
          <Button variant="contained" startIcon={<UploadIcon />} sx={{ mt: 1 }} onClick={handleUploadClick}>Upload</Button>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleChangeAvatar}
          />
        </Box>
        <Box>
          {user.vip && (<VerifiedIcon/>)}
          <Typography variant='h5' sx={{ display: 'flex', alignItems: 'center', ml: 3 }}>{userName}</Typography>
          <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', ml: 3, opacity: 0.7 }}>Gió is like a wind, always by my sides</Typography>
        </Box>
      </Box>
      <Box sx={{ width: '500px', display: 'flex', alignItems: 'center', padding: 1 }}>
        <TextField
          disabled
          id="outlined-search"
          label="Your Email"
          variant="filled"
          value={emailUser} // Display email
          sx={{
            width: '500px'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailIcon />
              </InputAdornment>
            )
          }}
        />
      </Box>
      <Box sx={{ width: '500px', display: 'flex', alignItems: 'center', padding: 1 }}>
        <TextField
          id="outlined-search"
          label="Your Name"
          variant="filled"
          value={editableName}
          onChange={handleNameChange}
          sx={{
            width: '500px'
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <BadgeIcon />
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" onClick={handleUpdateName} sx={{ ml: 2, backgroundColor: '#FFA09B', '&:hover': { backgroundColor: '#FFA09B' } }}>Save</Button>
      </Box>
      <Box sx={{ width: '500px', display: 'flex', flexDirection: 'column', padding: 1 }}>
        <TextField
          id="current-password"
          label="Current Password"
          variant="filled"
          type={showCurrentPassword ? 'text' : 'password'}
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              </InputAdornment>
            )
          }}
        />
        <TextField
          id="new-password"
          label="New Password"
          variant="filled"
          type={showNewPassword ? 'text' : 'password'}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              </InputAdornment>
            )
          }}
        />
        <TextField
          id="verify-new-password"
          label="Verify New Password"
          variant="filled"
          type={showVerifyNewPassword ? 'text' : 'password'}
          value={verifyNewPassword}
          onChange={(e) => setVerifyNewPassword(e.target.value)}
          sx={{ mb: 2 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PasswordIcon />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => setShowVerifyNewPassword(!showVerifyNewPassword)}>
                  {showVerifyNewPassword ? <VisibilityOff /> : <Visibility />}
                </Button>
              </InputAdornment>
            )
          }}
        />
        <Button variant="contained" onClick={handleChangePassword} sx={{ m: 1, backgroundColor: '#B2A5FF', '&:hover': { backgroundColor: '#B2A5FF' } }}>Change Password</Button>
        <Button variant="contained" onClick={handleDeleteClick} sx={{ m: 1, backgroundColor: '#B82132', '&:hover': { backgroundColor: '#B82132' } }}>Xóa tài khoản</Button>
        {/** Dialog xoa tai khoan */}
        <Dialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Xác nhận xóa
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Hành động này không thể hoàn tác và tài khoản sẽ pay màu.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleConfirmDelete}
              autoFocus
              color="error"
            >
              Xóa liền
            </Button>
            <Button onClick={handleCloseDeleteDialog}>Hủy</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Account
