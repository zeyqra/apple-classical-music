import { createBrowserRouter } from 'react-router-dom'
import MainLayout from './MainLayout'
import Menubar from './components/Menubar'
import SideBar from './components/Sidebar'
import Header from './components/Header'
import Home from './pages/Home'
import Album from './pages/Album'
import Playlist from './pages/Playlist'
import Work from './pages/Work'
// import LibraryAlbums from './pages/LibraryAlbums'
// import PlaylistsCreated from './pages/PlaylistsCreated'

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
        path: 'playlist/:id',
        element: <Playlist />,
      },
      {
        path: '/work/:id',
        element: <Work />,
      },
      // {
      //   path: '/library/tracks',
      //   element: <LibraryTracks />,
      // },
      // {
      //   path: '/playlists',
      //   element: <PlaylistsCreated />,
      // },
    ],
  },
])

export default router
