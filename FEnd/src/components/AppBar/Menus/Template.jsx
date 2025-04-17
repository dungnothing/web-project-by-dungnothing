import Box from '@mui/material/Box'
import React from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Avatar from '@mui/material/Avatar'

function Template() {
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
        id="demo-positioned-button-template"
        aria-controls={open ? 'demo-positioned-menu-template' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Mẫu
      </Button>
      <Menu
        id="demo-positioned-menu"
        aria-labelledby="demo-positioned-button-template"
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
              alignItems: 'center',
              opacity: '0.7',
              width: '100%',
              paddingLeft: '50px'
            }}>
            Top Template
          </ListItemText>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Avatar
                alt="mau 1"
                src="https://i.pinimg.com/enabled_lo/564x/65/21/a9/6521a9f123ca49c7321a265bbc121ed5.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center' }} >Tempalte 1</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Avatar
                alt="mau 2"
                src="https://i.pinimg.com/enabled_lo/564x/41/96/b3/4196b30fea4d2d199db335f34f461f77.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center' }}>Tempalte 2</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Avatar
                alt="mau 3"
                src="https://i.pinimg.com/736x/ac/29/76/ac297667e0f061edb7c8d4dea35086ba.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center' }}>Tempalte 3</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <Avatar
                alt="mau 4"
                src="https://i.pinimg.com/enabled_lo/564x/22/7b/c0/227bc0564b2e2b88b125ecde38699791.jpg"
                sx={{ width: 40, height: 40 }}
              />
            </ListItemIcon>
            <ListItemText sx={{ paddingLeft: '10px', justifyContent: 'center' }}>Tempalte 4</ListItemText>
          </MenuItem>
        </Box>
      </Menu>
    </Box>
  )
}

export default Template
