import Home from './pages/home'
import Login from './pages/login'
import Room from './pages/room'
const allRoutes = [
  {
    id: 2,
    components: Login,
    path: '/login',
  },
  {
    id: 1,
    components: Room,
    path: '/',
  },
  {
    id: 1,
    components: Home,
    path: '/test',
  },
]
export { allRoutes }
