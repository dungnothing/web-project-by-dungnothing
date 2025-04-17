import Box from '@mui/material/Box'
import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { useNavigate } from 'react-router-dom'

function Workspaces() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const navigate = useNavigate()
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleGoToDashboard = () => {
    navigate('/dashboard')
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="demo-positioned-button-workspaces"
        aria-controls={open ? 'demo-positioned-menu-workspaces' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Các không gian làm việc
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button-workspaces"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
      >
        <Box sx={{ width: '300px' }}>
          <ListItemText
            color="text.secondary"
            display='flex'
            sx={{
              opacity: '0.6',
              justifyContent: 'center',
              width: '100%',
              paddingLeft: '30px'
            }}>
            Không gian làm việc của bạn
          </ListItemText>
          <MenuItem onClick={handleGoToDashboard}>
            <ListItemIcon>
              <AutoFixNormalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tab 1 tính năng chưa biết làm như lào</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  )
}

export default Workspaces
