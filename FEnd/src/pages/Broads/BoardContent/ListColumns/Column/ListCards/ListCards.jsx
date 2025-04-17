import Card from './Card/Card'
import Box from '@mui/material/Box'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useEffect, useState } from 'react'

function ListCards({ cards, boardState, filters, setDataIsChange }) {
  const [listFilterCard, setListFilterCard] = useState([])
  const [isFilting, setIsFilting] = useState(false)

  useEffect(() => {
    const filterCard = () => {
      if (!cards) return []

      return cards.filter((card) => {
        // Luôn giữ lại placeholder card
        if (card.FE_PlaceholderCard) return true

        let isMatch = false // Nếu card thỏa mãn bất kỳ điều kiện nào, nó sẽ được thêm vào danh sách

        // Lọc theo từ khóa
        if (filters?.keyword) {
          const cardTitle = card.title || ''
          if (cardTitle.toLowerCase().includes(filters.keyword.toLowerCase())) {
            isMatch = true
          }
        }

        // Lọc theo ngày quá hạn
        if (filters?.overdue) {
          if (card.endTime) {
            const now = new Date()
            const dueDate = new Date(card.endTime)
            if (dueDate <= now) {
              isMatch = true
            }
          }
        }

        // Lọc theo ngày hết hạn là ngày mai
        if (filters?.dueTomorrow) {
          if (card.endTime) {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const dueDate = new Date(card.endTime)
            if (
              dueDate.getFullYear() === tomorrow.getFullYear() &&
              dueDate.getMonth() === tomorrow.getMonth() &&
              dueDate.getDate() === tomorrow.getDate()
            ) {
              isMatch = true
            }
          }
        }

        // Lọc các card không có ngày hết hạn
        if (filters?.noDate && !card?.endTime) {
          isMatch = true
        }

        return isMatch
      })
    }

    const filteredCards = filterCard()
    setListFilterCard(filteredCards)
    setIsFilting(Object.values(filters || {}).some((val) => val)) // Kiểm tra nếu có bộ lọc nào đang được bật
  }, [filters, cards])

  return (
    <SortableContext items={cards?.map((c) => c._id)} strategy={verticalListSortingStrategy}>
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) =>
            `calc(
              ${theme.trello.boardContentHeight} -
              ${theme.spacing(5)} -
              ${theme.trello.columnHeaderHeight} -
              ${theme.trello.columnFooterHeight}
            )`,
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#bfc2cf' }
        }}
      >
        {isFilting
          ? listFilterCard.map((card) => (
            <Card key={card._id} card={card} boardState={boardState} filters={filters} setDataIsChange={setDataIsChange} />
          ))
          : cards?.map((card) => (
            <Card key={card._id} card={card} boardState={boardState} filters={filters} setDataIsChange={setDataIsChange} />
          ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards
