import { Pause, Play, Repeat, Repeat1, RepeatOff, SkipBack, SkipForward } from 'lucide-react'

const Controller = ({
  song,
  handlePrevNextClick,
  handlePlayPauseClick,
  handleModeClick,
  isPlay,
  mode,
  className,
  isFullPlayer,
}) => {
  let modeIcon = null
  if (mode === 'list') modeIcon = <RepeatOff size={15} />
  if (mode === 'listLoop') modeIcon = <Repeat size={15} />
  if (mode === 'singleLoop') modeIcon = <Repeat1 size={15} />
  return (
    <div className={`flex items-center ${className}`}>
      <button onClick={() => handlePrevNextClick(-1)}>
        <SkipBack
          className={`${song.id ? '' : 'opacity-50'}`}
          fill="currentColor"
          size={isFullPlayer ? 25 : 20}
        />
      </button>
      <button onClick={handlePlayPauseClick}>
        {isPlay ? (
          <Pause fill="currentColor" size={isFullPlayer ? 30 : 20} />
        ) : (
          <Play
            className={`${song.id ? '' : 'opacity-50'}`}
            fill="currentColor"
            size={isFullPlayer ? 30 : 20}
          />
        )}
      </button>
      <button onClick={() => handlePrevNextClick(1)}>
        <SkipForward
          className={`${song.id ? '' : 'opacity-50'}`}
          fill="currentColor"
          size={isFullPlayer ? 25 : 20}
        />
      </button>
      <button onClick={handleModeClick}>{modeIcon}</button>
    </div>
  )
}

export default Controller
