import React from 'react'
import { Context } from './pages/room'
import Router from './routes'
const App = () => {
  const [currentSocket, setCurrentSocket] = React.useState()
  return (
    <Context.Provider value={[currentSocket, setCurrentSocket]}>
      <Router />
    </Context.Provider>
  )
}

export default App
