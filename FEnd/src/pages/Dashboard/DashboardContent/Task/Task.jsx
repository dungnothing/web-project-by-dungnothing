import { useState, useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import { getAllAccessibleBoardsAPI } from '~/apis'
import { fetchBoardDetailsAPI } from '~/apis'
import { Card, CardMedia, Typography, Box } from '@mui/material'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { useNavigate } from 'react-router-dom'

function Task() {
  const [boardList, setBoardList] = useState([])
  const [boardData, setBoardData] = useState([])
  const [taskList, setTaskList] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getAllAccessibleBoardsAPI()
        setBoardList(response)
      } catch (error) {
        toast.error(error.message)
      }
    }
    getData()
  }, [])

  useEffect(() => {
    if (boardList?.length === 0) return

    const fetchData = async () => {
      try {
        const responses = await Promise.all(
          boardList?.map((board) => fetchBoardDetailsAPI(board._id))
        )
        setBoardData(responses)
      } catch (error) {
        toast.error('Lỗi lấy thông tin board')
      }
    }
    fetchData()
  }, [boardList])

  // Quản lý task (nhiệm vụ)
  const computedTaskList = useMemo(() => {
    return boardData.flatMap((board) =>
      (board.cards || []).map((card) => {
        const column = board.columns?.find(col => col._id === card.columnId)
        return {
          ...card,
          boardTitle: board.title,
          boardId: board._id,
          columnTitle: column?.title
        }
      })
    ).filter((card) => card?.endTime) // Lọc ra các task có thời hạn
  }, [boardData])

  // Chỉ cập nhật taskList nếu dữ liệu mới khác dữ liệu cũ
  useEffect(() => {
    if (JSON.stringify(taskList) !== JSON.stringify(computedTaskList)) {
      setTaskList(computedTaskList)
    }
  }, [computedTaskList, taskList])

  const timeShow = (time) => {
    return new Date(time).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    })
  }

  return (
    boardList.length !== 0 ?
      (<Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {taskList.map((task) => (
          <Card key={task._id} sx={{ p: 2, width: 400, height: 250, overflow: 'auto' }}>
            <CardMedia
              sx={{ height: 120, cursor: 'pointer' }}
              image={'https://i.pinimg.com/736x/36/9f/6f/369f6f9d06575f4d0629f4f8bf8347f8.jpg'}
              onClick={() => navigate(`/boards/${task?.boardId}`)}

            />
            <Typography sx={{ mt: 1, color: '#A31D1D' }}>Nội dung: {task?.title}</Typography>
            <Typography sx={{ mt: 1, color: '#5CB338' }}>Thuộc: {task?.boardTitle} / {task?.columnTitle}</Typography>
            <Typography sx={{ m: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <AccessTimeIcon fontSize="small" />
              Thời hạn: {timeShow(task?.endTime)}
            </Typography>
          </Card>
        ))}
      </Box>)
      :
      (<Typography variant='h6'>Không có nhiệm vụ gì hết!</Typography>)

  )
}

export default Task
