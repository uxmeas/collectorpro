import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ width: string; height: string }> }
) {
  try {
    const { width, height } = await params
    const w = parseInt(width) || 200
    const h = parseInt(height) || 200
    
    // Use picsum.photos for safe, high-quality placeholder images
    const placeholderUrl = `https://picsum.photos/${w}/${h}?random=${Math.floor(Math.random() * 1000)}`
    
    // Fetch the image and return it
    const response = await fetch(placeholderUrl)
    const imageBuffer = await response.arrayBuffer()
    
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (error) {
    console.error('Placeholder image error:', error)
    
    // Fallback to a simple colored rectangle
    const resolvedParams = await params
    const svg = `
      <svg width="${resolvedParams.width}" height="${resolvedParams.height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#374151"/>
        <text x="50%" y="50%" font-family="Arial" font-size="12" fill="#9CA3AF" text-anchor="middle" dy=".3em">
          ${resolvedParams.width}x${resolvedParams.height}
        </text>
      </svg>
    `
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600',
      },
    })
  }
} 