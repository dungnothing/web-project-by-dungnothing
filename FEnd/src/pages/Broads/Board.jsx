import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  fetchBoardDetailsAPI,
  createNewColumnAPI,
  createNewCardAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI,
  moveCardToDifferentColumnAPI,
  deleteColumnDetailsAPI
} from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
import { mapOrder } from '~/utils/sort'
import { Box, Typography } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import { toast } from 'react-toastify'
import { getAllUserInBoardAPI } from '~/apis'

function Board({ starredBoards, setStarredBoards }) {
  const [board, setBoard] = useState(null)
  const [dataIsChange, setDataIsChange] = useState(false)
  const [boardState, setBoardState] = useState(null)
  const { boardId: boardId } = useParams()

  {/** Quản lý thành viên */ }
  const [allUserInBoard, setAllUserInBoard] = useState({ admin: {}, members: [] })
  const getAllUserInBoard = async () => {
    try {
      const users = await getAllUserInBoardAPI(boardId)
      setAllUserInBoard(users)
    } catch (error) {
      toast.error('Lỗi khi lấy danh sách thành viên')
    }
  }

  useEffect(() => {
    const getUser = async () => {
      try {
        const users = await getAllUserInBoardAPI(boardId)
        setAllUserInBoard(users)
      } catch (error) {
        toast.error('Lỗi lấy thành viên!')
      }
    }
    getUser()
  }, [boardId])

  {/** Filters */ }
  const [filters, setFilters] = useState({
    keyword: '',
    overdue: false,
    dueTomorrow: false,
    haveDue: false
  })

  const handleFilterChange = (filter, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filter]: value
    }))
  }

  {/**Fetch Data Board */ }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const board = await fetchBoardDetailsAPI(boardId)
        board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
        board.columns.forEach(column => {
          column.cards = board.cards.filter(card => card.columnId === column._id)
          if (isEmpty(column.cardOrderIds)) {
            column.cards = [generatePlaceholderCard(column)]
            column.cardOrderIds = [generatePlaceholderCard(column)._id]
          } else {
            column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
          }
        })
        setBoard(board)
        setBoardState(board.permissions === 'guest' ? 'close' : board.boardState)
        setDataIsChange(false)
      } catch (error) {
        toast.error('Lỗi khi lấy dữ liệu bảng')
      }
    }

    // Chỉ fetch data khi lần đầu hoặc dataIsChange là true
    if (dataIsChange || board === null) {
      fetchData()
    }
  }, [boardId, dataIsChange, board])

  const handleUpdateTitle = (newTitle) => {
    setBoard(prevBoard => ({
      ...prevBoard,
      title: newTitle
    }))
  }

  {/** Create New Column */ }
  // Function nay dung de goi API tao moi Column va luu du lieu vao state
  const createNewColumn = async (newColumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })
    // Khi tao column moi thi se chua co card, can xu ly van de keo tha vao mot column rong truoc
    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    // Cap nhat trang thai board
    // Phia frontend phai tu lam lai state databoard thay vi phai goi lai api fetch...
    // Phu thuoc vao du an (co the la FE hay BE)
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  // Function nay dung de goi API tao moi Card va luu du lieu vao state
  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    // Cap nhat trang thai board
    // Phia frontend phai tu lam lai state databoard thay vi phai goi lai api fetch...
    // Phu thuoc vao du an (co the la FE hay BE)
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columnToUpdate) {
      // Neu column rong: ban chat la dang chua 1 cai Placehorlder card
      if (columnToUpdate.cards.some(card => card.FE_PlaceholderCard)) {
        columnToUpdate.cards = [createdCard]
        columnToUpdate.cardOrderId = [createdCard._id]
      } else {
        // Nguoc lai neu Column da co data thi push vao cuoi mang
        columnToUpdate.cards.push(createdCard)
        columnToUpdate.cardOrderIds.push(createdCard._id)
      }
    }
    setBoard(newBoard)
  }

  // Function nay goi API khi keo tha xong xuoi
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuan du lieu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)
    // Goi API update Board
    updateBoardDetailsAPI(newBoard._id, { columnOrderIds: dndOrderedColumnsIds })
  }

  // Khi di chuyen card trong cung Column
  const moverCardInTheSameColumn = (dndOrderedCards, dndOrderedCardIds, columnId) => {
    // Update cho chuan du lieu
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Goi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  // Khi di chuyen card tu Column A sang Column B
  // Cap nhat mang cardOrderIds cua Column ban dau chua no (xoa _id ra khoi mang)
  // Cap nhat mang cardOrderIds cua Column tiep theo (them _id vao mang) va cap nhat la truong columnId moi
  const moveCardToDifferentColumn = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // Update cho chuan du lieu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Goi API xu li
    let prevCardOrderIds = dndOrderedColumns.find(c => c._id === prevColumnId)?.cardOrderIds
    // Xu li van de khi keo Card cuoi cung ra khoi Column, column rong se co placehorlder-card, can xoa di truoc khi gui du lieu cho BE
    if (prevCardOrderIds[0].includes('placehorlder-card')) prevCardOrderIds = []

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(c => c._id === nextColumnId)?.cardOrderIds
    })
  }

  // Xu ly xoa mot Column va Cards ben trong no
  const deleteColumnDetails = (columnId) => {
    // Update cho chuan du lieu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(c => c._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    // Goi API xu li
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success(res?.deleteResult)
    })
  }

  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        height: '100vh',
        width: '100vw'
      }}>
        <CircularProgress />
        <Typography>Đang tải đợi xíu :3</Typography>
      </Box>
    )
  }

  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar starredBoards={starredBoards} setStarredBoards={setStarredBoards} />
      <BoardBar
        board={board}
        onUpdateTitle={handleUpdateTitle}
        onFilterChange={handleFilterChange}
        getAllUserInBoard={getAllUserInBoard}
        allUserInBoard={allUserInBoard}
        boardState={boardState}
        setBoardState={setBoardState}
      />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moverCardInTheSameColumn={moverCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
        filters={filters}
        boardState={boardState}
        setDataIsChange={setDataIsChange}
      />
    </Container>
  )
}

export default Board
