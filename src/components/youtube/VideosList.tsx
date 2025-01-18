import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ExternalLink } from 'lucide-react'

interface Video {
  videoId: string
  title: string
  publishedAt: string
  viewCount: number
  duration: string
  thumbnailUrl: string
}

interface VideosListProps {
  videos: Video[]
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffInDays === 0) return 'Hoje'
  if (diffInDays === 1) return 'Ontem'
  if (diffInDays < 7) return `${diffInDays} dias atrás`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} semanas atrás`
  return `${Math.floor(diffInDays / 30)} meses atrás`
}

export function VideosList({ videos }: VideosListProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">Vídeos Recentes</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {videos.map((video) => (
            <div 
              key={video.videoId} 
              className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer group"
              onClick={() => window.open(`https://youtube.com/watch?v=${video.videoId}`, '_blank')}
            >
              <div className="w-32 h-20 bg-gray-200 rounded-md overflow-hidden relative flex-shrink-0">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-black/75 text-white text-xs px-1.5 py-0.5 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium truncate">{video.title}</h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                </div>
                <p className="text-sm text-gray-500">
                  {video.viewCount.toLocaleString()} visualizações • {formatTimeAgo(video.publishedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}