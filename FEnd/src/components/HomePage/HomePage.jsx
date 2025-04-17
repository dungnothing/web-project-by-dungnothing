import { useRef } from 'react'
import { Typography, Button, Box, IconButton } from '@mui/material'
import FacebookIcon from '@mui/icons-material/Facebook'
import InstagramIcon from '@mui/icons-material/Instagram'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import GitHubIcon from '@mui/icons-material/GitHub'
import background from '~/assets/background.jpg' // Hình nền chính
import quanLyBang from '~/assets/QLBang.png' // Hình minh họa tính năng 1
import quanLyThanhVien from '~/assets/QLTVien.jpg' // Hình minh họa tính năng 2
import quanLyThoiGian from '~/assets/QLTGian.jpg' // Hình minh họa tính năng 3
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'

const HomePage = () => {
  const navigate = useNavigate()
  // Ref cho phần Introduction
  const introductionRef = useRef(null)
  const futureRef = useRef(null)
  const contactRef = useRef(null)

  const signIn = () => {
    navigate('/sign-in')
  }

  const signUp = () => {
    navigate('/sign-up')
  }

  // Hàm cuộn đến các phần
  const scrollToIntroduction = () => {
    introductionRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToFuture = () => {
    futureRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    contactRef.current.scrollIntoView({ behavior: 'smooth' })
  }

  // Navbar đơn giản, tập trung vào desktop
  const menuItems = [
    { text: 'Introduction', onClick: scrollToIntroduction },
    { text: 'Features', onClick: scrollToFuture },
    { text: 'Contact', onClick: scrollToContact }
  ]

  return (
    <Box sx={{ backgroundColor: '#fff' }}>
      {/* Header */}
      <Box
        sx={{
          backgroundColor: '#1a2a44',
          color: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          px: 5,
          py: 1.5,
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        }}
      >
        {/* Logo */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
          Shin
        </Typography>

        {/* Navigation Desktop */}
        <Box sx={{ display: 'flex', gap: 3, ml: 18 }}>
          {menuItems.map((item) => (
            <Button
              key={item.text}
              color="inherit"
              onClick={item.onClick}
              sx={{
                fontSize: '1rem',
                fontWeight: 'medium',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)', transform: 'scale(1.05)', transition: 'all 0.3s' }
              }}
            >
              {item.text}
            </Button>
          ))}
        </Box>

        {/* Auth Buttons Desktop */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            onClick={signIn}
            color="inherit"
            aria-label="Đăng nhập"
            sx={{ '&:hover': { transform: 'scale(1.05)', transition: 'all 0.3s' } }}
          >
            Đăng nhập
          </Button>
          <Button
            onClick={signUp}
            variant="contained"
            sx={{
              backgroundColor: '#00c4ff',
              borderRadius: '20px',
              px: 3,
              '&:hover': { backgroundColor: '#00b0e6', transform: 'scale(1.05)', transition: 'all 0.3s' }
            }}
            aria-label="Đăng ký"
          >
            Đăng ký
          </Button>
        </Box>
      </Box>

      {/* Hero Section */}
      <Box
        sx={{
          position: 'relative',
          height: '80vh',
          backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          color: '#fff'
        }}
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Box sx={{ maxWidth: '900px', px: 2 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 'bold',
              fontSize: '4.5rem',
              mb: 2,
              textTransform: 'uppercase',
              textShadow: '2px 2px 8px rgba(0,0,0,0.3)'
            }}
            component={motion.div}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Welcome to Shin
          </Typography>
          <Typography
            variant="h5"
            sx={{ fontSize: '1.8rem', mb: 4, opacity: 0.9 }}
            component={motion.div}
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Quản lý công việc hiệu quả với bảng, cột và thẻ
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#00c4ff',
              color: '#fff',
              borderRadius: '25px',
              px: 5,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              '&:hover': { backgroundColor: '#00b0e6', transform: 'scale(1.1)', transition: 'all 0.3s' }
            }}
            onClick={signUp}
            aria-label="Dùng thử ngay"
            component={motion.div}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7, type: 'spring', stiffness: 120 }}
          >
            Dùng thử ngay
          </Button>
        </Box>
      </Box>

      {/* Introduction Section */}
      <Box
        ref={introductionRef}
        sx={{
          py: 10,
          px: 5,
          textAlign: 'center',
          background: 'linear-gradient(180deg, #f5f7fa 0%, #ffffff 100%)'
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: 'bold', color: '#1a2a44', mb: 3 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Giới thiệu về Shin
        </Typography>
        <Typography
          variant="body1"
          sx={{ maxWidth: '800px', mx: 'auto', color: '#666', lineHeight: 1.8, fontSize: '1.1rem' }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          Shin là nền tảng quản lý công việc giúp bạn tổ chức dự án một cách hiệu quả. Với các tính năng như bảng (Boards), danh sách (Lists), và thẻ (Cards), bạn có thể dễ dàng theo dõi tiến độ, cộng tác với đội nhóm, và hoàn thành công việc đúng hạn.
        </Typography>
      </Box>

      {/* Features/Images Section */}
      <Box
        ref={futureRef}
        sx={{
          py: 10,
          px: 5,
          backgroundColor: '#fff'
        }}
      >
        <Typography
          variant="h3"
          sx={{ fontWeight: 'bold', color: '#1a2a44', textAlign: 'center', mb: 6 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Tính năng nổi bật
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 4,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {[quanLyBang, quanLyThanhVien, quanLyThoiGian].map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}
            >
              <Box
                sx={{
                  width: '300px',
                  height: '200px',
                  backgroundImage: `url(${image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '12px',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s'
                }}
              />
              <Typography
                variant="subtitle1"
                sx={{ mt: 2, textAlign: 'center', color: '#1a2a44', fontWeight: 'medium' }}
              >
                {index === 0 ? 'Quản lý bảng' : index === 1 ? 'Cộng tác nhóm' : 'Theo dõi tiến độ'}
              </Typography>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Contact Section */}
      <Box
        ref={contactRef}
        sx={{
          py: 8,
          px: 5,
          backgroundColor: '#1a2a44',
          color: '#fff',
          textAlign: 'center'
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontWeight: 'bold', mb: 2 }}
          component={motion.div}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Liên hệ với chúng tôi
        </Typography>

        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
          <EmailIcon />
          <Typography>dungvhtb1009@gmail.com</Typography>
        </Box>

        <Box display="flex" justifyContent="center" alignItems="center" gap={1} mb={1}>
          <PhoneIcon />
          <Typography>0354674321</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3 }}>
          {[
            { icon: <FacebookIcon />, link: 'https://facebook.com', label: 'Facebook' },
            { icon: <InstagramIcon />, link: 'https://instagram.com', label: 'Instagram' },
            { icon: <LinkedInIcon />, link: 'https://www.linkedin.com/in/dung-hoang-856205345/', label: 'LinkedIn' },
            { icon: <GitHubIcon />, link: 'https://github.com/dungnothing', label: 'GitHub' }
          ].map((social, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <IconButton
                component="a"
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: '#fff', fontSize: '2.5rem' }}
                aria-label={social.label}
              >
                {social.icon}
              </IconButton>
            </motion.div>
          ))}
        </Box>
        <Typography variant="body2" sx={{ mt: 3, opacity: 0.8 }}>
          Theo dõi chúng tôi để nhận cập nhật mới nhất!
        </Typography>
      </Box>
    </Box>
  )
}

export default HomePage