import { useEffect, useMemo, useRef, useState } from 'react'
import { parseLyric } from '../utils'
import useMusicStore from '../stores/music'
import { useLyric } from '../services/music'

export default function SidebarLyric({ className }) {
  const ct = useMusicStore(state => state.ct)
  const queue = useMusicStore(state => state.queue) // 默认 []
  const index = useMusicStore(state => state.index) // 默认 0
  const song = queue[index] || {}
  const id = song?.id
  const { data: lyricData } = useLyric({ id })
  const lyric = lyricData?.lrc?.lyric || ''

  const lyrics = useMemo(() => parseLyric(lyric), [lyric])
  console.log('console: lyrics', lyric.split('\n'), lyrics)

  const hasTime = lyrics.some(line => line.time !== null)
  const [currentIndex, setCurrentIndex] = useState(hasTime ? 0 : -1)

  const lineRefs = useRef([])

  useEffect(() => {
    if (!hasTime) return
    let index = 0

    while (index + 1 < lyrics.length && ct >= lyrics[index + 1].time) {
      index++
    }

    setCurrentIndex(index)
  }, [ct, lyrics])

  useEffect(() => {
    if (!hasTime) return
    lineRefs.current[currentIndex]?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }, [currentIndex])

  return (
    <div className={`h-full p-2 ${className}`}>
      <div className="h-full overflow-y-auto scroll-smooth scrollbar-hide">
        {lyrics.map((item, index) => (
          <div
            key={index}
            ref={el => (lineRefs.current[index] = el)}
            className={`py-2 text-center transition-all ${
              index === currentIndex ? 'text-black font-bold' : 'text-gray-400'
            }`}>
            {item.text || ' '}
          </div>
        ))}
      </div>
    </div>
  )
}
