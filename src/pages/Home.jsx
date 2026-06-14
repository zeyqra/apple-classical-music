import { useAlbumNew } from '../services/music'
import BannerList from '../components/BannnerList'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate = useNavigate()
  const handleBannerItemClick = item => {
    navigate(`/album/${item.id}`)
  }
  return (
    <BannerList
      title="Top Albums"
      useQuery={useAlbumNew}
      useQueryParams={{ area: 'ALL', offset: 0, limit: 12 }}
      onItemClick={handleBannerItemClick}
    />
  )
}

export default Home
