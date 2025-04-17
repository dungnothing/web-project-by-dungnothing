import Box from '@mui/material/Box'
import { useState } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'

function Starred({ starredBoards }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleGoToBoardStarred = (boardId) => {
    navigate(`/boards/${boardId}`)
  }

  return (
    <Box>
      <Button
        sx={{ color: 'white' }}
        onClick={handleClick}
        endIcon={<ExpandMoreIcon />}
      >
        Đã đánh dấu
      </Button>
      <Menu
        sx={{ minWidth: '200px', minHeight: '200px' }}
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
        PaperProps={{
          style: {
            width: '400px',
            maxHeight: '400px',
            minHeight: '50px'
          }
        }}
      >
        <Typography variant="body3" sx={{ pl: 2, opacity: 0.7 }}>Các mục đã đánh dấu sẽ được hiển thị ở đây</Typography>
        {starredBoards?.starBoardIds?.map((board, index) => (
          <MenuItem key={index} sx={{ pl: 3 }} onClick={() => handleGoToBoardStarred(board)}>
            {starredBoards?.title?.[index]}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  )
}

export default Starred
