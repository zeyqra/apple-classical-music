export const msToHms = ms => {
  const totalSeconds = Math.max(0, Math.floor((ms ?? 0) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const paddedSeconds = String(seconds).padStart(2, '0')

  if (hours === 0) return `${minutes}:${paddedSeconds}`
  return `${hours}:${minutes}:${paddedSeconds}`
}
