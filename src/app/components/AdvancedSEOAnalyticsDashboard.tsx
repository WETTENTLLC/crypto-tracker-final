'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'

interface SEOMetrics {
  overallScore: number
  technicalSEO: number
  contentQuality: number
  userExperience: number
  socialSignals: number
  backlinks: number
  pagespeed: number
  mobileOptimization: number
}

interface SEORecommendation {
  type: 'critical' | 'important' | 'minor'
  category: string
  issue: string
  solution: string
  impact: 'high' | 'medium' | 'low'
  effort: 'easy' | 'medium' | 'hard'
}

interface CompetitorAnalysis {
  competitor: string
  domain: string
  seoScore: number
  backlinks: number
  organicKeywords: number
  monthlyTraffic: number
}

export default function AdvancedSEOAnalyticsDashboard() {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const [seoMetrics, setSeoMetrics] = useState<SEOMetrics | null>(null)
  const [recommendations, setRecommendations] = useState<SEORecommendation[]>([])
  const [competitors, setCompetitors] = useState<CompetitorAnalysis[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'technical' | 'content' | 'competitors'>('overview')

  const analyzeTechnicalSEO = (): number => {
    let score = 100
    
    // Check meta tags
    if (!document.querySelector('meta[name="description"]')) score -= 15
    if (!document.querySelector('title')) score -= 15
    if (!document.querySelector('link[rel="canonical"]')) score -= 10
    
    // Check structured data
    if (!document.querySelector('script[type="application/ld+json"]')) score -= 10
    
    // Check heading structure
    const h1Tags = document.querySelectorAll('h1')
    if (h1Tags.length !== 1) score -= 10
    
    // Check images
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])')
    score -= Math.min(imagesWithoutAlt.length * 2, 20)
    
    return Math.max(0, score)
  }

  const analyzeContentQuality = (): number => {
    const content = document.body.textContent || ''
    const wordCount = content.split(/\s+/).length
    
    let score = 50
    
    // Word count scoring
    if (wordCount > 300) score += 20
    if (wordCount > 1000) score += 15
    if (wordCount > 2000) score += 10
    
    // Keyword relevance
    const cryptoKeywords = ['cryptocurrency', 'bitcoin', 'ethereum', 'blockchain', 'crypto', 'digital', 'asset']
    const keywordMatches = cryptoKeywords.filter(keyword => 
      content.toLowerCase().includes(keyword)
    ).length
    
    score += Math.min(keywordMatches * 3, 15)
    
    // Internal links
    const internalLinks = document.querySelectorAll('a[href^="/"]').length
    score += Math.min(internalLinks * 2, 10)
    
    return Math.min(100, score)
  }

  const analyzeUserExperience = (): number => {
    let score = 80
    
    // Check for interactive elements
    const buttons = document.querySelectorAll('button, input[type="submit"]').length
    score += Math.min(buttons * 2, 10)
    
    // Check for forms
    const forms = document.querySelectorAll('form').length
    score += Math.min(forms * 5, 10)
    
    // Check navigation
    const navLinks = document.querySelectorAll('nav a').length
    score += Math.min(navLinks, 10)
    
    return Math.min(100, score)
  }

  const analyzeSocialSignals = (): number => {
    let score = 60
    
    // Check Open Graph tags
    const ogTags = ['og:title', 'og:description', 'og:image', 'og:url']
    const ogTagsPresent = ogTags.filter(tag => 
      document.querySelector(`meta[property="${tag}"]`)
    ).length
    
    score += ogTagsPresent * 5
    
    // Check Twitter Card tags
    const twitterTags = ['twitter:card', 'twitter:title', 'twitter:description']
    const twitterTagsPresent = twitterTags.filter(tag =>
      document.querySelector(`meta[name="${tag}"]`)
    ).length
    
    score += twitterTagsPresent * 3

    return Math.min(100, score)
  }

  const analyzePageSpeed = (): number => {
    // Simulate page speed analysis
    const performanceScore = performance.now() < 3000 ? 90 : 
                           performance.now() < 5000 ? 75 : 60
    
    // Check for optimization indicators
    const lazyImages = document.querySelectorAll('img[loading="lazy"]').length
    const totalImages = document.querySelectorAll('img').length
    
    const lazyLoadingScore = totalImages > 0 ? (lazyImages / totalImages) * 10 : 10
    
    return Math.min(100, performanceScore + lazyLoadingScore)
  }

  const analyzeMobileOptimization = (): number => {
    let score = 70
    
    // Check viewport meta tag
    const viewport = document.querySelector('meta[name="viewport"]')
    if (viewport) score += 15
    
    // Check for responsive design indicators
    const mediaQueries = Array.from(document.styleSheets).some(sheet => {
      try {
        return Array.from(sheet.cssRules).some(rule => 
          rule.cssText.includes('@media')
        )
      } catch {
        return false
      }
    })
    
    if (mediaQueries) score += 10
    
    // Check touch-friendly elements
    const touchTargets = document.querySelectorAll('button, a, input').length
    score += Math.min(touchTargets, 5)
    
    return Math.min(100, score)
  }

  const calculateSEOMetrics = useCallback(async (): Promise<SEOMetrics> => {
    // Technical SEO analysis
    const technicalSEO = analyzeTechnicalSEO()
    
    // Content quality analysis
    const contentQuality = analyzeContentQuality()
    
    // User experience analysis
    const userExperience = analyzeUserExperience()
    
    // Social signals analysis
    const socialSignals = analyzeSocialSignals()

    // Backlinks analysis (simulated)
    const backlinks = Math.floor(Math.random() * 100) + 50
    
    // Page speed analysis
    const pagespeed = analyzePageSpeed()
    
    // Mobile optimization analysis
    const mobileOptimization = analyzeMobileOptimization()

    // Calculate overall score
    const overallScore = Math.round(
      (technicalSEO + contentQuality + userExperience + socialSignals + 
       backlinks + pagespeed + mobileOptimization) / 7
    )

    return {
      overallScore,
      technicalSEO,
      contentQuality,
      userExperience,
      socialSignals,
      backlinks,
      pagespeed,
      mobileOptimization
    }
  }, [])

  const generateRecommendations = useCallback(async (metrics: SEOMetrics): Promise<SEORecommendation[]> => {
    const recommendations: SEORecommendation[] = []

    // Technical SEO recommendations
    if (metrics.technicalSEO < 90) {
      if (!document.querySelector('meta[name="description"]')) {
        recommendations.push({
          type: 'critical',
          category: 'Technical SEO',
          issue: 'Missing meta description',
          solution: 'Add a compelling meta description (150-160 characters)',
          impact: 'high',
          effort: 'easy'
        })
      }

      if (!document.querySelector('link[rel="canonical"]')) {
        recommendations.push({
          type: 'important',
          category: 'Technical SEO',
          issue: 'Missing canonical URL',
          solution: 'Add canonical link tag to prevent duplicate content issues',
          impact: 'medium',
          effort: 'easy'
        })
      }

      const h1Tags = document.querySelectorAll('h1')
      if (h1Tags.length !== 1) {
        recommendations.push({
          type: 'important',
          category: 'Technical SEO',
          issue: `Incorrect H1 structure (${h1Tags.length} H1 tags)`,
          solution: 'Use exactly one H1 tag per page',
          impact: 'medium',
          effort: 'easy'
        })
      }
    }

    // Content recommendations
    if (metrics.contentQuality < 80) {
      const wordCount = (document.body.textContent || '').split(/\s+/).length
      if (wordCount < 300) {
        recommendations.push({
          type: 'critical',
          category: 'Content Quality',
          issue: 'Content too short',
          solution: 'Expand content to at least 300 words for better SEO',
          impact: 'high',
          effort: 'medium'
        })
      }

      const internalLinks = document.querySelectorAll('a[href^="/"]').length
      if (internalLinks < 3) {
        recommendations.push({
          type: 'important',
          category: 'Content Quality',
          issue: 'Insufficient internal linking',
          solution: 'Add more internal links to related content',
          impact: 'medium',
          effort: 'easy'
        })
      }
    }

    // Performance recommendations
    if (metrics.pagespeed < 85) {
      const imagesWithoutLazy = document.querySelectorAll('img:not([loading="lazy"])').length
      if (imagesWithoutLazy > 0) {
        recommendations.push({
          type: 'important',
          category: 'Performance',
          issue: 'Images not optimized for lazy loading',
          solution: 'Add loading="lazy" attribute to images',
          impact: 'medium',
          effort: 'easy'
        })
      }
    }

    return recommendations
  }, [])
  const analyzeCompetitors = useCallback(async (): Promise<CompetitorAnalysis[]> => {
    // Simulated competitor data for cryptocurrency tracking platforms
    return [
      {
        competitor: 'CoinMarketCap',
        domain: 'coinmarketcap.com',
        seoScore: 95,
        backlinks: 892000,
        organicKeywords: 156000,
        monthlyTraffic: 89000000
      },
      {
        competitor: 'CoinGecko',
        domain: 'coingecko.com',
        seoScore: 92,
        backlinks: 445000,
        organicKeywords: 98000,
        monthlyTraffic: 34000000
      },
      {
        competitor: 'CoinDesk',
        domain: 'coindesk.com',
        seoScore: 88,
        backlinks: 234000,
        organicKeywords: 67000,
        monthlyTraffic: 12000000
      },
      {
        competitor: 'Blockfolio',
        domain: 'blockfolio.com',
        seoScore: 75,
        backlinks: 45000,
        organicKeywords: 23000,
        monthlyTraffic: 2100000
      }
    ]
  }, [])

  const performComprehensiveAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    try {
      const metrics = await calculateSEOMetrics()
      setSeoMetrics(metrics)
      
      const recs = await generateRecommendations(metrics)
      setRecommendations(recs)
      
      const competitorData = await analyzeCompetitors()
      setCompetitors(competitorData)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }, [calculateSEOMetrics, generateRecommendations, analyzeCompetitors])

  useEffect(() => {
    // Listen for keyboard shortcut to toggle dashboard
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setIsVisible(prev => !prev)
        if (!isVisible) {
          performComprehensiveAnalysis()
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isVisible, performComprehensiveAnalysis])

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600'
    if (score >= 75) return 'text-yellow-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getScoreBackground = (score: number): string => {
    if (score >= 90) return 'bg-green-100'
    if (score >= 75) return 'bg-yellow-100'
    if (score >= 60) return 'bg-orange-100'
    return 'bg-red-100'
  }

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => {
            setIsVisible(true)
            performComprehensiveAnalysis()
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          SEO Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Advanced SEO Analytics Dashboard</h2>
              <p className="text-blue-100 mt-1">Comprehensive SEO analysis for {pathname}</p>
            </div>
            <button
              onClick={() => setIsVisible(false)}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b">
          <nav className="flex space-x-1 p-4">
            {[
              { id: 'overview', label: 'Overview' },
              { id: 'technical', label: 'Technical SEO' },
              { id: 'content', label: 'Content' },
              { id: 'competitors', label: 'Competitors' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'technical' | 'content' | 'competitors')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {isAnalyzing ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Performing comprehensive SEO analysis...</p>
            </div>
          ) : (
            <>
              {/* Overview Tab */}
              {activeTab === 'overview' && seoMetrics && (
                <div className="space-y-6">
                  {/* Overall Score */}
                  <div className="text-center">
                    <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-3xl font-bold ${getScoreBackground(seoMetrics.overallScore)} ${getScoreColor(seoMetrics.overallScore)}`}>
                      {seoMetrics.overallScore}
                    </div>
                    <h3 className="text-xl font-semibold mt-2">Overall SEO Score</h3>
                  </div>

                  {/* Metrics Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Technical SEO', value: seoMetrics.technicalSEO },
                      { label: 'Content Quality', value: seoMetrics.contentQuality },
                      { label: 'User Experience', value: seoMetrics.userExperience },
                      { label: 'Social Signals', value: seoMetrics.socialSignals },
                      { label: 'Page Speed', value: seoMetrics.pagespeed },
                      { label: 'Mobile Optimization', value: seoMetrics.mobileOptimization },
                      { label: 'Backlinks Score', value: seoMetrics.backlinks },
                    ].map(metric => (
                      <div key={metric.label} className="bg-gray-50 p-4 rounded-lg">
                        <div className={`text-2xl font-bold ${getScoreColor(metric.value)}`}>
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-600">{metric.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Top Recommendations */}
                  <div>
                    <h4 className="text-lg font-semibold mb-3">Priority Recommendations</h4>
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((rec, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                rec.type === 'critical' ? 'bg-red-100 text-red-800' :
                                rec.type === 'important' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {rec.type.toUpperCase()}
                              </span>
                              <h5 className="font-medium mt-1">{rec.issue}</h5>
                              <p className="text-sm text-gray-600">{rec.solution}</p>
                            </div>
                            <div className="text-right text-xs text-gray-500">
                              <div>Impact: {rec.impact}</div>
                              <div>Effort: {rec.effort}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Technical Tab */}
              {activeTab === 'technical' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Technical SEO Analysis</h3>
                  {recommendations.filter(rec => rec.category === 'Technical SEO').map((rec, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">{rec.issue}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.solution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Content Tab */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Content Analysis</h3>
                  {recommendations.filter(rec => rec.category === 'Content Quality').map((rec, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium">{rec.issue}</h4>
                      <p className="text-sm text-gray-600 mt-1">{rec.solution}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Competitors Tab */}
              {activeTab === 'competitors' && (
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold">Competitor Analysis</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left p-3">Competitor</th>
                          <th className="text-left p-3">SEO Score</th>
                          <th className="text-left p-3">Backlinks</th>
                          <th className="text-left p-3">Keywords</th>
                          <th className="text-left p-3">Monthly Traffic</th>
                        </tr>
                      </thead>
                      <tbody>
                        {competitors.map((comp, index) => (
                          <tr key={index} className="border-b">
                            <td className="p-3 font-medium">{comp.competitor}</td>
                            <td className={`p-3 ${getScoreColor(comp.seoScore)}`}>{comp.seoScore}</td>
                            <td className="p-3">{comp.backlinks.toLocaleString()}</td>
                            <td className="p-3">{comp.organicKeywords.toLocaleString()}</td>
                            <td className="p-3">{comp.monthlyTraffic.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            Press Ctrl+Shift+A to toggle this dashboard
          </div>
          <div className="flex space-x-2">
            <button
              onClick={performComprehensiveAnalysis}
              disabled={isAnalyzing}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}
            </button>
            <button
              onClick={() => setIsVisible(false)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
