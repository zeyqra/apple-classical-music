const VolBar = ({ value, onChange, className }) => {
  return (
    <div className={`flex gap-1 ${className}`}>
      VOL
      <input
        className={`flex-1 min-w-0`}
        // style={{
        //   background: `linear-gradient(
        //     to right,
        //     #000 0%,
        //     #000 ${value * 100}%,
        //     #d1d5db ${value * 100}%,
        //     #d1d5db 100%
        //   )`,
        // }}
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={value}
        onChange={onChange}
      />
    </div>
  )
}

export default VolBar
