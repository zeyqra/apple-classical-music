import { Music } from 'lucide-react'
import ImgLazy from './ImgLazy'

const Cover = ({ song }) => {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      {song.id ? <ImgLazy src={song.alPicUrl} /> : 'COVER'}
    </div>
  )
}

export default Cover
