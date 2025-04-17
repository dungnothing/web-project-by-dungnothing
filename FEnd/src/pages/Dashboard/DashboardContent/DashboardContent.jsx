import { Box, Typography, Divider, MenuItem } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import SettingsIcon from '@mui/icons-material/Settings'
import ViewListIcon from '@mui/icons-material/ViewList'
import MainBoard from './MainBoard/MainBoard'
import Template from './Template/Template'
import { useState } from 'react'
import Task from './Task/Task'
import Setting from './Setting/Setting'
import { useNavigate, useLocation } from 'react-router-dom'

const DashboardContent = ({ searchValue, starredBoards, setStarredBoards }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)
  const initialTab = queryParams.get('tab') || 'MainBoardTop'

  const [selectedItem, setSelectedItem] = useState(initialTab)

  const handleSelect = (item) => {
    setSelectedItem(item)
    navigate(`?tab=${item}`) // Cập nhật URL
  }

  const renderContent = () => {
    if (selectedItem.includes('MainBoard')) return <MainBoard searchValue={searchValue} starredBoards={starredBoards} setStarredBoards={setStarredBoards} />
    if (selectedItem.includes('Template')) return <Template />
    if (selectedItem.includes('Tasks')) return <Task />
    if (selectedItem.includes('Settings')) return <Setting />
    return <MainBoard searchValue={searchValue} starredBoards={starredBoards} setStarredBoards={setStarredBoards} />
  }

  return (
    <Box sx={{ minHeight: '100%', bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#EEEEEE') }}>
      <Box sx={{ p: 3, maxWidth: '1200px', margin: 'auto' }}>
        {/* Sidebar */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Box sx={{
            width: '250px',
            borderRight: '1px solid #578FCA',
            // justifyContent: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px'
          }}>
            {/* Menu trên */}
            <Box>
              <MenuItem
                onClick={() => handleSelect('MainBoardTop')}
                sx={{
                  bgcolor: selectedItem === 'MainBoardTop' ? '#98D8EF' : 'transparent',
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '')
                }}
              >
                <DashboardIcon sx={{ color: selectedItem === 'MainBoardTop' ? '#578FCA' : 'inherit' }} />
                <Typography sx={{ pl: 1, color: selectedItem === 'MainBoardTop' ? '#578FCA' : 'inherit' }}>Bảng</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleSelect('TemplateTop')}
                sx={{
                  bgcolor: selectedItem === 'TemplateTop' ? '#98D8EF' : 'transparent',
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '')
                }}
              >
                <ViewListIcon sx={{ color: selectedItem === 'TemplateTop' ? '#578FCA' : 'inherit' }} />
                <Typography sx={{ pl: 1, color: selectedItem === 'TemplateTop' ? '#578FCA' : 'inherit' }}>Mẫu</Typography>
              </MenuItem>
            </Box>
            <Divider sx={{ bgcolor: '#578FCA' }} />
            {/* Menu dưới */}
            <Box>
              <Box sx={{ p: 1 }}>
                <Typography variant='subtitle1' fontWeight='bold' sx={{ p: 1, color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '') }}>
                  Không gian làm việc
                </Typography>
              </Box>
              <MenuItem
                onClick={() => handleSelect('MainBoardBottom')}
                sx={{
                  bgcolor: selectedItem === 'MainBoardBottom' ? '#98D8EF' : 'transparent',
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '')
                }}
              >
                <DashboardIcon sx={{ color: selectedItem === 'MainBoardBottom' ? '#578FCA' : 'inherit' }} />
                <Typography sx={{ padding: 1, color: selectedItem === 'MainBoardBottom' ? '#578FCA' : 'inherit' }}>Bảng</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleSelect('Tasks')}
                sx={{
                  bgcolor: selectedItem === 'Tasks' ? '#98D8EF' : 'transparent',
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '')
                }}
              >
                <StarBorderIcon sx={{ color: selectedItem === 'Tasks' ? '#578FCA' : 'inherit' }} />
                <Typography sx={{ padding: 1, color: selectedItem === 'Tasks' ? '#578FCA' : 'inherit' }}>Nhiệm vụ</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => handleSelect('Settings')}
                sx={{
                  bgcolor: selectedItem === 'Settings' ? '#98D8EF' : 'transparent',
                  color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '')
                }}
              >
                <SettingsIcon sx={{ color: selectedItem === 'Settings' ? '#578FCA' : 'inherit' }} />
                <Typography sx={{ padding: 1, color: selectedItem === 'Settings' ? '#578FCA' : 'inherit' }}>Cài đặt</Typography>
              </MenuItem>
            </Box>
          </Box>
          {/* Main content */}
          <Box sx={{ flex: 1 }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default DashboardContent
