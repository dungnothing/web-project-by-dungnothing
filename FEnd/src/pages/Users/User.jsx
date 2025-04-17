import AppBar from '~/components/AppBar/AppBar'
import { Container } from '@mui/material'
import Account from '~/pages/Users/Account/Account'
import { useState } from 'react'

function User() {
  const [searchValue, setSearchValue] = useState('')
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh', overflow: 'auto' }}>
      <AppBar position="sticky" searchValue={searchValue} setSearchValue={setSearchValue} />
      <Account />
    </Container>
  )
}

export default User
