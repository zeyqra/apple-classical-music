import { useParams } from 'react-router-dom'
import {
  album,
  useAlbum,
  useAlbumDetailDynamic,
  useAlbumSub,
  useLike,
  useLikeList,
} from '../services/music'
import { addSongToQueue, msToHms } from '../utils'
import useMusicStore from '../stores/music'
import Dropdown from '../libs/Dropdown'
import { ChartNoAxesColumn, Check, Ellipsis, Play, Plus, Star } from 'lucide-react'
import Loading from '../libs/Loading'
import ImgLazy from '../components/ImgLazy'
import Dialog from '../libs/Dialog'
import { useState } from 'react'
import { useQuery } from '../hooks/useQuery'

const Album = () => {
  const { id } = useParams()
  const { result = { title: '', recordings: [] }, isLoading, error } = useQuery(album, { id })

  if (isLoading) return 'Loading...'
  return (
    <div>
      <div>{result?.title}</div>
      <div>
        {result?.recordings?.map(rcd => (
          <div>
            <div>
              <p>
                {rcd.composer_name}: {rcd.work_title}
              </p>
              <p>
                {Object.entries(rcd.performers)
                  .map(([role, pfs]) => pfs.map(pf => pf.name).join(' / '))
                  .join(' / ')}
              </p>
            </div>
            <div>
              {rcd.rmovements.map(({ id, title }) => (
                <div key={id}>{title}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Album
