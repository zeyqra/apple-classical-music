import { useState } from 'react'

const Image = ({ src, className, alt, width, height }) => {
  const [isLoaded, setIsLoaded] = useState(false)
  return (
    <div className={`bg-zinc-100 overflow-hidden ${className}`}>
      <img
        src={src}
        className={`w-full h-full object-cover transition-all duration-300 ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-md'}`}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  )
}

export default Image
