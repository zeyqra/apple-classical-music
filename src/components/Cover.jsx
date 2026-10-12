import { Music } from 'lucide-react'
import ImgLazy from './ImgLazy'

const Cover = ({ song }) => {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      {song.id ? (
        <ImgLazy className="w-full h-full" src={song.alPicUrl} alt="song cover" />
      ) : (
        <Music />
      )}
    </div>
  )
}

export default Cover
