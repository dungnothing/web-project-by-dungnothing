import { Box, Typography, Button } from '@mui/material'
import { deleteManyBoardAPI } from '~/apis'
import { useState } from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

function Setting() {
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const navigate = useNavigate()

  const handleDeleteAllBoard = async () => {
    try {
      await deleteManyBoardAPI()
      setOpenDeleteDialog(false)
      toast.success('Xóa hết lun roài!')
    } catch (error) {
      toast.error('Lỗi rồi bạn hiền')
    }
  }

  const handleOpenDeleteDialog = () => {
    setOpenDeleteDialog(true)
  }

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false)
  }

  const handleGoToUpgradePage = () => {
    navigate('/upgrade-vip')
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant='h5' fontWeight='bold' gutterBottom>CÀI ĐẶT </Typography>
      <Box>
        <Typography variant="body6" >Nạp vip đê các bạn ơi</Typography>
        <Button variant="contained" sx={{ m: 2 }} onClick={handleGoToUpgradePage} >Nạp vip</Button>
      </Box>
      <Typography variant="body6" >Xóa hết bảng luôn nhá, đừng có tiếc chi</Typography>
      <Button onClick={handleOpenDeleteDialog} variant="contained" sx={{ m: 2 }} >Xóa đây</Button>
      {/**Dialog xac nhan xoa */}
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Xóa hết sạch sành sanh</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Bạn có chắc chắn muốn xóa hết bảng không?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteAllBoard} color="error" autoFocus variant='contained'>
            Xác nhận
          </Button>
          <Button onClick={handleCloseDeleteDialog} color="primary" variant='outlined'>
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </Box >
  )
}

export default Setting
