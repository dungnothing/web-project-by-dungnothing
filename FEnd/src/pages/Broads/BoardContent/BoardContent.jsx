import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import {
  DndContext,
  // MouseSensor,
  // TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  closestCorners,
  pointerWithin,
  getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensor'
import { useCallback, useEffect, useRef, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { cloneDeep, isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import Column from './ListColumns/Column/Column'
import Card from './ListColumns/Column/ListCards/Card/Card'

const ACTIVE_DRAG_ITEM_TYPE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYPE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYPE_CARD'
}

function BoardContent({
  board,
  createNewColumn,
  createNewCard,
  moveColumns,
  moverCardInTheSameColumn,
  moveCardToDifferentColumn,
  deleteColumnDetails,
  filters,
  boardState,
  setDataIsChange
}) {
  // https://docs.dndkit.com/api-documentation/sensors
  // Yeu cau chuot di chuyen 10px thi moi goi event
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10
    }
  })

  // An giu 250ms va di chuyen khoang 500px thi moi goi event
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 250,
      tolerance: 500
    }
  })

  // Uu tien su dung ca mouse va touch de trai nghiem tot tren mobie
  // const sensors = useSensors(poiterSensor)
  const sensors = useSensors(mouseSensor, touchSensor)

  const [orderedColumns, setOderedColumns] = useState([])

  // Cung mot luc chi co 1 phan tu co the keo la column hoac card
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  // Diem va cham cuoi cung xu li thuat toan phat hien va cham
  const lastOverId = useRef(null)

  useEffect(() => {
    // Column da duoc sap xep o component cha cao nhat
    setOderedColumns(board.columns)
  }, [board])

  // Tim column theo CardID
  const findColumnByCardId = (cardId) => {
    // Đoạn này dùng c.cards thay vì c.cardOderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh rồi mới tạo ra cardOrderIds mới
    return orderedColumns.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Fuction chung xu li viec cap nhat lai state trong truong hop di chuyen Card giua cac Column khac nhau
  const moveCardBetweenDifferentColumns = (
    overColumn,
    overCardId,
    active,
    over,
    activeColumn,
    activeDraggingCardId,
    activeDraggingCardData,
    triggerFrom
  ) => {
    setOderedColumns(prevColumns => {
      // Tim vi tri cua cai overCard trong column dich (noi ma activeCard sap duoc tha toi)
      const overCardIndex = overColumn?.cards?.findIndex(card => card._id === overCardId)

      // Logic tinh toan 'cardIndex moi' (tren hoac duoi overCard) lay chuan ra tu code thu vien
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0
      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColumn?.cards?.length + 1

      // Clone mang OrderedColumnsState cu ra mot cai moi de xy ly data roi return - cap nhat lai OderedColumnsState moi
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColumn._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColumn._id)

      // nextActiveColumn: Column cu
      if (nextActiveColumn) {
        // Xoa cac o column active ( la o column cu, luc ma keo card ra khoi no de sang column khac)
        nextActiveColumn.cards = nextActiveColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Them PlaceholderCard neu column rong
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }

        // Cap nhat lai mang cardOderIds cho chuan du lieu
        nextActiveColumn.cardOrderIds = nextActiveColumn.cards.map(card => card._id)
      }

      // nextOverColumn: Column moi
      if (nextOverColumn) {
        // Kiem tra xem card dang keo co ton tai o overColumn chua, neu co thi can xoa no truoc
        nextOverColumn.cards = nextOverColumn.cards.filter(card => card._id !== activeDraggingCardId)

        // Phai cap nhat lai chuan du lieu columnId trong card sau khi keo card giua 2 column khac nhau
        const rebuild_activeDraggingCardId = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }

        // Tiep theo la them cai cac dang keo vao overColumn theo vi tri index moi
        nextOverColumn.cards = nextOverColumn.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardId)

        // Xoa cai PlaceHolder Card neu no dang ton tai
        nextOverColumn.cards = nextOverColumn.cards.filter(card => !card.FE_PlaceholderCard)

        // Cap nhat lai mang cardOderIds cho chuan du lieu
        nextOverColumn.cardOrderIds = nextOverColumn.cards.map(card => card._id)
      }

      // Neu function nay duoc goi tu handleDragEnd la da keo tha xong, luc nay moi xu ly goi API 1 lan o day
      if (triggerFrom === 'handleDragEnd') {
        /**
         * Goi len prop function moveCardToDifferentColumn nam o component cha cao nhat (boards/_id.jsx)
         * Phai dung toi activeDragItemData.columnId hoac tot nhat la oldColumnWhenDraggingCard._id (set vao state tu buoc handleDragStart)
         * chu khong phai activeData trong scope handleDraEnd vi sau khi di qua onDragOver va toi day la state cua card da bi cap nhat 1 lan roi
         */
        moveCardToDifferentColumn(
          activeDraggingCardId,
          oldColumnWhenDraggingCard._id,
          nextOverColumn._id,
          nextColumns
        )
      }

      return nextColumns
    })
  }

  //  Hoat dong khi bat dau keo 1 phan tu
  const handleDragStart = (event) => {
    // console.log('Bat dau keo: ', event)
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(event?.active?.data?.current?.columnId ? ACTIVE_DRAG_ITEM_TYPE.CARD : ACTIVE_DRAG_ITEM_TYPE.COLUMN)
    setActiveDragItemData(event?.active?.data?.current)

    // Neu keo card thi moi thuc hien hanh dong set gia tri oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }

  // Hoat dong trong qua trinh keo
  const handleDragOver = (event) => {
    if (!event?.active || !event?.over) return // Bảo vệ khi kéo ra ngoài vùng hợp lệ
    // Khong lam gi ca
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) return

    const { active, over } = event
    // Kiem tra active, over xem co keo linh tinh khong, return cho do loi
    if (!active && !over) return

    // activeDraggingCard la card dang keo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
    // overCard: la cai card dang tuong tac tren hoac duoi so voi card duoc keo o tren
    const { id: overCardId } = over

    // Tim 2 column theo  cardID
    const activeColumn = findColumnByCardId(activeDraggingCardId)
    const overColumn = findColumnByCardId(overCardId)

    // Neu khong ton tai 1 trong 2 thi se khong lam gi
    if (!activeColumn || !overColumn) return

    // Xu li logic khi no thuoc 2 column khac nhau, con neu trong chinh column ban dau thi khong lam gi
    if (activeColumn._id !== overColumn._id) {
      moveCardBetweenDifferentColumns(
        overColumn,
        overCardId,
        active,
        over,
        activeColumn,
        activeDraggingCardId,
        activeDraggingCardData,
        'handleDragOver'
      )
    }
  }

  // Hoat dong khi ket thuc keo 1 phan tu => tha 1 phan tu
  const handleDragEnd = (event) => {
    const { active, over } = event
    // Kiem tra active, over xem co keo linh tinh khong, return cho do loi
    if (!active && !over) return
    // Xu li keo tha card
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) {
      // activeDraggingCard la card dang keo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active
      // overCard: la cai card dang tuong tac tren hoac duoi so voi card duoc keo o tren
      const { id: overCardId } = over

      // Tim 2 column theo  cardID
      const activeColumn = findColumnByCardId(activeDraggingCardId)
      const overColumn = findColumnByCardId(overCardId)

      // Neu khong ton tai 1 trong 2 thi se khong lam gi
      if (!activeColumn || !overColumn) return

      // Hanh dong keo giua 2 column khac nhau
      if (oldColumnWhenDraggingCard._id !== overColumn._id) {
        moveCardBetweenDifferentColumns(
          overColumn,
          overCardId,
          active,
          over,
          activeColumn,
          activeDraggingCardId,
          activeDraggingCardData,
          'handleDragEnd'
        )
      } else {
        // Hanh dong keo trong cung 1 column

        // Lay vi tri cu tu thang oldColumnWhenDraggingCard
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        // Lay vi tri moi tu thang overColumn
        const newCardIndex = overColumn?.cards?.findIndex(c => c._id === overCardId)

        // Dung arrayMove vi keo card trong mot cai column tuong tu voi logic keo column trong mot cai board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        const dndOrderedCardIds = dndOrderedCards.map(card => card._id)

        // Goi update State de tranh delay
        setOderedColumns(prevColumns => {
          // Clone mang OrderedColumnsState cu ra mot cai moi de xy ly data roi return - cap nhat lai OderedColumnsState moi
          const nextColumns = cloneDeep(prevColumns)

          // Tim toi column dang tha
          const targetColumn = nextColumns.find(column => column._id === overColumn._id)

          // Cap nhat lai 2 gia tri moi trong targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCardIds

          return nextColumns
        })

        // Goi len prop function moverCardInTheSameColumn nam o component board/_id.jsx
        moverCardInTheSameColumn(dndOrderedCards, dndOrderedCardIds, oldColumnWhenDraggingCard._id)
      }
    }

    // Xu li keo tha column trong mot boardContent
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      // Neu vi tri moi khac vi tri ban dau
      if (active.id !== over.id) {
        // Lay vi tri cu tu thang active
        const oldColumnIndex = orderedColumns.findIndex(c => c._id === active.id)
        // Lay vi tri moi tu thang over
        const newColumnIndex = orderedColumns.findIndex(c => c._id === over.id)

        // Dung arrayMove cua dnd-kit de sap xep lai mang
        // Code here: dnd-kit/packages/sortable/src/ultilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumns, oldColumnIndex, newColumnIndex)

        // Cap nhat lai state columns ban dau sau khi da keo tha (can phai goi API)
        setOderedColumns(dndOrderedColumns)

        // Goi len prop function moveColumns nam o component board/_id.jsx
        moveColumns(dndOrderedColumns)

      }
    }

    // Nhung du lieu sau khi keo tha nay luon phai dua ve gia tri null ban dau
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Animation khi keo tha
  const customDropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: 0.5 } }
    })
  }

  // Custom lai thuat toan phap hien va cham de tranh gap loi
  // args = arguments = doi so, tham so
  const collisionDetectionStrategy = useCallback((args) => {
    // Truong hop la column thi dung closestCorners
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) {
      return closestCorners({ ...args })
    }

    // Tim cac diem giao nhau khi va cham, tra ve mot mang va cham
    const pointerIntersections = pointerWithin(args)

    // Keo card lon co image len tren cung khu vuc keo
    if (!pointerIntersections?.length) return
    // Thuat toan phat hien va cham va tra ve mot mang va cham
    // const intersections = !!pointerIntersections?.length ? pointerIntersections : rectIntersection(args)

    // Tim overid dau tien trong dam pointerIntersections o tren
    let overId = getFirstCollision(pointerIntersections, 'id')

    if (overId) {
      // Neu cai over la column thi se tim toi cardId gan nhat ben trong khu vuc va cham do dua vao thuat toan phat hien va cham closestCorners
      const checkColumn = orderedColumns.find(column => column.id === overId)
      if (checkColumn) {
        // console.log('overId before:', overId)
        overId = closestCorners({
          ...args,
          droppableContainers: args.droppableContainers.filter(container => {
            return (container.id !== overId) && (checkColumn?.cardOrderIds?.includes(container.id))
          })
        })[0]?.id
        // console.log('overId after:', overId)
      }

      lastOverId.current = overId
      return [{ id: overId }]
    }

    // Neu khong tim thay overid, tra ve mot mang rong tranh crash trang web
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType, orderedColumns])

  return (
    <DndContext
      // Cam bien
      sensors={sensors}
      // Thuat toan phat hien va cham ( neu khong co thi card lon se khong the keo duoc)
      // colisionDetection bi loi khi keo tha card trong thuat toan phat hien va cham nen phai custom lai
      // collisionDetection={closestCorners}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragStart={handleDragStart}
    >
      {boardState === 'close' && (
        <Box sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#4D55CC' : '#F7F7F7')
        }}>
          Bạn chỉ có thể xem thôi
        </Box>
      )}
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#C890A7'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0',
        opacity: 0.9,
        pointerEvents: boardState === 'close' ? 'none' : 'auto',
        position: 'relative'
      }}>
        <ListColumns
          columns={orderedColumns}
          createNewColumn={createNewColumn}
          createNewCard={createNewCard}
          deleteColumnDetails={deleteColumnDetails}
          boardState={boardState}
          filters={filters}
          setDataIsChange={setDataIsChange}
        />
        <DragOverlay dropAnimation={customDropAnimation}>
          {(!activeDragItemType) && null}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYPE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box>
    </DndContext>
  )
}

export default BoardContent
