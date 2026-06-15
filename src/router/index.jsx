import { createBrowserRouter } from 'react-router-dom'
// import Login from '../pages/Login'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Menubar from '../components/Menubar'
import SideBar from '../components/Sidebar'
import Header from '../components/Header'
import Album from '../pages/Album'
import LibraryAlbums from '../pages/LibraryAlbums'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout header={<Header />} menubar={<Menubar />} sidebar={<SideBar />} />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'album/:id',
        element: <Album />,
      },
      {
        path: 'library/albums',
        element: <LibraryAlbums />,
      },
    ],
  },
  // {
  //   path: 'login',
  //   element: <Login />,
  // },
])

export default router
