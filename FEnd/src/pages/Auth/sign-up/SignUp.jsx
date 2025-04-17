import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import { Link } from 'react-router-dom'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MuiCard from '@mui/material/Card'
import { styled } from '@mui/material/styles'
import { GoogleIcon } from './CustomIcons'
import { TrelloIcon } from './CustomIcons'
import SvgIcon from '@mui/material/SvgIcon'
import { useNavigate } from 'react-router-dom'
import { signUpAPI } from '~/apis'
import { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import InputAdornment from '@mui/material/InputAdornment'
import { toast } from 'react-toastify'
import { IconButton } from '@mui/material'

const Card = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  [theme.breakpoints.up('sm')]: {
    width: '450px'
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px'
  })
}))

// const SignUpContainer = styled(Stack)(({ theme }) => ({
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

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false)
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('')
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('')
  const [nameError, setNameError] = React.useState(false)
  const [nameErrorMessage, setNameErrorMessage] = React.useState('')
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)

  const navigate = useNavigate()

  const validateInputs = () => {
    const email = document.getElementById('email')
    const password = document.getElementById('password')
    const userName = document.getElementById('name')

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

    if (!userName.value || userName.value.length < 1) {
      setNameError(true)
      setNameErrorMessage('Name is required.')
      isValid = false
    } else {
      setNameError(false)
      setNameErrorMessage('')
    }

    return isValid
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (validateInputs()) {
      const email = document.getElementById('email').value
      const password = document.getElementById('password').value
      const userName = document.getElementById('name').value
      const signUpData = {
        email,
        password,
        userName
      }
      try {
        // Gọi API đăng ký
        await signUpAPI(signUpData)
        navigate('/sign-in') // Điều hướng sau khi đăng ký thành công
        toast.success('Đăng ký thành công!')
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message)
        }
      }
    }
  }

  const handleGoToMainPage = () => {
    navigate('/')
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
          Sign up
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <FormControl>
            <FormLabel htmlFor="name">Full name</FormLabel>
            <TextField
              autoComplete="name"
              name="name"
              required
              fullWidth
              id="name"
              placeholder="Dũng Siu Nhân"
              error={nameError}
              helperText={nameErrorMessage}
              color={nameError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              required
              fullWidth
              id="email"
              placeholder="your@email.com"
              name="email"
              autoComplete="email"
              variant="outlined"
              error={emailError}
              helperText={emailErrorMessage}
              color={passwordError ? 'error' : 'primary'}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              required
              fullWidth
              name="password"
              placeholder="••••••"
              type={showCurrentPassword ? 'text' : 'password'}
              id="password"
              autoComplete="new-password"
              variant="outlined"
              error={passwordError}
              helperText={passwordErrorMessage}
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            onClick={validateInputs}
          >
            Sign up
          </Button>
        </Box>
        <Divider>
          <Typography sx={{ color: 'text.secondary' }}>or</Typography>
        </Divider>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => alert('Sign up with Google')}
            startIcon={<GoogleIcon />}
          >
            Sign up with Google
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Already have an account?{' '}
            <Link
              to="/sign-in"
              variant="body2"
              sx={{ alignSelf: 'center' }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Card>
    </Box>
  )
}
