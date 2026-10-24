import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './MainLayout'
import Menubar from './components/Menubar'
import SideBar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import Album from './pages/Album'
import LibraryTracks from './pages/LibraryTracks'

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
        path: '/library/tracks',
        element: <LibraryTracks />,
      },
    ],
  },
])

export default router
