import {
  Button,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from '@mui/material'
import { Box, Container } from '@mui/system'
import React from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Context } from './room'

let timeOut = null
const Home = () => {
  const navigate = useNavigate()
  const [currentSocket, setCurrentSocket] = React.useContext(Context)
  const [status, setStatus] = React.useState(null)
  const [quizz, setQuizz] = React.useState([])
  const [index, setIndex] = React.useState(0)
  const [currentSelect, setCurrentSelect] = React.useState()
  const [checkList, setChecklist] = React.useState([])
  const { state } = useLocation()
  const [mess, setMess] = React.useState([])
  const { username, room } = state
  // emit event fetch all quizzs
  React.useEffect(() => {
    currentSocket.emit('streamQuizs', {
      username: username,
      room: room,
      category: 'History',
    })
    currentSocket.on('allQuiz', (data) => {
      const { allData, username } = data
      if (allData && allData.length > 0) {
        setQuizz(allData)
      } else console.log('===========SOCKET FETCH ALL QUIZZ FAIL========')
    })
  }, [username])
  /// check anwser
  React.useEffect(() => {
    currentSocket.on('statusCheck', (data) => {
      const { status, result, username: identifiedFromServer } = data
      setChecklist((prev) => [
        ...prev,
        `${identifiedFromServer}'s answer is ${
          status ? 'correct' : 'incorrect'
        }`,
      ])
      // console.log(`${username}'s answer is ${status ? 'correct' : 'incorrect'}`)
      if (username === identifiedFromServer) {
        console.log('Checked Status')
        setStatus(result)
        timeOut = setTimeout(() => {
          setStatus(null)
          setIndex((prev) => prev + 1)
          setCurrentSelect(null)
        }, 2000)
      }
    })
    return () => clearTimeout(timeOut)
  }, [username])
  React.useEffect(() => {
    currentSocket &&
      currentSocket.on('newuser', (mes) => {
        console.log(mes)
      })
    currentSocket &&
      currentSocket.on('data', (data) => {
        console.log('::::::::::::SOCKET-CLIENT:::::::::ONDATA:::::::::::::')
        setMess((prev) => [...prev, data])
      })
  }, [room, username])
  // const handleSubmitSocket = (e) => {
  //   e.preventDefault()
  //   currentSocket.emit('update', {
  //     username: username,
  //     message: data,
  //     room: room,
  //   })
  //   setMess((prev) => [
  //     ...prev,
  //     {
  //       username: username,
  //       message: data,
  //     },
  //   ])
  //   setData('')
  // }

  const handleCheckAnwser = (anwser) => {
    // e.preventDefault()
    setCurrentSelect(anwser)
    if (index < quizz.length) {
      currentSocket.emit('checkAnswer', {
        quizId: quizz[index]._id,
        quizIndex: index,
        answer: anwser,
        username: username,
        room: room,
      })
    }
  }

  const handleDisconnect = () => {
    currentSocket.emit('end', { username, roomID: room })
    currentSocket.disconnect()
    navigate('/')
  }
  return (
    <Container
      component="main"
      maxWidth="sm"
      sx={{
        display: 'flex',
        height: '300px',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      <Button
        onClick={handleDisconnect}
        type="submit"
        fullWidth
        sx={{ mt: 1 }}
        color="info"
        variant="contained"
      >
        Disconnect
      </Button>
      {checkList.length > 0 &&
        checkList.map((item, i) => <Typography key={i}>{item}</Typography>)}
      {index === quizz.length - 1 ? (
        <Typography>End Round</Typography>
      ) : (
        <>
          <List
            sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}
          >
            {mess.length > 0 &&
              mess.map((value) => (
                <ListItem key={value} disableGutters>
                  <ListItemText
                    primary={` ${value.username} : ${value.message}`}
                  />
                </ListItem>
              ))}
          </List>
          <Box sx={{ mt: 1 }}>
            {/* <TextField
          margin="normal"
          required
          fullWidth
          label="Something"
          name="somthing"
          value={data}
          onChange={(e) => setData(e.target.value)}
        /> */}
            {quizz.length > 0 && (
              <Typography component={'h5'}>
                {quizz[index].questionTitle}
              </Typography>
            )}
            {quizz.length > 0 &&
              quizz[index].questionAnswer?.map((item, i) => (
                <Button
                  onClick={() => handleCheckAnwser(item)}
                  key={i}
                  type="submit"
                  fullWidth
                  sx={{ mt: 1 }}
                  variant="contained"
                  color={
                    status === item && item === currentSelect
                      ? 'success'
                      : currentSelect !== status && item === currentSelect
                      ? 'error'
                      : 'info'
                  }
                >
                  {item}
                </Button>
              ))}
          </Box>
        </>
      )}
    </Container>
  )
}

export default Home
