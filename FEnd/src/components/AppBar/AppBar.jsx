import { useState } from 'react'
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as TrelloIcon } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import WorkSpaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Template from './Menus/Template'
import Starred from './Menus/Starred'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Badge from '@mui/material/Badge'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import { Tooltip } from '@mui/material'
import Profiles from './Menus/Profiles'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useNavigate } from 'react-router-dom'
import MenuItem from '@mui/material/MenuItem'
import { useSelector } from 'react-redux'
import Menu from '@mui/material/Menu'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { markNotificationsAsRead } from '~/redux/features/authSlice'
import { createNewBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import Dialog from '@mui/material/Dialog'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import IconButton from '@mui/material/IconButton'

function AppBar({ searchValue, setSearchValue, starredBoards }) {
  const [boardData, setBoardData] = useState({
    title: '',
    visibility: 'private',
    description: 'de do chua biet lam gi'
  })
  const [anchorEl, setAnchorEl] = useState(null)
  const [hasNewNotification, setHasNewNotification] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const notifications = useSelector(state => state.auth.notifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    if (notifications.length > 0) {
      setHasNewNotification(true)
    } else {
      setHasNewNotification(false)
    }
  }, [notifications])

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
    setHasNewNotification(false)
    dispatch(markNotificationsAsRead())
  }

  const goToDashBoard = (event) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setBoardData({
      title: '',
      visibility: 'private',
      description: 'de do chua biet lam gi'
    })
  }

  const handleCreateNewBoard = async () => {
    if (boardData.title.length < 3) {
      toast.error('Tiêu đề bảng phải có ít nhất 3 ký tự')
      return
    }
    try {
      const newBoard = await createNewBoardAPI(boardData)
      handleCloseDialog()
      navigate(`/boards/${newBoard._id}`)
      toast.success('Tạo bảng mới thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo bảng')
    }
  }

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#A35C7A'),
      '&::-webkit-scrollbar-track': { m: 1 }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <AppsIcon sx={{ color: 'white' }} />
        <MenuItem onClick={goToDashBoard} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SvgIcon component={TrelloIcon} sx={{ color: 'white' }} />
          <Typography variant='span' sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>DW</Typography>
        </MenuItem>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1 }}>
          <WorkSpaces />
          <Recent />
          <Starred starredBoards={starredBoards} />
          <Template />
          <Button
            variant="outlined"
            endIcon={<AddCircleIcon />}
            sx={{
              color: 'white',
              border: 'none',
              '&:hover': { border: 'none', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
              backgroundColor: 'rgba(255, 255, 255, 0.1)'
            }}
            onClick={handleOpenDialog}
          >
            Tạo mới
          </Button>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          id="search 1"
          label="Search..."
          name="search 1"
          type="text"
          size="small"
          value={searchValue}
          onChange={(e) => { setSearchValue(e.target.value) }}
          autoComplete="off"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <CloseIcon
                  fontSize='small'
                  sx={{ color: searchValue ? 'white' : 'transparent', cursor: searchValue ? 'pointer' : 'null' }}
                  onClick={() => { setSearchValue('') }}
                />
              </InputAdornment>
            )
          }}
          sx={{
            minWidth: '120px',
            maxWidth: '180px',
            '& label': { color: 'white' },
            '& input': { color: 'white' },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <ModeSelect />
        <Box>
          <Tooltip title="Notifications">
            <Badge
              color="error"
              badgeContent={hasNewNotification ? notifications.length : 0}
              sx={{ cursor: 'pointer' }}
              onClick={handleClick}
              onClose={handleClose}
            >
              <NotificationsNoneIcon sx={{ color: 'white' }} />
            </Badge>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            PaperProps={{
              sx: {
                maxHeight: 300,
                width: '300px'
              }
            }}
          >
            {notifications.length > 0 ? (
              notifications.slice(0).map((notification, index) => (
                <MenuItem key={index} onClick={handleClose}>
                  <Typography sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
                    {notification.message}
                  </Typography>
                </MenuItem>
              ))
            ) : (
              <Typography sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', pt: 1 }}>No notifications</Typography>
            )}
          </Menu>
        </Box>

        {/**Dialog tạo bảng */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" mb={2}>Tạo bảng</Typography>
              <IconButton sx={{ '&:hover, &:focus, &:active': { background: 'transparent' }, mb: 2 }} onClick={handleCloseDialog} >
                <CloseIcon />
              </IconButton>
            </Box>
            {/* Background options */}

            <TextField
              fullWidth
              label="Tiêu đề bảng"
              required
              value={boardData.title}
              onChange={(e) => setBoardData({ ...boardData, title: e.target.value })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Quyền xem</InputLabel>
              <Select
                value={boardData.visibility}
                label="Quyền xem"
                onChange={(e) => setBoardData({ ...boardData, visibility: e.target.value })}
              >
                <MenuItem value="private">Private</MenuItem>
                <MenuItem value="public">Public</MenuItem>
              </Select>
            </FormControl>

            <Button
              variant="contained"
              fullWidth
              onClick={handleCreateNewBoard}
              disabled={!boardData.title}
            >
              Tạo mới
            </Button>
          </Box>
        </Dialog>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
