import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import FilterListIcon from '@mui/icons-material/FilterList'
import Avatar from '@mui/material/Avatar'
import AvatarGroup from '@mui/material/AvatarGroup'
import { Tooltip, MenuItem } from '@mui/material'
import Button from '@mui/material/Button'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import { updateBoardTitleAPI } from '~/apis'
import { useState } from 'react'
import { toast } from 'react-toastify'
import TextField from '@mui/material/TextField'
import LockIcon from '@mui/icons-material/Lock'
import PublicIcon from '@mui/icons-material/Public'
import Menu from '@mui/material/Menu'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import DoneIcon from '@mui/icons-material/Done'
import { updateBoardVisibilityAPI } from '~/apis'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import ClearIcon from '@mui/icons-material/Clear'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import { updateBoardStateAPI } from '~/apis'
import { deleteBoardAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { addMemberToBoardAPI } from '~/apis'
import { useConfirm } from 'material-ui-confirm'

const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  borderRadius: '4px',
  '.MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}

function BoardBar({ board, onUpdateTitle, onFilterChange, boardState, setBoardState, allUserInBoard, getAllUserInBoard }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(board?.title)
  const [isPrivate, setIsPrivate] = useState(board?.visibility === 'private')
  const [openInviteDialog, setOpenInviteDialog] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElMore, setAnchorElMore] = useState(null)
  const [filterAnchorEl, setFilterAnchorEl] = useState(null)
  const [filters, setFilters] = useState({
    keyword: '',
    overdue: false,
    dueTomorrow: false,
    haveDue: false
  })
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  {/** Filters */ }
  const handleFilterClick = (event) => {
    setFilterAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setFilterAnchorEl(null)
  }

  const handleKeywordChange = (event) => {
    const newValue = event.target.value
    setFilters(prev => ({ ...prev, keyword: newValue }))
    onFilterChange('keyword', newValue)
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    setFilters(prev => ({ ...prev, [name]: checked }))
    onFilterChange(name, checked)
  }

  const handleClearFilters = () => {
    setFilters({
      keyword: '',
      overdue: false,
      dueTomorrow: false,
      haveDue: false
    })
    onFilterChange('keyword', '')
    onFilterChange('overdue', false)
    onFilterChange('dueTomorrow', false)
    onFilterChange('noDate', false)
    handleFilterClose()
  }

  const hasActiveFilters = () => {
    return filters.keyword ||
      filters.overdue ||
      filters.dueTomorrow ||
      filters.haveDue
  }


  {/** Title */ }
  const handleTitleClick = () => {
    setIsEditing(true)
  }

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value)
  }

  const handleTitleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      try {
        await updateBoardTitleAPI(board._id, { title: editedTitle })
        onUpdateTitle(editedTitle) // Thêm dòng này để cập nhật state ở component cha
        setIsEditing(false)
        e.target.blur()
      } catch (error) {
        setEditedTitle(board?.title) // Reset về title cũ nếu có lỗi
        setIsEditing(false)
        if (error.response && error.response.data && error.response.data.message) {
          toast.error(`${error.response.data.message}`)
        } else {
          toast.error('Lỗi khi cập nhật tên bảng')
        }
        e.target.blur()
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false)
      setEditedTitle(board?.title)
    }
  }

  const handleTitleBlur = () => {
    setIsEditing(false)
    setEditedTitle(board?.title) // Reset to original title
  }

  {/** Nội dung bảng là public hay private */ }
  const handleVisibilityChange = async (isPrivateValue) => {
    try {
      await updateBoardVisibilityAPI(board._id, { visibility: isPrivateValue ? 'private' : 'public' })
      setIsPrivate(isPrivateValue)
      toast.success('Cập nhật trạng thái bảng thành công')
      handleClose()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error.response.data.message}`)
      } else {
        toast.error('Lỗi khi cập nhật trạng thái bảng')
      }
    }
  }

  {/** Đóng đóng hay mở bảng*/ }
  const handleClickMore = (event) => {
    setAnchorElMore(event.currentTarget)
  }

  const handleCloseMore = () => {
    setAnchorElMore(null)
  }

  const handleChangStateBoard = async () => {
    try {
      const newBoardState = boardState === 'open' ? 'close' : 'open'
      await updateBoardStateAPI(board._id, { boardState: newBoardState })
      setBoardState(newBoardState)
      toast.success('Cập nhật trạng thái bảng thành công')
      handleCloseMore()
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error.response.data.message}`)
      } else {
        toast.error('Lỗi khi cập nhật trạng thái bảng')
      }
    }
  }

  {/** Xóa bảng */ }
  const handleDeleteBoard = async () => {
    try {
      await deleteBoardAPI(board._id)
      toast.success('Xóa bảng thành công')
      navigate('/dashboard')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error.response.data.message}`)
      } else {
        toast.error('Lỗi khi xóa bảng')
      }
    }
  }

  {/** Quản lý thành viên */ }
  const [inviteEmail, setInviteEmail] = useState('')
  const handleInvite = async () => {
    try {
      await addMemberToBoardAPI(board._id, { email: inviteEmail })
      await getAllUserInBoard()
      toast.success('Mời thành viên thành công')
      setInviteEmail('')
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`${error.response.data.message}`)
      } else {
        toast.error('Lỗi khi mời thành viên')
      }
    }
  }

  {/**Xóa bảng */ }
  const confirmDeleteBoard = useConfirm()
  const handleConfirmDeleteBoard= () => {
    confirmDeleteBoard({
      title: 'Xóa bảng',
      description: (
        <span>
          Bạn có chắc muốn xóa bảng{' '}
          <span style={{ fontFamily: 'cursive', fontStyle: 'italic', color: 'purple' }}>
            {board?.title}
          </span>{' '}
          chứ?
        </span>
      ),
      confirmationText: 'Xóa',
      cancellationText: 'Hủy'
    }).then(() => {
      handleDeleteBoard()
    }).catch(() => { })
  }

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',

      justifyContent: 'space-between',
      gap: 1,
      paddingX: 1,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#C890A7'),
      '&::-webkit-scrollbar-track': { m: 1 }
    }}>
      {/** Bên trái */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Box sx={{ pl: 1 }}>
          <Chip
            sx={{
              ...MENU_STYLES,
              '& .MuiChip-label': {
                fontSize: '1.2rem'
              }
            }}
            label={
              isEditing ? (
                <TextField
                  value={editedTitle}
                  onChange={handleTitleChange}
                  onKeyDown={handleTitleKeyDown}
                  onBlur={handleTitleBlur}
                  autoFocus
                  size="medium"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      fontSize: '1.2rem',
                      '& fieldset': { borderColor: 'white' },
                      '&:hover fieldset': { borderColor: 'white' },
                      '&.Mui-focused fieldset': { borderColor: 'white' }
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: '2px 8px',
                      color: 'white'
                    }
                  }}
                />
              ) : (
                board?.title
              )
            }
            onClick={handleTitleClick}
            clickable
          />
          <Button
            sx={{ color: 'white' }}
            onClick={handleClick}
          >
            {isPrivate ? <LockIcon /> : <PublicIcon />}
          </Button>
          <Menu
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
            <Box sx={{ width: '400px' }} >
              <MenuItem onClick={() => handleVisibilityChange(false)} sx={{ whiteSpace: 'normal' }} >
                <Box>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <PublicIcon fontSize="small" />
                    <ListItemText sx={{ marginLeft: '10px' }}>Public</ListItemText>
                    {!isPrivate && <DoneIcon fontSize="small" />}
                  </Box>
                  <Box>
                    <Typography>Bất kì ai sử dụng web này đều có thể nhìn thấy. Chỉ thành viên trong nhóm mới có thể chỉnh sửa</Typography>
                  </Box>
                </Box>
              </MenuItem>
              <MenuItem onClick={() => handleVisibilityChange(true)} sx={{ whiteSpace: 'normal' }} >
                <Box>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
                    <LockIcon fontSize="small" />
                    <ListItemText sx={{ marginLeft: '10px' }}>Private</ListItemText>
                    {isPrivate && <DoneIcon fontSize="small" />}
                  </Box>
                  <Box>
                    <Typography>Chỉ thành viên của bảng này mới được xem. Chủ bảng có thể tắt chỉnh sửa thông tin và thêm xóa thành viên</Typography>
                  </Box>
                </Box>
              </MenuItem>
            </Box>
          </Menu>
        </Box>
        <Box>
          <Chip
            sx={MENU_STYLES}
            icon={<AddToDriveIcon />}
            label="Thêm vào Google Drive"
            clickable
          />
        </Box>
      </Box>

      {/** Bên phải */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        {/*  Filter */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Chip
            sx={MENU_STYLES}
            icon={<FilterListIcon />}
            label="Lọc"
            clickable
            onClick={handleFilterClick}
          />
          {hasActiveFilters() && (
            <Tooltip title="Clear all filters">
              <Chip
                sx={{
                  ...MENU_STYLES,
                  ml: 0.5,
                  minWidth: 'unset',
                  '&:hover': {
                    bgcolor: 'transparent'
                  }
                }}
                icon={<ClearIcon />}
                clickable

                onClick={handleClearFilters}
              />
            </Tooltip>
          )}
          <Menu
            anchorEl={filterAnchorEl}
            open={Boolean(filterAnchorEl)}
            onClose={handleFilterClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
          >
            <Box sx={{ width: '280px', p: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 2 }}>Từ khóa</Typography>
              <TextField
                fullWidth
                size="small"
                name="keyword"
                onChange={handleKeywordChange}
                placeholder="Nhập từ khóa..."
                sx={{ mb: 2 }}
              />
              <Typography variant="subtitle1" sx={{ mb: 1 }}>Ngày hết hạn</Typography>
              <Box sx={{ ml: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="overdue"
                      onChange={handleCheckboxChange}
                      size="small"
                    />
                  }
                  label="Quá hạn"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="dueTomorrow"
                      onChange={handleCheckboxChange}
                      size="small"
                    />
                  }
                  label="Sẽ hết hạn vào ngày mai"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      name="noDate"
                      onChange={handleCheckboxChange}
                      size="small"
                    />
                  }
                  label="Không có ngày hết hạn"
                />
              </Box>
            </Box>
          </Menu>
        </Box>
        {/*  Invite */}
        <Button
          variant="outlined"
          startIcon={<PersonAddIcon />}
          sx={{
            color: 'white',
            borderColor: 'white',
            '&:hover': { borderColor: 'white' }
          }}
          onClick={() => setOpenInviteDialog(true)}
        >
          Mời
        </Button>
        <Dialog
          open={openInviteDialog}
          onClose={() => setOpenInviteDialog(false)}
          sx={{
            '& .MuiDialog-paper': {
              width: '600px',
              height: '300px'
            }
          }}
        >
          <DialogTitle sx={{ pb: 0 }}>Mời thêm các thành viên vô bảng để coi xem như lào</DialogTitle>
          <Box>
            <DialogContent sx={{ display: 'flex', gap: 1 }}>
              <TextField
                fullWidth
                label="Email"
                placeholder="Nhập email"
                variant="outlined"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <Button onClick={handleInvite} sx={{ bgcolor: '#A1E3F9', color: 'black', '&:hover': { bgcolor: '#A1E3F9' } }}>Mời</Button>
            </DialogContent>
          </Box>
          <DialogTitle sx={{ pt: 0 }}>Thành viên</DialogTitle>
          <Box sx={{ maxHeight: '200px', overflowY: 'auto', px: 3 }}>
            {/* Hiển thị admin nếu có */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar alt={allUserInBoard.admin.adminName} src={allUserInBoard.admin.adminAvatar || ''} />
              <Typography>{allUserInBoard.admin.adminName} (Admin)</Typography>
            </Box>

            {/* Hiển thị danh sách members */}
            {allUserInBoard.members.map((user, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Avatar alt={user.memberName} src={user.memberAvatar || ''} />
                <Typography>{user.memberName}</Typography>
              </Box>
            ))}
          </Box>
        </Dialog>

        {/*  Avatar */}
        <AvatarGroup
          max={5}
          sx={{
            gap: '3px',
            '& .MuiAvatar-root': {
              width: '34px',
              height: '34px',
              fontSize: '16px',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              '&:first-of-type': { bgcolor: '#686de0' }
            }
          }}
        >
          <Tooltip title={allUserInBoard.admin.adminName}>
            <Avatar alt={allUserInBoard.admin.adminName} src={allUserInBoard.admin.adminAvatar} />
          </Tooltip>
          {allUserInBoard.members.map((user, index) => (
            <Tooltip title={user.memberName} key={index}>
              <Avatar alt={user.memberName} src={user.memberAvatar} />
            </Tooltip>
          ))}
        </AvatarGroup>
        {/*  Nút more thêm tính năng đóng mở bảng và xóa bảng */}
        <Box>
          <MoreVertIcon sx={{ color: 'white', cursor: 'pointer' }} onClick={handleClickMore} />
          <Menu
            anchorEl={anchorElMore}
            open={Boolean(anchorElMore)}
            onClose={handleCloseMore}
          >
            <MenuItem onClick={handleChangStateBoard}>
              {boardState === 'open' ? 'Đóng cửa trái tim' : 'Mở cửa trái tim'}
            </MenuItem>
            <MenuItem onClick={handleConfirmDeleteBoard}>Xóa bảng</MenuItem>
          </Menu>
        </Box>
      </Box>
    </Box>
  )
}


export default BoardBar
