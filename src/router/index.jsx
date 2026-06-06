import { createBrowserRouter } from 'react-router-dom'
// import Login from '../pages/Login'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Menubar from '../components/Menubar'
import SideBar from '../components/Sidebar'
import Header from '../components/Header'
import { requireAuth } from '../utils/auth'
import Album from '../pages/Album'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout header={<Header />} menubar={<Menubar />} sidebar={<SideBar />} />,
    // loader: requireAuth,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'album/:id',
        element: <Album />,
      },
    ],
  },
  // {
  //   path: 'login',
  //   element: <Login />,
  // },
])

export default router
