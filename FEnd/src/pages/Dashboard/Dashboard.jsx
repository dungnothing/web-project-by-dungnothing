import AppBar from '~/components/AppBar/AppBar'
import DashboardContent from './DashboardContent/DashboardContent'
import Container from '@mui/material/Container'
import { useState } from 'react'

function Dashboard({ starredBoards, setStarredBoards }) {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'auto' }}>
      <AppBar position="sticky" searchValue={searchValue} setSearchValue={setSearchValue} starredBoards={starredBoards} setStarredBoards={setStarredBoards} />
      <DashboardContent searchValue={searchValue} starredBoards={starredBoards} setStarredBoards={setStarredBoards} />
    </Container>
  )
}

export default Dashboard
