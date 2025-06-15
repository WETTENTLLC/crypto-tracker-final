import { NextRequest, NextResponse } from 'next/server';
import { getSourceHealthStatus } from '../../../../lib/multiSourceCryptoService';

export async function GET(request: NextRequest) {
  try {
    const healthStatus = getSourceHealthStatus();
    
    // Calculate overall health score
    const sources = Object.values(healthStatus);
    const healthySources = sources.filter(source => source.isHealthy && source.enabled);
    const totalSources = sources.filter(source => source.enabled);
    const healthScore = totalSources.length > 0 ? (healthySources.length / totalSources.length) * 100 : 0;
    
    // Get current active source
    const activeSources = sources
      .filter(source => source.isHealthy && source.enabled)
      .sort((a, b) => a.priority - b.priority);
    
    const response = {
      success: true,
      data: {
        overall: {
          healthScore: Math.round(healthScore),
          activeSources: healthySources.length,
          totalSources: totalSources.length,
          primarySource: activeSources[0]?.name || 'None available'
        },
        sources: healthStatus,
        recommendations: generateRecommendations(healthStatus)
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

function generateRecommendations(healthStatus: Record<string, any>): string[] {
  const recommendations: string[] = [];
  
  const sources = Object.entries(healthStatus);
  const unhealthySources = sources.filter(([, status]) => !status.isHealthy && status.enabled);
  const healthySources = sources.filter(([, status]) => status.isHealthy && status.enabled);
  
  if (unhealthySources.length > 0) {
    recommendations.push(`${unhealthySources.length} source(s) are currently unhealthy: ${unhealthySources.map(([name]) => name).join(', ')}`);
  }
  
  if (healthySources.length === 1) {
    recommendations.push('Only one data source is available. Consider checking API keys and rate limits.');
  }
  
  if (healthySources.length === 0) {
    recommendations.push('⚠️ CRITICAL: No cryptocurrency data sources are available! Check API connectivity.');
  } else if (healthySources.length >= 3) {
    recommendations.push('✅ Multiple redundant data sources are available.');
  }
  
  // Check for high error counts
  sources.forEach(([name, status]) => {
    if (status.errors > 5) {
      recommendations.push(`Source ${name} has ${status.errors} recent errors. Consider investigating.`);
    }
  });
  
  return recommendations;
}
