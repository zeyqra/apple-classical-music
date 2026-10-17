import { createBrowserRouter } from 'react-router-dom'
// import Login from '../pages/Login'
import MainLayout from '../layouts/MainLayout'
import Home from '../pages/Home'
import Menubar from '../components/Menubar'
import SideBar from '../components/Sidebar'
import Header from '../components/Header'
import Album from '../pages/Album'
import LibraryAlbums from '../pages/LibraryAlbums'
import Albums from '../pages/Albums'
import Search from '../pages/Search'
import RecentAlbums from '../pages/RecentAlbums'
import NewAlbums from '../pages/NewAlbums'
import TopList from '../pages/TopList'
import Playlist from '../pages/Playlist'
import SearchAlbums from '../pages/SearchAlbums'
import SearchSongs from '../pages/SearchSongs'
import SearchArtists from '../pages/SearchArtists'

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
        path: 'recent-albums',
        element: <RecentAlbums />,
      },
      {
        path: 'new-albums',
        element: <NewAlbums />,
      },
      {
        path: 'toplist',
        element: <TopList />,
      },
      {
        path: 'album/:id',
        element: <Album />,
      },
      {
        path: 'library/albums',
        element: <Albums />,
      },
      {
        path: 'playlist/:id',
        element: <Playlist />,
      },
      {
        path: 'search',
        element: <Search />,
      },
      {
        path: 'search/albums',
        element: <SearchAlbums />,
      },
      {
        path: 'search/songs',
        element: <SearchSongs />,
      },
      {
        path: 'search/artists',
        element: <SearchArtists />,
      },
    ],
  },
  // {
  //   path: 'login',
  //   element: <Login />,
  // },
])

export default router
