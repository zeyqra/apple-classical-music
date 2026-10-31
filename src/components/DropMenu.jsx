import useStore from '../store'
import Dropdown from './Dropdown'
import Hoverdown from './Hoverdown'
import Dialog from './Dialog'
import { useState } from 'react'
// 专辑 | 播放列表 | 曲目 | 录音
// 播放
// 添加到资料库
// 添加到播放列表
// 分享曲目|录音|专辑 | 播放列表
// 拷贝链接
// 前往专辑
// 前往作品
// 个人收藏

const DropMenu = ({ type, albumId, trackIds, playFn }) => {
  const libraryTrackIds = useStore(state => state.libraryTrackIds)
  const addTracksToLibrary = useStore(state => state.addTracksToLibrary)
  const removeTracksFromLibrary = useStore(state => state.removeTracksFromLibrary)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [dialogDes, setIsDialogDes] = useState('')

  const handleAddToLibrary = () => {
    // if (type === 'track') {
    addTracksToLibrary({ albumId, trackIds })
    // } else if (type === 'album') {
    //   addTracksToLibrary({ albumId, trackIds: trackIds })
    // }
  }
  const handleRemoveFromLibrary = () => {
    removeTracksFromLibrary({ albumId, trackIds: trackIds })
  }

  const handleOpenDialog = () => {
    setIsDialogOpen(true)
  }

  const handleCreateClick = () => {
    console.log('console: create clcik')
    // await 创建新播放列表
    // await 音轨数组加入到播放列表
    // setIsDialogOpen(false)
  }

  let isInLibrary = false
  if (type === 'track') {
    isInLibrary = libraryTrackIds.get(albumId)?.has(trackIds[0])
  } else if (type === 'album') {
    isInLibrary = libraryTrackIds.get(albumId)?.size > 0
  }
  return (
    <Dropdown
      trigger={<button>...</button>}
      menu={
        <div>
          {playFn && <div onClick={playFn}>播放</div>}

          {isInLibrary ? (
            <div onClick={handleRemoveFromLibrary}>从资料库删除</div>
          ) : (
            <div onClick={handleAddToLibrary}>添加到资料库</div>
          )}

          <Hoverdown
            trigger={<div>添加到播放列表</div>}
            menu={
              <div>
                <div onClick={handleOpenDialog}>新建播放列表</div>
                <Dialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
                  <h3>新播放列表</h3>
                  <input className="block" type="text" placeholder="播放列表标题" />
                  <input className="block" type="text" placeholder="简介（选填）" />
                  <button>取消</button>
                  <button onClick={handleCreateClick}>创建</button>
                </Dialog>
              </div>
            }
          />
        </div>
      }
    />
  )
}

export default DropMenu
