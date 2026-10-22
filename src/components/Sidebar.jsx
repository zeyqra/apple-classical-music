import useAppStore from '../stores/app'
import Queue from './Queue'
import Lyric from './Lyric'

const SideBar = () => {
  const sbType = useAppStore(state => state.sbType)
  let content = null
  if (sbType === 'queue') {
    content = <Queue></Queue>
  } else if (sbType === 'lyric') {
    content = <Lyric></Lyric>
  }

  return (
    <div className="h-full w-full border-l border-zinc-500">
      <div
        className={`${sbType === 'queue' ? 'translate-x-0' : 'translate-x-30'} transition-transform`}>
        {content}
      </div>
    </div>
  )
}

export default SideBar
