import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import ForgotPassword from './ForgotPassword'
import { GoogleIcon } from './CustomIcons'
import { useNavigate } from 'react-router-dom'
import { TrelloIcon } from './CustomIcons'
import SvgIcon from '@mui/material/SvgIcon'
import { signInAPI } from '~/apis'
import { toast } from 'react-toastify'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setCredentials } from '~/redux/features/authSlice'
import { IconButton } from '@mui/material'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px'
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
  })
}))

// const SignInContainer = styled(Stack)(({ theme }) => ({
//   minHeight: '100%',
//   padding: theme.spacing(2),
//   [theme.breakpoints.up('sm')]: {
//     padding: theme.spacing(4)
//   },
//   '&::before': {
//     content: '""',
//     display: 'block',
//     position: 'absolute',
//     zIndex: -1,
//     inset: 0,
//     backgroundImage:
//       'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
//     backgroundRepeat: 'no-repeat',
//     ...theme.applyStyles('dark', {
//       backgroundImage:
//         'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))'
//     })
//   }
// }))

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('')
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
  const [open, setOpen] = React.useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const dispatch = useDispatch()
  const notifications = useSelector(state => state.auth.notifications)
  const navigate = useNavigate()

  // Thêm useEffect để theo dõi notifications
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Bạn có thể thêm các xử lý khác ở đây nếu cần
    }
  }, [notifications]) // useEffect sẽ chạy mỗi khi notifications thay đổi

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleGoToMainPage = () => {
    navigate('/')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const isValid = validateInputs()
    if (isValid) {
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      const signInData = {
        email,
        password
      }
      try {
        const response = await signInAPI(signInData)
        const { userName, email, avatar, accessToken, refreshToken, vip, userId } = response
        // Dispatch credentials
        dispatch(setCredentials({
          userId: userId,
          userName: userName,
          email: email,
          avatar: avatar,
          accessToken: accessToken,
          refreshToken: refreshToken,
          vip: vip
        }))
        navigate('/dashboard')
        toast.success('Đăng nhập thành công!')
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
        } else {
          toast.error('Không ổn rồi đại ca ơi!')
        }
      }
    }
  }

  const validateInputs = () => {
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    let isValid = true
    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true)
      setEmailErrorMessage('Please enter a valid email address.')
      isValid = false
    } else {
      setEmailError(false)
      setEmailErrorMessage('')
    }
    if (!password.value || password.value.length < 6) {
      setPasswordError(true)
      setPasswordErrorMessage('Password must be at least 6 characters long.')
      isValid = false
    } else {
      setPasswordError(false)
      setPasswordErrorMessage('')
    }
    return isValid
  }

  return (
    <Box direction="column" justifyContent="space-between" sx={{ mt: 4 }}>
      <Card variant="outlined">
        <Button
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            cursor: 'pointer',
            width: 'fit-content',
            '&:hover': {
              bgcolor: 'transparent'
            }
          }}
          onClick={handleGoToMainPage}
        >
          <SvgIcon component={TrelloIcon} inheritViewbox sx={{ color: 'white' }} />
          <Typography variant='span' sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0079BF' }}>Dung Web </Typography>
        </Button>
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
        >
          Sign in
        </Typography>
        <Box
          component="form"
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              error={emailError}
              helperText={emailErrorMessage}
              id="email"
              type="email"
              name="email"
              placeholder="your@email.com"
              autoFocus
              required
              fullWidth
              variant="outlined"
              color={emailError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              error={passwordError}
              helperText={passwordErrorMessage}
              name="password"
              placeholder="••••••"
              type={showCurrentPassword ? 'text' : 'password'}
              id="password"
              required
              fullWidth
              variant="outlined"
              color={passwordError ? 'error' : 'primary'}
              InputProps={{
                endAdornment: (
                  <InputAdornment sx={{ display: 'flex' }} position="end">
                    <IconButton sx={{
                      '&:hover': {
                        backgroundColor: 'transparent'
                      }
                    }} onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                      {showCurrentPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </FormControl>
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label="Remember me"
          />
          <ForgotPassword open={open} handleClose={handleClose} />
          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Sign in
          </Button>
          <Link
            component="button"
            type="button"
            onClick={handleClickOpen}
            variant="body2"
            sx={{ alignSelf: 'center' }}
          >
            Forgot your password?
          </Link>
        </Box>
        <Divider>or</Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign in with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign in with Google
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link
              to="/sign-up"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
