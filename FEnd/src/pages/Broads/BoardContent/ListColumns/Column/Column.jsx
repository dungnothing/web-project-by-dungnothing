import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ContentCut from '@mui/icons-material/ContentCut'
import Cloud from '@mui/icons-material/Cloud'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import ContentPasteIcon from '@mui/icons-material/ContentPaste'
import AddCardIcon from '@mui/icons-material/AddCard'
import Button from '@mui/material/Button'
import DragHandleIcon from '@mui/icons-material/DragHandle'
import ListCards from './ListCards/ListCards'
import theme from '~/theme'
import { useState } from 'react'
import TextField from '@mui/material/TextField'
import CloseIcon from '@mui/icons-material/Close'
import { toast } from 'react-toastify'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useConfirm } from 'material-ui-confirm'


function Column({ column, createNewCard, deleteColumnDetails, boardState, filters, setDataIsChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: column._id,
    data: { ...column }
  })

  const dndKitColumnStyless = {
    /**
     * Su dung CSS.Tranform se sinh ra bug bang bi keo dai va xau
     * https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512
     */
    // touchAction: 'none', // Danh cho sensor default dang PointerSensor
    transform: CSS.Translate.toString(transform),
    transition,
    // height max 100% boi vi neu khong thi se co loi column ngan thi phai keo tu phan giua, them do la {...listeners} trong box chu khong phai trong div
    height: '100%',
    opacity: isDragging ? 0.5 : undefined
  }

  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => setAnchorEl(event.currentTarget)
  const handleClose = () => setAnchorEl(null)

  const orderedCards = column.cards
  const [openNewCardForm, setOpenNewCardForm] = useState(false)
  const [newCardTitle, setNewCardTitle] = useState('')
  const toggleOpenNewCardForm = () => setOpenNewCardForm(!openNewCardForm)

  // Hàm tạo card
  const addNewCard = () => {
    if (!newCardTitle) {
      toast.error('Không được để trống')
      return
    }
    // Goi API o day
    // Tao du lieu Card goi API
    const newCardData = {
      title: newCardTitle,
      columnId: column._id
    }
    // Gọi-lên-props-function-createNewCard nằm ở component-cha-cao-nhất- (boards/_id.jsx)
    createNewCard(newCardData)

    // Dong trang thai them Card moi va clear input
    toggleOpenNewCardForm()
    setNewCardTitle('')
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      addNewCard()
    }
  }

  // Xu li xoa mot column va card ben trong no
  const confirmDeleteColumn = useConfirm()
  const handleDeleteColumn = () => {
    confirmDeleteColumn({
      title: 'Xóa cột',
      description: 'Bạn có chắc muốn xóa chứ',
      // content: 'Xóa không anh ơi',
      confirmationText: 'Xóa',
      cancellationText: 'Hủy'

      // allowClose: false,
      // dialogProps: { maxWidth: 'xs' },
      // confirmationButtonProps: { color: 'secondary', variant: 'outlined' },
      // cancellationButtonProps: { color:'inherit' },

      // Con nhieu tinh nang muon thi tu tim hieu
    }).then(() => {
      // Goi len props function deleteColumnDetails nam o component cha cao nhat (boards/_id.jsx)
      deleteColumnDetails(column._id)
    }).catch(() => { })
  }

  return (
    <div ref={setNodeRef} style={dndKitColumnStyless} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: '300px',
          maxWidth: '300px',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : '#ebecf0'),
          ml: 2,
          borderRadius: '6px',
          height: 'fit-content',
          maxHeight: (theme) => `calc(${theme.trello.boardContentHeight} - ${theme.spacing(5)})`
        }}
      >
        {/* Box Column Header */}
        <Box sx={{
          height: theme.trello.columnHeaderHeight,
          p: 2,
          alignItems: 'center',
          display: 'flex',
          justifyContent: 'space-between'
        }}>
          <Typography variant='h6' sx={{
            fontSize: '1rem',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            {column?.title}
          </Typography>
          {boardState === 'open' && (
            <Box>
              <Tooltip title="More options">
                <ExpandMoreIcon

                  sx={{ color: 'text.primay', cursor: 'pointer' }}
                  id="demo-positioned-dropdown"
                  aria-controls={open ? 'demo-positioned-dropdown' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              </Tooltip>
              <Menu
                id="demo-positioned-dropdown"
                aria-labelledby="demo-positioned-dropdown"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
              >
                <MenuItem
                  onClick={toggleOpenNewCardForm}
                  sx={{
                    '&:hover': { color: 'success.light', '& .add-card-icon': { color: 'success.light' } }
                  }}
                >
                  <ListItemIcon><AddCardIcon className='add-card-icon' fontSize="small" /></ListItemIcon>
                  <ListItemText>Add new card</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><ContentCut fontSize="small" /></ListItemIcon>
                  <ListItemText>Cut</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><ContentCopyIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Copy</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><ContentPasteIcon fontSize="small" /></ListItemIcon>
                  <ListItemText>Paste</ListItemText>
                </MenuItem>

                <Divider />
                <MenuItem
                  onClick={handleDeleteColumn}
                  sx={{
                    '&:hover': { color: 'warning.dark', '& .delete-forever-icon': { color: 'warning.dark' } }
                  }}
                >
                  <ListItemIcon><DeleteForeverIcon className='delete-forever-icon' fontSize="small" /></ListItemIcon>
                  <ListItemText>Delete column</ListItemText>
                </MenuItem>
                <MenuItem>
                  <ListItemIcon><Cloud fontSize="small" /></ListItemIcon>
                  <ListItemText>Archive this column</ListItemText>
                </MenuItem>
              </Menu>
            </Box>
          )}
        </Box>


        {/* List Card */}
        <ListCards cards={orderedCards} boardState={boardState} filters={filters} setDataIsChange={setDataIsChange} />

        {/* Box Column Footer */}
        {boardState === 'open' && (
          <Box sx={{
            height: theme.trello.columnFooterHeight,
            p: 2
          }}>
            {!openNewCardForm
              ? <Box sx={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Button startIcon={<AddCardIcon />} onClick={toggleOpenNewCardForm}>Add new card</Button>
                <Tooltip title="Drag to move">
                  <DragHandleIcon sx={{ cursor: 'pointer' }} />
                </Tooltip>
              </Box>
              : <Box sx={{
                display: 'flex',
                height: '100%',
                alignItems: 'center',
                gap: '1'
              }}>
                <TextField
                  label="Enter card title..."
                  type="text"
                  size="small"
                  variant='outlined'
                  autoFocus
                  data-no-dnd='true'
                  value={newCardTitle}
                  onKeyDown={handleKeyDown}
                  onChange={(e) => { setNewCardTitle(e.target.value) }}
                  sx={{
                    '& label': { color: 'text.primary' },
                    '& input': {
                      color: (theme) => theme.palette.primary.main,
                      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#333643' : 'white')
                    },
                    '& label.Mui-focused': { color: (theme) => theme.palette.primary.main },
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&:hover fieldset': { borderColor: (theme) => theme.palette.primary.main },
                      '&.Mui-focused fieldset': { borderColor: (theme) => theme.palette.primary.main }
                    },
                    '& .MuiOutlinedInput-input': {
                      borderRadius: 1
                    }
                  }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant='contained' color='success' size='small'
                    onClick={addNewCard}
                    sx={{
                      boxShadow: 'none',
                      border: '0.5px solid',
                      borderColor: (theme) => theme.palette.success.main,
                      '&:hover': { bgcolor: (theme) => theme.palette.success.main },
                      marginLeft: 1
                    }}
                  >
                    Add
                  </Button>
                  <CloseIcon
                    fontSize='small'
                    sx={{ color: (theme) => theme.palette.warning.light, cursor: 'pointer' }}
                    onClick={toggleOpenNewCardForm}
                  />
                </Box>
              </Box>
            }

          </Box>
        )}
      </Box>
    </div>
  )
}

export default Column
