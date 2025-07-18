'use client'

import React from 'react'
import { ExternalLink, AlertTriangle } from 'lucide-react'

interface LegalDisclaimerProps {
  variant?: 'compact' | 'full' | 'footer'
  className?: string
}

export function LegalDisclaimer({ variant = 'full', className = '' }: LegalDisclaimerProps) {
  const compactContent = (
    <div className="text-xs text-gray-400 flex items-center gap-1">
      <AlertTriangle className="w-3 h-3" />
      <span>Placeholder images for demo purposes</span>
    </div>
  )

  const fullContent = (
    <div className="text-sm text-gray-400 space-y-2">
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="font-medium text-gray-300 mb-1">Fair Use Notice</p>
          <p className="text-xs leading-relaxed">
            NBA TopShot moment images are used for identification and educational purposes only. 
            CollectorPRO is an analytics and tracking platform, not a competing marketplace. 
            Images are displayed under fair use doctrine for transformative purposes. 
            For authentic NBA TopShot moments, visit{' '}
            <a 
              href="https://nbatopshot.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-400 hover:underline inline-flex items-center gap-1"
            >
              nbatopshot.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>
        </div>
      </div>
    </div>
  )

  const footerContent = (
    <div className="text-xs text-gray-500 space-y-1">
      <p>
        <strong>Fair Use Disclaimer:</strong> NBA TopShot moment images are used for identification and educational purposes only. 
        NBA TopShot is a trademark of Dapper Labs. NBA and related marks are trademarks of NBA Properties, Inc.
      </p>
      <p>
        CollectorPRO is an analytics and tracking platform, not a competing marketplace. 
        Images are displayed under fair use doctrine for transformative purposes.
      </p>
    </div>
  )

  const content = {
    compact: compactContent,
    full: fullContent,
    footer: footerContent
  }

  const containerClasses = {
    compact: 'p-2 bg-gray-900/30 rounded border border-gray-700/50',
    full: 'p-4 bg-gray-900/50 rounded-lg border border-gray-700/50',
    footer: 'p-3 bg-gray-900/30 rounded border-t border-gray-700/50'
  }

  return (
    <div className={`${containerClasses[variant]} ${className}`}>
      {content[variant]}
    </div>
  )
}

// Specialized disclaimers for different contexts
export function MarketplaceDisclaimer() {
  return (
    <LegalDisclaimer 
      variant="full" 
      className="mb-6"
    />
  )
}

export function PortfolioDisclaimer() {
  return (
    <LegalDisclaimer 
      variant="compact" 
      className="mb-4"
    />
  )
}

export function FooterDisclaimer() {
  return (
    <LegalDisclaimer 
      variant="footer" 
      className="mt-8"
    />
  )
}

// Inline disclaimer for tables
export function InlineDisclaimer() {
  return (
    <div className="text-xs text-gray-500 italic">
      * Placeholder images for demonstration purposes
    </div>
  )
} 