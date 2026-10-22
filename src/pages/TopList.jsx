import { useToplist } from '../services/music'
import { useNavigate } from 'react-router-dom'
import Loading from '../libs/Loading'
import Image from '../components/Image'

const RecentAlbums = () => {
  const { data: toplistData, isLoading: toplistLoading, error: toplistError } = useToplist()
  const toplists = toplistData?.list || []

  const navigate = useNavigate()
  const handleAlbumClick = id => navigate(`/playlist/${id}`)

  if (toplistLoading) return <Loading />
  return (
    <div className="h-full overflow-y-auto p-1">
      <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-2 ">
        {toplists.length > 0 &&
          toplists.map(({ coverImgUrl, name, id }) => (
            <div onClick={() => handleAlbumClick(id)} key={id}>
              <Image className="aspect-square w-full object-cover" src={coverImgUrl} alt={name} />
              <div className="line-clamp-2 wrap-break-word">{name}</div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default RecentAlbums
