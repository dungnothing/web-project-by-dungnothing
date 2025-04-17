import { Box, Typography, Grid, Card, CardContent, Button, Avatar, MenuItem, IconButton } from '@mui/material'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAccessibleBoardsAPI, createNewBoardAPI } from '~/apis'
import { toast } from 'react-toastify'
import CircularProgress from '@mui/material/CircularProgress'
import { useSelector } from 'react-redux'
import { Dialog, TextField, FormControl, InputLabel, Select } from '@mui/material'
import StarIcon from '@mui/icons-material/Star'
import StarOutlineIcon from '@mui/icons-material/StarOutline'
import { getStarBoardAPI } from '~/apis'
import { addStarBoardAPI, removeStarBoardAPI } from '~/apis'
import CloseIcon from '@mui/icons-material/Close'


function MainBoard({ searchValue, starredBoards, setStarredBoards }) {
  const [boards, setBoards] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useSelector(state => state.auth)
  const [openCreateDialog, setOpenCreateDialog] = useState(false)
  const [newBoardData, setNewBoardData] = useState({
    title: '',
    visibility: 'private',
    description: 'de do chua biet lam gi'
  })
  const navigate = useNavigate()

  useEffect(() => {
    if (!user?.accessToken) {
      setIsLoading(false)
      setBoards([])
      setStarredBoards({ title: [], starBoardIds: [] })
      return
    }
    const loadBoards = async () => {
      try {
        if (!user?.accessToken) {
          return
        }
        const boardsData = await getAllAccessibleBoardsAPI()
        const starBoardIds = await getStarBoardAPI()
        setStarredBoards(starBoardIds)
        setBoards(sortBoards(boardsData, starBoardIds))
      } catch (error) {
        toast.error('Không thể tải danh sách bảng')
        setBoards([])
      } finally {
        setIsLoading(false)
      }
    }

    loadBoards()
  }, [user?.accessToken, setStarredBoards])

  // Star board
  useEffect(() => {
    setBoards(prevBoards => sortBoards(prevBoards, starredBoards))
  }, [starredBoards])

  const sortBoards = (boardsData, starBoardIds) => {
    return [...boardsData].sort((a, b) =>
      starBoardIds.starBoardIds.includes(b._id) - starBoardIds.starBoardIds.includes(a._id)
    )
  }

  const handleStarBoard = async (boardId) => {
    try {
      let updatedStarredBoards
      if (starredBoards.starBoardIds.includes(boardId)) {
        await removeStarBoardAPI(boardId)
        updatedStarredBoards = {
          title: starredBoards.title.filter((_, index) => starredBoards.starBoardIds[index] !== boardId),
          starBoardIds: starredBoards.starBoardIds.filter(id => id !== boardId)
        }
      } else {
        await addStarBoardAPI(boardId)
        updatedStarredBoards = {
          title: [...starredBoards.title, boards.find(board => board._id === boardId)?.title || ''],
          starBoardIds: [...starredBoards.starBoardIds, boardId]
        }
      }
      setStarredBoards(updatedStarredBoards) // Cập nhật UI ngay lập tức
    } catch (error) {
      toast.error('Không thể thay đổi trạng thái bảng')
    }
  }

  const handleOpenCreateDialog = () => {
    setOpenCreateDialog(true)
  }

  const handleCloseCreateDialog = () => {
    setOpenCreateDialog(false)
    setNewBoardData({
      title: '',
      visibility: 'private',
      description: 'de do chua biet lam gi'
    })
  }

  const handleCreateNewBoard = async (boardData) => {
    try {
      const newBoard = await createNewBoardAPI(boardData)
      setBoards(prevBoards => [...prevBoards, newBoard])
      toast.success('Tạo bảng mới thành công!')
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message)
      } else {
        toast.error('Lỗi ở đâu đó r')
      }
    }
  }

  const handleCreateBoard = async () => {
    if (!newBoardData.title) {
      toast.error('Vui lòng nhập tiêu đề bảng')
      return
    }
    if (newBoardData.title.length < 3) {
      toast.error('Tiêu đề bảng phải có ít nhất 3 ký tự')
      return
    }
    try {
      await handleCreateNewBoard(newBoardData)
      handleCloseCreateDialog()
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo bảng')
    }
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    )
  }

  const filteredBoards = boards.filter(board => board.title.toLowerCase().includes(searchValue.toLowerCase()))

  return (
    <Box sx={{ flexGrow: 1, p: 2, bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#EEEEEE') }}>
      <Typography variant='h5' fontWeight='bold' gutterBottom sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '') }}>
        KHÔNG GIAN LÀM VIỆC CỦA BẠN
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2, mb: 4 }}>
        <Avatar sx={{ bgcolor: '#3f51b5' }}>D</Avatar>
        <Typography variant='h6' sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '') }}>Không gian làm việc</Typography>
        <Button variant='outlined' size="small" sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '') }}>Cài đặt</Button>
      </Box>

      {/* Board List */}
      <Grid container spacing={2}>
        {Array.isArray(filteredBoards) && filteredBoards.map((board) => (
          <Grid item xs={12} sm={6} md={4} key={board._id}>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                cursor: 'pointer',
                borderRadius: '10px',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)', boxShadow: 3 }
              }}
            >
              <Box sx={{ position: 'absolute' }}>
                <IconButton
                  disableRipple
                  disableTouchRipple
                  sx={{
                    size: 'small',
                    bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#7886C7' : '#F0F0F0'),
                    '&:hover': { bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#7886C7' : '#F0F0F0') },
                    '&:active': { bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#7886C7' : '#F0F0F0') },
                    '&:focus': { bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#7886C7' : '#F0F0F0') }
                  }}
                  onClick={() => handleStarBoard(board._id)}
                >
                  {starredBoards.starBoardIds.includes(board._id) ? <StarIcon sx={{ color: 'gold' }} /> : <StarOutlineIcon />}
                </IconButton>
              </Box>
              <CardContent
                onClick={() => navigate(`/boards/${board._id}`)}
                sx={{
                  background: (theme) => (theme.palette.mode === 'dark' ? '#7886C7' : '#F0F0F0'),
                  height: 136,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant='h6' sx={{ color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '') }}>{board.title}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
        {/* Create new board card */}
        <Grid item xs={12} sm={6} md={4}>
          <Card
            sx={{
              borderRadius: '10px',
              height: 136,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: (theme) => (theme.palette.mode === 'dark' ? '#578FCA' : '#F0D3EE'),
              cursor: 'pointer',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 3,
                bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#578FCA' : '#F0D3EE')
              }
            }}
            onClick={handleOpenCreateDialog}
          >
            <Typography
              variant='h6'
              color='gray'
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: (theme) => (theme.palette.mode === 'dark' ? 'white' : '')
              }}
            >
              Tạo bảng mới
            </Typography>
          </Card>
        </Grid>
      </Grid>
      <Dialog open={openCreateDialog} onClose={handleCloseCreateDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" mb={2}>Tạo bảng</Typography>
            <IconButton sx={{ '&:hover, &:focus, &:active': { background: 'transparent' }, mb: 2 }} onClick={handleCloseCreateDialog} >
              <CloseIcon />
            </IconButton>
          </Box>
          <TextField
            fullWidth
            label="Tiêu đề bảng"
            required
            value={newBoardData.title}
            onChange={(e) => setNewBoardData({ ...newBoardData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Quyền xem</InputLabel>
            <Select
              value={newBoardData.visibility}
              label="Quyền xem"
              onChange={(e) => setNewBoardData({ ...newBoardData, visibility: e.target.value })}
            >
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="public">Public</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateBoard}
            disabled={!newBoardData.title}
          >
            Tạo mới
          </Button>
        </Box>
      </Dialog>
    </Box>
  )
}

export default MainBoard
