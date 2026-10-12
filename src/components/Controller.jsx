import { Pause, Play, Repeat, Repeat1, RepeatOff, SkipBack, SkipForward } from 'lucide-react'

const Controller = ({
  song,
  handlePrevNextClick,
  handlePlayPauseClick,
  handleModeClick,
  isPlay,
  mode,
  className,
}) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      <button onClick={() => handlePrevNextClick(-1)}>BACK</button>
      <button onClick={handlePlayPauseClick}>{isPlay ? 'PAUSE' : 'PLAY'}</button>
      <button onClick={() => handlePrevNextClick(1)}>NEXT</button>
      <button onClick={handleModeClick}>{mode}</button>
    </div>
  )
}

export default Controller
