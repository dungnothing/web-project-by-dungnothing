export const capitalizeFirstLetter = (val) => {
  if (!val) return ''
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`
}
// Dung de tao ra 1 card moi khi 1 column trong, trong do card do duoc an di khoi giao dien nguoi dung
export const generatePlaceholderCard = (column) => {
  return {
    _id: `${column._id}-placehorlder-card`,
    boardId: column.boardId,
    columnId: column._id,
    FE_PlaceholderCard: true
  }
}