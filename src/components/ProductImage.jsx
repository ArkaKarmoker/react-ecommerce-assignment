import { useState } from 'react'

export default function ProductImage({
  src,
  alt,
  className = '',
  placeholderClassName = 'h-32 w-32 rounded-xl',
  loading = 'lazy',
}) {
  const [loadedSrc, setLoadedSrc] = useState(null)
  const isLoaded = loadedSrc === src

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      {!isLoaded && (
        <div
          aria-hidden="true"
          className={`skeleton-shimmer absolute ${placeholderClassName}`}
        />
      )}
      <img
        ref={(node) => {
          if (node && node.complete && node.naturalWidth > 0 && loadedSrc !== src) {
            setLoadedSrc(src)
          }
        }}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoadedSrc(src)}
        onError={() => setLoadedSrc(src)}
        className={`${className} transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  )
}
