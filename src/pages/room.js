import {
  Box,
  Button,
  TextField,
  Stack,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material'
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
const host = `${process.env.REACT_APP_ENDPOINT}/pvp`
const Room = () => {
  const [currentSocket, setCurrentSocket] = React.useContext(Context)
  const navigate = useNavigate()
  const userGet = JSON.parse(localStorage.getItem('user'))
  const [roomId, setRoomId] = React.useState()
  const [user, setUser] = React.useState(userGet ?? null)
  const [data, setData] = React.useState()
  const [loading, setLoading] = React.useState(null)
  const [category, setCategory] = React.useState('html')
  const socket = React.useRef()
  React.useEffect(() => {
    if (!user) {
      navigate('/login')
    }
  }, [])
  const handleChange = (event) => {
    setCategory(event.target.value)
  }
  React.useEffect(() => {
    console.log('On Login')
    socket.current = io(host)
    setCurrentSocket(socket.current)
    socket.current.emit('login', {
      id: userGet.username,
      username: userGet.username,
    })
  }, [user])
  React.useEffect(() => {
    if (loading === false && category?.length > 0) {
      navigate('/test', {
        state: {
          room: roomId,
          username: userGet.username,
          category: category.toLowerCase(),
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
    if (category.length > 0 || category) {
      socket.current.emit('findopponent', {
        id: userGet.username,
        displayname: userGet.username,
        category: category.toLowerCase(),
      })
    } else alert('Please enter your category to find opponent')
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
        <Stack width="300px" mt={3}>
          <FormControl>
            <InputLabel id="demo-simple-select-helper-label">
              Category
            </InputLabel>
            <Select
              labelId="demo-simple-select-helper-label"
              id="demo-simple-select-helper"
              defaultValue={'html'}
              value={category}
              onChange={handleChange}
              label="category"
            >
              <MenuItem value={'html'}>HTML</MenuItem>
              <MenuItem value={'css'}>CSS</MenuItem>
              <MenuItem value={'c++'}>C++</MenuItem>
              <MenuItem value={'c'}>C</MenuItem>
              <MenuItem value={'python'}>PYTHON</MenuItem>
              <MenuItem value={'javascript'}>JAVASCRIPT</MenuItem>
            </Select>
          </FormControl>

          <Button
            onClick={handleClickLoading}
            sx={{ marginTop: 2 }}
            variant="outlined"
          >
            Find Opponent
          </Button>
        </Stack>
      </Container>
    </div>
  )
}

export default Room
