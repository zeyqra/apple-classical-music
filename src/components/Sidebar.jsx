import useAppStore from '../stores/app'
import useMusicStore from '../stores/music'
import Queue from './Queue'
import Lyric from './Lyric'

const SideBar = () => {
  const sbType = useAppStore(state => state.sbType)
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 0
  console.log('console: queue', queue)
  let content = null
  if (sbType === 'queue') {
    content = <Queue></Queue>
  } else if (sbType === 'lyric') {
    content = <Lyric></Lyric>
  }

  return <div className="h-full w-full">{content}</div>
}

export default SideBar
