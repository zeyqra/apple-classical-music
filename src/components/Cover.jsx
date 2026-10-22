import { Music } from 'lucide-react'
import Image from './Image'

const Cover = ({ track }) => {
  return (
    <div className="w-full h-full flex items-center justify-center ">
      {track?.album_cover_url ? <Image src={track.album_cover_url} /> : 'COVER'}
    </div>
  )
}

export default Cover
