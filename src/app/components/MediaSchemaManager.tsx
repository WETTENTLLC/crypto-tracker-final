'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'

interface VideoSchema {
  '@context': 'https://schema.org'
  '@type': 'VideoObject'
  name: string
  description: string
  thumbnailUrl: string
  uploadDate: string
  duration: string
  contentUrl?: string
  embedUrl?: string
  interactionStatistic?: {
    '@type': 'InteractionCounter'
    interactionType: 'https://schema.org/WatchAction'
    userInteractionCount: number
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo: {
      '@type': 'ImageObject'
      url: string
    }
  }
}

interface PodcastSchema {
  '@context': 'https://schema.org'
  '@type': 'PodcastSeries'
  name: string
  description: string
  image: string
  url: string
  author: {
    '@type': 'Person' | 'Organization'
    name: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
  }
  webFeed: string
}

interface PodcastEpisodeSchema {
  '@context': 'https://schema.org'
  '@type': 'PodcastEpisode'
  name: string
  description: string
  url: string
  datePublished: string
  duration: string
  audio: {
    '@type': 'AudioObject'
    contentUrl: string
  }
  partOfSeries: {
    '@type': 'PodcastSeries'
    name: string
    url: string
  }
}

interface LiveStreamSchema {
  '@context': 'https://schema.org'
  '@type': 'Event'
  name: string
  description: string
  startDate: string
  endDate?: string
  eventStatus: 'https://schema.org/EventScheduled' | 'https://schema.org/EventLive' | 'https://schema.org/EventCancelled'
  eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode'
  location: {
    '@type': 'VirtualLocation'
    url: string
  }
  organizer: {
    '@type': 'Organization'
    name: string
    url: string
  }
  isLiveBroadcast: boolean
  publication?: {
    '@type': 'BroadcastEvent'
    isLiveBroadcast: boolean
    videoFormat: string
  }
}

interface MediaContent {
  type: 'video' | 'podcast' | 'podcast-episode' | 'livestream'
  id: string
  title: string
  description: string
  url: string
  thumbnailUrl?: string
  duration?: string
  publishDate?: string
  embedUrl?: string
  audioUrl?: string
  viewCount?: number
  isLive?: boolean
}

// Sample media content for demonstration
const SAMPLE_MEDIA_CONTENT: MediaContent[] = [
  {
    type: 'video',
    id: 'crypto-analysis-2025',
    title: 'Bitcoin Price Analysis 2025: What to Expect',
    description: 'Comprehensive analysis of Bitcoin price trends and predictions for 2025. Expert insights on market movements, technical analysis, and investment strategies.',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/video/crypto-analysis-2025',
    thumbnailUrl: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/thumbnails/crypto-analysis-2025.jpg',
    duration: 'PT15M30S',
    publishDate: '2025-05-25T10:00:00Z',
    embedUrl: 'https://www.youtube.com/embed/sample-video-id',
    viewCount: 15420
  },
  {
    type: 'video',
    id: 'ethereum-tutorial',
    title: 'Complete Ethereum Tutorial for Beginners',
    description: 'Learn everything about Ethereum from basics to advanced concepts. Perfect for beginners wanting to understand blockchain technology and smart contracts.',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/video/ethereum-tutorial',
    thumbnailUrl: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/thumbnails/ethereum-tutorial.jpg',
    duration: 'PT25M45S',
    publishDate: '2025-05-20T14:30:00Z',
    embedUrl: 'https://www.youtube.com/embed/ethereum-tutorial-id',
    viewCount: 8750
  },
  {
    type: 'podcast',
    id: 'crypto-insights-podcast',
    title: 'Crypto Insights Podcast',
    description: 'Weekly podcast covering cryptocurrency news, market analysis, and expert interviews. Stay informed about the latest trends in digital assets.',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/podcast/crypto-insights',
    thumbnailUrl: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/podcast/crypto-insights-cover.jpg'
  },
  {
    type: 'podcast-episode',
    id: 'episode-15-defi-revolution',
    title: 'Episode 15: The DeFi Revolution - Transforming Traditional Finance',
    description: 'Deep dive into decentralized finance (DeFi) and how it\'s revolutionizing traditional financial services. Guest: Leading DeFi protocol founder.',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/podcast/crypto-insights/episode-15',
    duration: 'PT45M20S',
    publishDate: '2025-05-22T09:00:00Z',
    audioUrl: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/audio/episode-15.mp3'
  },
  {
    type: 'livestream',
    id: 'live-market-analysis',
    title: 'Live Market Analysis: Emergency Session',
    description: 'Live analysis of current market conditions and emergency response to major cryptocurrency market movements.',
    url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/live/market-analysis',
    publishDate: '2025-05-25T16:00:00Z',
    isLive: true
  }
]

export default function MediaSchemaManager() {
  const [mediaContent] = useState<MediaContent[]>(SAMPLE_MEDIA_CONTENT)

  const generateMediaSchema = useCallback((content: MediaContent): VideoSchema | PodcastSchema | PodcastEpisodeSchema | LiveStreamSchema | null => {
    switch (content.type) {
      case 'video':
        return generateVideoSchema(content)
      case 'podcast':
        return generatePodcastSchema(content)
      case 'podcast-episode':
        return generatePodcastEpisodeSchema(content)
      case 'livestream':
        return generateLiveStreamSchema(content)
      default:
        return null
    }
  }, [])
  const generateVideoSchema = (content: MediaContent): VideoSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'VideoObject',
      name: content.title,
      description: content.description,
      thumbnailUrl: content.thumbnailUrl || 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/og-image.svg',
      uploadDate: content.publishDate || new Date().toISOString(),
      duration: content.duration || 'PT0S',
      contentUrl: content.url,
      embedUrl: content.embedUrl,
      interactionStatistic: content.viewCount ? {
        '@type': 'InteractionCounter',
        interactionType: 'https://schema.org/WatchAction',
        userInteractionCount: content.viewCount
      } : undefined,
      publisher: {
        '@type': 'Organization',
        name: 'CryptoTracker',
        logo: {
          '@type': 'ImageObject',
          url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.svg'
        }
      }    }
  }

  const generatePodcastSchema = (content: MediaContent): PodcastSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'PodcastSeries',
      name: content.title,
      description: content.description,
      image: content.thumbnailUrl || 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.svg',
      url: content.url,
      author: {
        '@type': 'Organization',
        name: 'CryptoTracker Team'
      },
      publisher: {
        '@type': 'Organization',
        name: 'CryptoTracker'
      },
      webFeed: `${content.url}/rss`
    }
  }

  const generatePodcastEpisodeSchema = (content: MediaContent): PodcastEpisodeSchema => {
    return {
      '@context': 'https://schema.org',
      '@type': 'PodcastEpisode',
      name: content.title,
      description: content.description,
      url: content.url,
      datePublished: content.publishDate || new Date().toISOString(),
      duration: content.duration || 'PT30M',
      audio: {
        '@type': 'AudioObject',
        contentUrl: content.audioUrl || content.url
      },
      partOfSeries: {
        '@type': 'PodcastSeries',
        name: 'Crypto Insights Podcast',
        url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/podcast/crypto-insights'
      }
    }
  }

  const generateLiveStreamSchema = (content: MediaContent): LiveStreamSchema => {
    const startDate = content.publishDate || new Date().toISOString()
    const endDate = content.isLive ? undefined : new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours from now

    return {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: content.title,
      description: content.description,
      startDate,
      endDate,
      eventStatus: content.isLive ? 'https://schema.org/EventLive' : 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
      location: {
        '@type': 'VirtualLocation',
        url: content.url
      },
      organizer: {
        '@type': 'Organization',
        name: 'CryptoTracker',
        url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app'
      },
      isLiveBroadcast: content.isLive || false,
      publication: {
        '@type': 'BroadcastEvent',
        isLiveBroadcast: content.isLive || false,
        videoFormat: 'HD'
      }    }
  }

  const injectSchemaMarkup = (schema: VideoSchema | PodcastSchema | PodcastEpisodeSchema | LiveStreamSchema, id: string) => {
    // Remove existing schema with same ID
    const existingScript = document.getElementById(id)
    if (existingScript) {
      existingScript.remove()
    }

    // Create and inject new schema script
    const script = document.createElement('script')
    script.id = id
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema, null, 2)
    document.head.appendChild(script)
  }

  useEffect(() => {
    // Generate and inject schema markup for all media content
    mediaContent.forEach(content => {
      const schema = generateMediaSchema(content)
      if (schema) {
        injectSchemaMarkup(schema, `media-${content.type}-${content.id}`)
      }
    })
  }, [mediaContent, generateMediaSchema])

  return null // This is a manager component, no UI
}

// Component for managing video-specific schema
export function VideoSchemaManager({ videos }: { videos: MediaContent[] }) {
  useEffect(() => {
    videos.filter(v => v.type === 'video').forEach(video => {
      const schema = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: video.description,
        thumbnailUrl: video.thumbnailUrl,
        uploadDate: video.publishDate,
        duration: video.duration,
        contentUrl: video.url,
        embedUrl: video.embedUrl,
        interactionStatistic: video.viewCount ? {
          '@type': 'InteractionCounter',
          interactionType: 'https://schema.org/WatchAction',
          userInteractionCount: video.viewCount
        } : undefined,
        publisher: {
          '@type': 'Organization',
          name: 'CryptoTracker',
          logo: {
            '@type': 'ImageObject',
            url: 'https://crypto-tracker-no-modules-befhbaldu-wettentllcs-projects.vercel.app/logo.svg'
          }
        }
      }

      const script = document.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = JSON.stringify(schema)
      document.head.appendChild(script)
    })
  }, [videos])

  return null
}

// Component for displaying media content with schema
export function MediaContentDisplay() {
  const [selectedType, setSelectedType] = useState<string>('all')
  const [mediaContent] = useState<MediaContent[]>(SAMPLE_MEDIA_CONTENT)

  const filteredContent = selectedType === 'all' 
    ? mediaContent 
    : mediaContent.filter(content => content.type === selectedType)

  const formatDuration = (duration?: string) => {
    if (!duration) return 'Unknown'
    
    // Parse ISO 8601 duration (PT15M30S)
    const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
    if (!match) return duration
    
    const hours = parseInt(match[1] || '0')
    const minutes = parseInt(match[2] || '0')
    const seconds = parseInt(match[3] || '0')
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold">Media Content Library</h3>
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border rounded-lg"
        >
          <option value="all">All Content</option>
          <option value="video">Videos</option>
          <option value="podcast">Podcasts</option>
          <option value="podcast-episode">Episodes</option>
          <option value="livestream">Live Streams</option>
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredContent.map((content) => (
          <div key={content.id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">            {content.thumbnailUrl && (
              <div className="aspect-video bg-gray-200 relative">
                <Image
                  src={content.thumbnailUrl}
                  alt={content.title}
                  fill
                  className="object-cover"
                />
                {content.isLive && (
                  <span className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 text-xs rounded">
                    LIVE
                  </span>
                )}
              </div>
            )}
            
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded capitalize">
                  {content.type.replace('-', ' ')}
                </span>
                {content.duration && (
                  <span className="text-xs text-gray-600">
                    {formatDuration(content.duration)}
                  </span>
                )}
              </div>
              
              <h4 className="font-medium mb-2 line-clamp-2">{content.title}</h4>
              <p className="text-sm text-gray-600 line-clamp-3 mb-3">{content.description}</p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                {content.publishDate && (
                  <span>{new Date(content.publishDate).toLocaleDateString()}</span>
                )}
                {content.viewCount && (
                  <span>{content.viewCount.toLocaleString()} views</span>
                )}
              </div>
              
              <a
                href={content.url}
                className="mt-3 block w-full bg-blue-600 text-white text-center py-2 rounded hover:bg-blue-700 transition-colors"
              >
                {content.type === 'livestream' && content.isLive ? 'Watch Live' : 
                 content.type === 'podcast' ? 'Listen' :
                 content.type === 'video' ? 'Watch' : 'View'}
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredContent.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No {selectedType === 'all' ? '' : selectedType} content available.
        </div>
      )}
    </div>
  )
}
