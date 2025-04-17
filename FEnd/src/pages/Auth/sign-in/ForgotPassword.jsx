import PropTypes from 'prop-types'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { forgotPasswordAPI } from '~/apis'
import { toast } from 'react-toastify'
import { TextField } from '@mui/material'
import { useState } from 'react'

function ForgotPassword({ open, handleClose }) {
  const [email, setEmail] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await forgotPasswordAPI({ email })
      if (response && response.status === 200) {
        toast.success('Check email của bạn để reset password nhé!')
        handleClose()
      }
    } catch (error) {
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Có lỗi xảy ra!')
      } else {
        toast.error('Không thể kết nối với server. Vui lòng thử lại sau!')
      }
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        component: 'form',
        onSubmit: handleSubmit,
        sx: { backgroundImage: 'none' }
      }}
    >
      <DialogTitle>Quên mật khẩu </DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Điền vào email của bạn. Chúng tôi sẽ gửi mật khẩu mới tới email của bạn.
        </DialogContentText>
        <TextField
          required
          id="forgot email"
          name="forgot email"
          label="Email address"
          type="email"
          placeholder="Email address"
          fullWidth
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button variant="contained" type="submit">
          Gửi
        </Button>
        <Button
          onClick={() => {
            handleClose()
            setEmail('')
          }}>
          Hủy
        </Button>
      </DialogActions>
    </Dialog>
  )
}

ForgotPassword.propTypes = {
  handleClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired
}

export default ForgotPassword


