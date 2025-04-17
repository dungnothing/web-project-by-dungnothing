import { useState, useRef } from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { DialogContent, IconButton, Card as MuiCard, Menu, Avatar } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Checkbox from '@mui/material/Checkbox'
import Box from '@mui/material/Box'
import { leaveCardAPI, updateCardAPI } from '~/apis'
import { useEffect } from 'react'
import EditIcon from '@mui/icons-material/Edit'
import Dialog from '@mui/material/Dialog'
import TextField from '@mui/material/TextField'
import DialogTitle from '@mui/material/DialogTitle'
import EditNoteIcon from '@mui/icons-material/EditNote'
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import ImageIcon from '@mui/icons-material/Image'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import CloseIcon from '@mui/icons-material/Close'
import dayjs from 'dayjs'
import { updateCancelCardAPI } from '~/apis'
import { updateCardBackgroundAPI } from '~/apis'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { toast } from 'react-toastify'
import { TimePicker } from '@mui/x-date-pickers'
import { renderTimeViewClock } from '@mui/x-date-pickers/timeViewRenderers'
import { joinCardAPI } from '~/apis'
import { useSelector } from 'react-redux'
import PersonRemoveIcon from '@mui/icons-material/PersonRemove'
import { getMemberAPI } from '~/apis'

function Card({ card, boardState, setDataIsChange }) {
  const user = useSelector(state => state.auth.user)
  const [hover, setHover] = useState(false)
  const [isDone, setIsDone] = useState(card?.isDone)
  const [openTimeDialog, setOpenTimeDialog] = useState(false)
  const [time, setTime] = useState(card?.endTime || '')
  const [isExpired, setIsExpired] = useState(false)
  const [isEditting, setIsEditting] = useState(false)
  const [descriptionEdit, setDescriptionEdit] = useState(card?.description || '')
  const [afterDescription, setAfterDescription] = useState(descriptionEdit)
  const [cardBackground, setCardBackground] = useState(card?.background || '')
  const [anchorEl, setAnchorEl] = useState(null)
  const fileInputRef = useRef(null)
  const open = Boolean(anchorEl)

  // Quản lý member
  const [memberInCard, setMemberInCard] = useState([])

  const handleGetMember = async () => {
    try {
      const members = await getMemberAPI(card._id)
      setMemberInCard(members)
    } catch (error) {
      toast.error('Lỗi lấy thành viên!')
    }
  }

  // call useEffect mỗi khi cần đổi dữ liệu
  useEffect(() => {
    setIsDone(card?.isDone)
    setTime(card?.endTime)
    // setIsExpired()
    setCardBackground(card?.background)
  }, [card])

  useEffect(() => {
    if (time) {
      const currentTime = new Date().getTime()
      const endTime = new Date(time).getTime()
      setIsExpired(currentTime > endTime)
    }
  }, [time])

  // Sap xep card
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #f1c40f' : undefined
  }

  const shouldShowCardActions = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  // Edit card description
  const handleEditting = () => {
    setIsEditting(true)
  }

  const handleCloseEditting = () => {
    setIsEditting(false)
  }

  const handleEditDescription = (event) => {
    setDescriptionEdit(event.target.value)
  }

  const handleChangeDescription = async () => {
    try {
      if (!card?._id) {
        toast.error('Lỗi: Không tìm thấy cardId')
        return
      }
      const newDescription = descriptionEdit.trim() === '' ? '' : descriptionEdit

      const formData = { cardId: card._id, description: newDescription }
      await updateCardAPI(card._id, formData)
      setAfterDescription(descriptionEdit)
      setIsEditting(false)
    } catch (error) {
      toast.error('Loi roi')
    }
  }

  // Set card da hoan thanh hay chua
  const handleOnChange = async () => {
    try {
      if (!card?._id) {
        toast.error('Lỗi: Không tìm thấy cardId')
        return
      }
      const newStatus = !isDone
      // Cập nhật UI ngay lập tức
      setIsDone(newStatus)
      // Gửi request lên server để lưu thay đổi
      const formData = { cardId: card._id, isDone: newStatus }
      await updateCardAPI(card._id, formData)
    } catch (error) {
      toast.error('Đổi nội dung thất bại')
    }
  }

  // Dialog eidt card
  const [openDialog, setOpenDialog] = useState(false)
  const handleOpenDialog = () => {
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    // setHover(false)
  }

  // Dialog edit time
  const handleOpenTimeDialog = () => {
    setOpenTimeDialog(true)
  }

  const handleCloseTimeDialog = () => {
    setOpenTimeDialog(false)
  }

  const handleUpdateEndTime = async () => {
    try {
      if (!time) {
        toast.error('Vui lòng chọn ngày hợp lệ')
        return
      }
      const formData = { cardId: card._id, endTime: time.toISOString() }
      await updateCardAPI(card._id, formData)
      setOpenTimeDialog(false)
      setDataIsChange(true)
    } catch (error) {
      toast.error('Lỗi rồi bro')
    }
  }

  const handleCancelEndTime = async () => {
    try {
      const timeEC = null
      const formData = { cardId: card._id, endTime: timeEC }
      setTime(timeEC)
      await updateCancelCardAPI(card._id, formData)
      setOpenTimeDialog(false)
      setDataIsChange(true)
    }
    catch (error) {
      toast.error('Lỗi rồi bro')
    }
  }

  const timeShow = new Date(time).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })

  // Upload background
  const handleUploadClick = () => {
    fileInputRef.current.click()
  }

  const handleChangeCardBackground = async (event) => {
    try {
      const file = event.target.files[0]
      const formData = new FormData()
      formData.append('cardBackground', file)
      const response = await updateCardBackgroundAPI(card._id, formData)
      setCardBackground(response.background)
      setDataIsChange(true)
    } catch (error) {
      toast.error('Lỗi rồi bro')
    }
  }

  // Join, leave member card
  const handleJoinCard = async () => {
    try {
      if (card.memberIds.includes(user.userId)) {
        await leaveCardAPI(card._id)
        setDataIsChange(true)
      } else {
        await joinCardAPI(card._id)
        setDataIsChange(true)
      }
    } catch (error) {
      toast.error('deu on roi')
    }
  }

  const handleShowMemberClick = (event) => {
    setAnchorEl(event.currentTarget)
    handleGetMember()
  }

  const handleShowMemberClose = () => {
    setAnchorEl(null)
  }


  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyles}
      {...attributes}
      {...(boardState === 'close' ? {} : listeners)}
      sx={{
        cursor: boardState === 'close' ? 'default' : 'pointer',
        boxShadow: '0 1px 1px  rgba(0, 0, 0, 0.2)',
        opacity: card.FE_PlaceholderCard ? '0' : '1',
        minWidth: card.FE_PlaceholderCard ? '280px' : 'unset',
        pointerEvents: card.FE_PlaceholderCard ? 'none' : 'unset',
        position: card.FE_PlaceholderCard ? 'fixed' : 'unset',
        border: '#A9B5DF',
        '&:hover': { borderColor: (theme) => theme.palette.primary.main }
      }}
      onMouseEnter={() => !isDragging && setHover(true)}
      onMouseLeave={() => !isDragging && setHover(false)}
    >
      {cardBackground && <CardMedia sx={{ height: 140 }} image={cardBackground} />}
      <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', maxHeight: '20px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            {(hover || isDone) && (
              <Checkbox
                checked={isDone}
                inputProps={{ 'aria-label': 'controlled' }}
                onChange={handleOnChange}
                size="small"
                sx={{
                  color: '#5CB338',
                  '&.Mui-checked': {
                    color: '#5CB338'
                  }
                }}
              />
            )}
            <Typography>{card?.title}</Typography>
          </Box>
          {hover && (
            <Button
              onClick={handleOpenDialog}
              draggable={true}
              sx={{ minWidth: '30px', padding: '4px', ml: 1 }}
            >
              <EditIcon fontSize="small" />
            </Button>
          )}
        </Box>
        {time && (
          <Typography sx={{ pt: 2, opacity: 0.8, fontSize: '12px', color: isExpired ? 'red' : 'green' }}>
            {timeShow}
          </Typography>
        )}
      </CardContent>
      {/**Dialoag card */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth={false} // Tắt giới hạn maxWidth mặc định
        PaperProps={{ sx: { width: '700px', maxWidth: '90vw', maxHeight: '500px', height: '600px' } }} // Custom width
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle sx={{ pb: 0, pl: 5 }}>{card?.title}</DialogTitle>
          <IconButton sx={{ '&:hover, &:focus, &:active': { background: 'transparent' }, pr: 2, pt: 2 }} onClick={handleCloseDialog} >
            <CloseIcon />
          </IconButton>
        </Box>
        {time && (
          <Typography sx={{ pl: 5, opacity: 0.5 }}>
            Thời gian: {new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(time).toLocaleDateString()}
          </Typography>
        )}
        {time && (
          <Typography sx={{ pl: 5, opacity: 0.5, color: isExpired ? 'red' : 'green' }}>
            {isExpired
              ? 'Đã hết hạn'
              : `Đến hạn lúc ${new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(time).toLocaleDateString()}`
            }
          </Typography>
        )}
        {/* Card content */}
        <DialogContent sx={{ p: 1, pt: 5 }}>
          {/* Mô tả */}
          <Box sx={{ display: 'flex' }}>
            <Box sx={{ minWidth: '500px' }}>
              <Box sx={{ display: 'flex' }}>
                <EditNoteIcon />
                <Typography sx={{ pl: 1 }}>Mô tả</Typography>
              </Box>
              {descriptionEdit && (
                <Typography sx={{ pl: 4, pt: 1, pb: 1 }}>{afterDescription}</Typography>
              )}
              <TextField
                fullWidth
                placeholder="Thêm mô tả chi tiết hơn..."
                variant="outlined"
                size="small"
                multiline
                rows={isEditting ? 4 : 2}
                sx={{ pl: 4 }}
                value={descriptionEdit}
                onClick={handleEditting}
                onChange={handleEditDescription}
              />
              {isEditting && (
                <Box sx={{ display: 'flex', p: 1, pl: 4, m: 'auto' }}>
                  <Button onClick={handleChangeDescription} size="small" variant='contained' sx={{ p: 0, width: '21px', height: '32px' }}>Lưu</Button>
                  <Button onClick={handleCloseEditting} variant='outlined' sx={{ p: 0, width: '21px', height: '32px', ml: 1 }}>Hủy</Button>
                </Box>
              )}
              {/**Còm men */}
              <Box sx={{ pt: 5 }}>
                <Box sx={{ display: 'flex' }}>
                  <AutoAwesomeMosaicIcon />
                  <Typography sx={{ pl: 1 }}>Hoạt động</Typography>
                </Box>
                <TextField
                  fullWidth
                  placeholder="Viết bình luận..."
                  variant="outlined"
                  size="small"
                  sx={{ pl: 4 }}
                />
              </Box>
            </Box>
            {/**Thanh thao tác */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 1, alignItems: 'center', justifyContent: 'center', width: '100%' }}>
              <Button
                startIcon={card?.memberIds?.includes(user.userId) ? <PersonRemoveIcon /> : <PersonAddIcon />}
                fullWidth
                sx={{
                  bgcolor: '#EEF1FF',
                  color: '#1E293B',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: '#EEF1FF'
                  }
                }}
                onClick={handleJoinCard}
              >
                {card?.memberIds?.includes(user.userId) ? 'Rời đi' : 'Tham gia'}
              </Button>

              {/**Menu member */}
              <Button
                startIcon={<GroupIcon />}
                fullWidth
                id="menu-member-button"
                aria-controls={open ? 'dmenu-member' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleShowMemberClick}
                sx={{
                  bgcolor: '#EEF1FF',
                  color: '#1E293B',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: '#EEF1FF'
                  }
                }}>
                Thành viên
              </Button>
              <Menu
                id="menu-member"
                aria-labelledby="menu-member"
                anchorEl={anchorEl}
                open={open}
                onClose={handleShowMemberClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                sx={{ mt: '8px' }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ p: 1, pl: 2 }}>Thành viên</Typography>
                  <IconButton onClick={() => { setAnchorEl(false) }} sx={{ p: 0, mr: 1 }} >
                    <CloseIcon />
                  </IconButton>
                </Box>
                {memberInCard?.members?.map((member, index) => (
                  <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 2, p: 1, minWidth: '200px', maxHeight: '400px' }}>
                    <Avatar alt={member.memberName} src={member.memberAvatar || ''} />
                    <Typography>{member.memberName}</Typography>
                  </Box>
                ))}
              </Menu>

              <Button
                onClick={handleOpenTimeDialog}
                startIcon={<AccessTimeIcon />}
                fullWidth
                sx={{
                  bgcolor: '#EEF1FF',
                  color: '#1E293B',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: '#EEF1FF'
                  }
                }}
              >
                Thời gian
              </Button>
              <Button
                startIcon={<AttachFileIcon />}
                fullWidth
                sx={{
                  bgcolor: '#EEF1FF',
                  color: '#1E293B',
                  p: 1.5,
                  '&:hover': {
                    bgcolor: '#EEF1FF'
                  }
                }}
              >
                Đính kèm
              </Button>
              <Box >
                <Button
                  startIcon={<ImageIcon />}
                  fullWidth
                  sx={{
                    bgcolor: '#EEF1FF',
                    color: '#1E293B',
                    width: '170px',
                    p: 1.5,
                    '&:hover': {
                      bgcolor: '#EEF1FF'
                    }
                  }}
                  onClick={handleUploadClick}
                >
                  Ảnh bìa
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleChangeCardBackground}
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
      {/**Dialog Time edit */}
      <Dialog
        open={openTimeDialog} onClose={handleCloseTimeDialog} maxWidth="xs" fullWidth
        onMouseDown={(e) => e.stopPropagation()} onTouchStart={(e) => e.stopPropagation()}
        sx={{ bottom: '20vh', margin: 'auto' }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <DialogTitle>Chọn thời gian</DialogTitle>
          <IconButton sx={{ '&:hover, &:focus, &:active': { background: 'transparent' }, p: 2 }} onClick={handleCloseTimeDialog} >
            <CloseIcon />
          </IconButton>
        </Box>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
          {/* <DateCalendar />
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ p: 1 }}>Ngày bắt đầu</Typography>
            <DatePicker sx={{ p: 1 }} label="Ngày bắt đầu" defaultValue={dayjs()} />
          </Box> */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ p: 1 }}>Giờ hết hạn</Typography>
            <TimePicker
              sx={{ p: 1, pl: '20px' }} value={time ? dayjs(time) : null} onChange={(newTime) => setTime(newTime ? newTime.toDate() : null)}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ p: 1 }}>Ngày hết hạn</Typography>
            <DatePicker sx={{ p: 1 }} value={time ? dayjs(time) : null} onChange={(newTime) => setTime(newTime ? newTime.toDate() : null)} />
          </Box>
          <Box sx={{ display: 'flex' }}>
            <Button onClick={handleUpdateEndTime} variant='contained' sx={{ p: 1, display: 'flex', justifyContent: 'center', margin: 'auto' }}>Lưu</Button>
            <Button onClick={handleCancelEndTime} variant='outlined' sx={{ p: 1, display: 'flex', justifyContent: 'center', margin: 'auto' }}>Hủy lịch</Button>
          </Box>
        </DialogContent>
      </Dialog>
      {
        shouldShowCardActions() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && (
              <Button size='small' startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size='small' startIcon={<CommentIcon />}>
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button size='small' startIcon={<AttachmentIcon />}>
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )
      }
    </MuiCard >
  )
}

export default Card
