'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { Video } from '@/types'
import { Play, Volume2, VolumeX, Maximize2, Loader2 } from 'lucide-react'

interface VideoPlayerProps {
  video: Video
  onProgress?: (seconds: number) => void
  onEnded?: () => void
  startAt?: number
}

function YouTubePlayer({ video, onEnded }: { video: Video; onEnded?: () => void }) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const src = `${video.embed_url}?autoplay=0&rel=0&modestbranding=1&enablejsapi=1`

  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        ref={iframeRef}
        src={src}
        title={video.title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full rounded-xl"
        onEnded={onEnded}
      />
    </div>
  )
}

function VimeoPlayer({ video, onEnded }: { video: Video; onEnded?: () => void }) {
  const src = `${video.embed_url}?title=0&byline=0&portrait=0`
  return (
    <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
      <iframe
        src={src}
        title={video.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full rounded-xl"
        onEnded={onEnded}
      />
    </div>
  )
}

function NativePlayer({ video, onProgress, onEnded, startAt = 0 }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying]   = useState(false)
  const [muted, setMuted]       = useState(false)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (videoRef.current && startAt > 0) {
      videoRef.current.currentTime = startAt
    }
  }, [startAt])

  const handleTimeUpdate = useCallback(() => {
    const el = videoRef.current
    if (!el) return
    const pct = (el.currentTime / el.duration) * 100
    setProgress(pct)
    onProgress?.(Math.floor(el.currentTime))
  }, [onProgress])

  const toggle = () => {
    const el = videoRef.current
    if (!el) return
    el.paused ? el.play() : el.pause()
    setPlaying(!el.paused)
  }

  return (
    <div className="group relative overflow-hidden rounded-xl bg-black">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-950">
          <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
        </div>
      )}
      <video
        ref={videoRef}
        src={video.video_url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        onCanPlay={() => setLoading(false)}
        className="w-full rounded-xl"
        playsInline
      />
      {/* Controls overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
        <div className="mb-2 h-1 w-full cursor-pointer overflow-hidden rounded-full bg-white/20">
          <div className="h-full bg-blue-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="text-white hover:text-blue-300">
            <Play className="h-5 w-5" fill={playing ? 'white' : 'none'} />
          </button>
          <button onClick={() => { setMuted(m => !m); if (videoRef.current) videoRef.current.muted = !muted }} className="text-white hover:text-blue-300">
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
          <span className="flex-1" />
          <button onClick={() => videoRef.current?.requestFullscreen()} className="text-white hover:text-blue-300">
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function VideoPlayer({ video, onProgress, onEnded, startAt }: VideoPlayerProps) {
  if (!video) return null

  if (video.source === 'youtube') {
    return <YouTubePlayer video={video} onEnded={onEnded} />
  }
  if (video.source === 'vimeo') {
    return <VimeoPlayer video={video} onEnded={onEnded} />
  }
  return <NativePlayer video={video} onProgress={onProgress} onEnded={onEnded} startAt={startAt} />
}
