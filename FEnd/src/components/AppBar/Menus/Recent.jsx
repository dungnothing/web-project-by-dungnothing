import Box from '@mui/material/Box'
import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AutoFixNormalIcon from '@mui/icons-material/AutoFixNormal'

function Recent() {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        id="demo-positioned-button-recent"
        aria-controls={open ? 'demo-positioned-menu-recent' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Gần đây
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button-recent"
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
        <Box sx={{ width: '200px' }}>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AutoFixNormalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tab 1</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AutoFixNormalIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Tab 2</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  )
}

export default Recent
