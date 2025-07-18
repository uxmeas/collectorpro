'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '../ui/Button'
import { SearchInput } from '../ui/Input'
import { cn } from '../../lib/utils'

interface NavigationProps {
  onThemeToggle?: () => void
  currentTheme?: 'light' | 'dark'
}

export function Navigation({ onThemeToggle, currentTheme }: NavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or filter dashboard
      router.push(`/dashboard?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', current: pathname.startsWith('/dashboard') },
    { name: 'Discover', href: '/discover', current: pathname.startsWith('/discover') },
    { name: 'Profile', href: '/profile/demo-wallet', current: pathname.startsWith('/profile') },
    { name: 'Platforms', href: '/platforms', current: pathname.startsWith('/platforms') },
    { name: 'Packs', href: '/packs/fresh-gems', current: pathname.startsWith('/packs') },
    { name: 'Activity', href: '/activity', current: pathname.startsWith('/activity') },
    { name: 'Browse', href: '/browse', current: pathname.startsWith('/browse') },
    { name: 'Analytics', href: '/analytics', current: pathname.startsWith('/analytics') },
    { name: 'Collections', href: '/collections', current: pathname.startsWith('/collections') },
  ]

  return (
    <nav className="bg-[var(--bg-card)] border-b border-[var(--border-primary)] sticky top-0 z-50 backdrop-blur-md">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-[var(--primary-blue)] to-[var(--secondary-purple)] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">CP</span>
              </div>
              <span className="font-bold text-lg text-[var(--text-primary)] hidden sm:block">
                CollectorPRO
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    item.current
                      ? 'text-[var(--primary-blue)] bg-[var(--primary-blue-light)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-4 hidden lg:block">
            <form onSubmit={handleSearch}>
              <SearchInput
                placeholder="Search collections, moments, players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                showClear={true}
                onClear={() => setSearchQuery('')}
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onThemeToggle}
              className="hidden sm:flex"
            >
              {currentTheme === 'dark' ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="5"/>
                  <line x1="12" y1="1" x2="12" y2="3"/>
                  <line x1="12" y1="21" x2="12" y2="23"/>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                  <line x1="1" y1="12" x2="3" y2="12"/>
                  <line x1="21" y1="12" x2="23" y2="12"/>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--error-500)] rounded-full"></span>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button variant="ghost" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-[var(--secondary-purple)] to-[var(--secondary-green)] rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">U</span>
                </div>
                <span className="hidden sm:block text-sm font-medium">User</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="hidden sm:block">
                  <polyline points="6,9 12,15 18,9"/>
                </svg>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg
                className="h-6 w-6"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-[var(--border-primary)]">
              {/* Mobile Search */}
              <div className="px-3 py-2">
                <form onSubmit={handleSearch}>
                  <SearchInput
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    showClear={true}
                    onClear={() => setSearchQuery('')}
                  />
                </form>
              </div>
              
              {/* Mobile Navigation */}
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    item.current
                      ? 'text-[var(--primary-blue)] bg-[var(--primary-blue-light)]'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {/* Mobile Theme Toggle */}
              <button
                onClick={() => {
                  onThemeToggle?.()
                  setIsMenuOpen(false)
                }}
                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
              >
                {currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
} 