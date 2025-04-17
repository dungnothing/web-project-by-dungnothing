import { useState } from 'react'
import { Card, CardContent, Typography, Button, Grid, Divider } from '@mui/material'
import { TextField, Box, InputAdornment, IconButton } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { useNavigate } from 'react-router-dom'
import { TrelloIcon } from '~/pages/Auth/sign-in/CustomIcons'
import SvgIcon from '@mui/material/SvgIcon'
import DoneIcon from '@mui/icons-material/Done'
import CloseIcon from '@mui/icons-material/Close'
import { updateVipAPI } from '~/apis'
import { toast } from 'react-toastify'

const PaymentComponent = () => {
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [cvvVisible, setCvvVisible] = useState(false)
  const [packageA, setPackageA] = useState({})
  const [isChoose, setIsChoose] = useState(false)

  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const validatePayment = () => {
    // Kiểm tra số thẻ (chỉ nhận số, 16 chữ số)
    const cardRegex = /^\d{16}$/
    if (!cardRegex.test(cardNumber.replace(/\s/g, ''))) {
      setError('Số thẻ không hợp lệ!')
      return false
    }

    // Kiểm tra ngày hết hạn (định dạng MM/YY và hợp lệ)
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(expiryDate)) {
      setError('Ngày hết hạn không hợp lệ!')
      return false
    }

    // Kiểm tra CVV (3 hoặc 4 chữ số)
    const cvvRegex = /^\d{3,4}$/
    if (!cvvRegex.test(cvv)) {
      setError('Mã CVV/CVC không hợp lệ!')
      return false
    }

    setError('') // Xóa lỗi nếu hợp lệ
    return true
  }

  const handlePayment = async () => {
    if (validatePayment()) {
      try {
        const data = { vip: true }
        await updateVipAPI(data)
        setPaymentStatus('success')
      } catch (error) {
        toast.error('Loi roi')
      }
    }
  }

  const packages = [
    { id: 1, name: 'VIP 1 tháng', price: '99.999 VND', limitedBoard: false, limitedMember: false },
    { id: 2, name: 'VIP 1 năm', price: '999.999 VND', limitedBoard: false, limitedMember: false }
    // { id: 3, name: 'VIP vĩnh viễn', price: '1.500.000 VND' }
  ]

  const handleGoToDashBoard = () => {
    navigate('/dashboard')
  }

  return (
    <div style={{ padding: 20 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'center',
          gap: 1
        }}
      >
        <Button onClick={handleGoToDashBoard}>
          <SvgIcon component={TrelloIcon} inheritViewbox sx={{ color: 'white' }} />
          <Typography variant='span' sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#0079BF' }}>Dung Web </Typography>
        </Button>
      </Box>
      <Typography variant='h4' gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        Nâng cấp tài khoản
      </Typography>
      <Grid container spacing={3} >
        {packages.map((pkg) => (
          <Grid item xs={12} sm={4} key={pkg.id}>
            <Card>
              <CardContent>
                <Typography variant='h6'>{pkg.name}</Typography>
                <Typography color='textSecondary'>{pkg.price}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Không giới hạn thành viên</Typography>
                  {pkg.limitedMember ? <CloseIcon /> : <DoneIcon />}
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography>Không giới hạn bảng</Typography>
                  {pkg.limitedBoard ? <CloseIcon /> : <DoneIcon />}
                </Box>
                <Typography>Lỗi thì liên hệ Dũng nhá, không fix thì là tính năng rồi :D</Typography>
                <Button
                  variant='contained'
                  color='primary'
                  fullWidth
                  style={{ marginTop: 10 }}
                  onClick={() => {
                    setPackageA({ name: pkg.name, price: pkg.price })
                    setIsChoose(true)
                  }}
                >
                  Thanh toán ngay
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {isChoose && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <Card sx={{ width: 400, padding: 3, borderRadius: 3, boxShadow: 3 }}>
              <Typography variant='h6' gutterBottom>
                Nội dung: {packageA.name}
              </Typography>
              <Typography variant='h5' color='primary' fontWeight='bold'>
                {packageA.price}
              </Typography>
              <Box sx={{ marginY: 2 }}>
                <Typography variant='subtitle1' gutterBottom>
                  Điền thông tin thẻ
                </Typography>
                <Divider />
                <Typography sx={{ pt: 2 }}>
                  Số thẻ
                </Typography>
                <TextField
                  fullWidth
                  variant='outlined'
                  placeholder='1234 5678 9123 4567'
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <CreditCardIcon />
                      </InputAdornment>
                    )
                  }}
                  sx={{}}
                />
                {/* Ngày hết hạn & CVV */}
                <Grid container spacing={2} sx={{ pt: 2 }}>
                  <Grid item xs={6}>
                    <Typography>Ngày hết hạn</Typography>
                    <TextField
                      name='ngay het han'
                      fullWidth
                      variant='outlined'
                      placeholder='MM / YY'
                      value={expiryDate}
                      autocomplete="off"
                      onChange={(e) => setExpiryDate(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography>CVV/CVC</Typography>
                    <TextField
                      name = 'cvv'
                      fullWidth
                      variant='outlined'
                      placeholder='123'
                      type={cvvVisible ? 'text' : 'password'}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      autocomplete="off"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setCvvVisible(!cvvVisible)}>
                              {cvvVisible ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />
                  </Grid>
                </Grid>
              </Box>
              {error && (
                <Typography variant='body2' color='error' align='center' sx={{ marginBottom: 2 }}>
                  {error}
                </Typography>
              )}
              <Button
                fullWidth
                variant='contained'
                color='primary'
                startIcon={<LockIcon />}
                sx={{ padding: 2, fontSize: '1rem', fontWeight: 'bold' }}
                onClick={handlePayment}
              >
                Thanh toán {packageA.price}
              </Button>
              {paymentStatus && (
                <Typography variant='body1' color={paymentStatus === 'success' ? 'green' : 'red'} align='center' sx={{ marginTop: 2 }}>
                  {paymentStatus === 'success' ? 'Thanh toán thành công!' : 'Thanh toán thất bại, vui lòng thử lại.'}
                </Typography>
              )}
            </Card>
          </Box>
        )}
      </Grid>
    </div>
  )
}

export default PaymentComponent
