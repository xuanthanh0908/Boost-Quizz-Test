import { Box, Button } from '@mui/material'
import { Container } from '@mui/system'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'
import Fade from '@mui/material/Fade'
import CircularProgress from '@mui/material/CircularProgress'
const fakeRooms = [
  {
    idRoom: 1,
    name: 'Room 1',
  },
  {
    idRoom: 2,
    name: 'Room 2',
  },
  {
    idRoom: 3,
    name: 'Room 3',
  },
]
export const Context = React.createContext()
const host = 'http://localhost:9000/pvp'
const Room = () => {
  const [currentSocket, setCurrentSocket] = React.useContext(Context)
  const navigate = useNavigate()
  const userGet = JSON.parse(localStorage.getItem('user'))
  const [roomId, setRoomId] = React.useState()
  const [user, setUser] = React.useState(userGet ?? null)
  const [data, setData] = React.useState()
  const [loading, setLoading] = React.useState(null)
  const socket = React.useRef()
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [])

  React.useEffect(() => {
    console.log('On Login')
    socket.current = io(host)
    setCurrentSocket(socket.current)
    socket.current.emit('login', userGet.username)
  }, [user])
  React.useEffect(() => {
    if (loading === false) {
      navigate('/test', {
        state: {
          room: roomId,
          username: userGet.username,
        },
      })
    }
  }, [loading, user])
  React.useEffect(() => {
    if (socket.current) {
      socket.current.on('searching', (data) => {
        console.log('CLIENT - LOADING', data.loading)
        setLoading(data.loading)
      })
      socket.current.on('roomserver', (data) => {
        console.log('CHECKED RECIEVED ROOM ID FROM SERVER')
        const { roomId } = data
        setRoomId(roomId)
        handleJoin({ room: roomId, username: userGet.username })
      })
    }
  }, [user, roomId])
  const handleJoin = (item) => {
    socket.current.emit('join', {
      room: item.room,
      username: userGet.username,
    })
  }
  const handleClickLoading = () => {
    setLoading(true)
    socket.current.emit('findopponent', {
      username: userGet.username,
    })
  }
  return (
    <div>
      <Container component="main">
        <Box>
          {fakeRooms.map((item) => (
            <Button
              onClick={() => handleJoin(item)}
              sx={{ marginRight: 2 }}
              key={item.idRoom}
              variant="contained"
            >
              {item.name}
            </Button>
          ))}
        </Box>
        <Box sx={{ height: 40 }}>
          <Fade
            in={loading}
            style={{
              transitionDelay: loading ? '800ms' : '0ms',
            }}
            unmountOnExit
          >
            <CircularProgress />
          </Fade>
        </Box>
        <Button
          onClick={handleClickLoading}
          sx={{ marginTop: 2 }}
          variant="outlined"
        >
          Find Opponent
        </Button>
      </Container>
    </div>
  )
}

export default Room
