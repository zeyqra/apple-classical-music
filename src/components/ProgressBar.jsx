const ProgressBar = ({
  value,
  max,
  displayCt,
  displayRestDt,
  onChange,
  onPointerDown,
  onPointerUp,
  isFullPlayer = false,
  className,
}) => {
  return (
    <div className={`relative ${className}`}>
      <span className="absolute left-0 bottom-4">{displayCt}</span>
      <input
        className="w-full"
        type="range"
        min="0"
        max={max ?? 0}
        step="0.1"
        value={value}
        onChange={onChange}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        // style={{
        //   background: `linear-gradient(
        //     to right,
        //     #000 0%,
        //     #000 ${(value / max) * 100}%,
        //     #d1d5db ${(value / max) * 100}%,
        //     #d1d5db 100%
        //   )`,
        // }}
      />
      <span className="absolute right-0 bottom-4">{displayRestDt}</span>
      {/* {isFullPlayer && (
        <div className="flex justify-between text-xs text-zinc-500">
          <span>{displayCt}</span>
          <span>{displayRestDt}</span>
        </div>
      )} */}
    </div>
  )
}

export default ProgressBar
