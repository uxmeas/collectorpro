'use client'

import React, { useState, useEffect } from 'react'
import { Inter } from 'next/font/google'
import "./globals.css"

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-primary'
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null
    const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    const initialTheme = savedTheme || systemPreference
    
    setTheme(initialTheme)
    document.documentElement.setAttribute('data-theme', initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>CollectorPRO - Professional NBA Top Shot Analytics</title>
        <meta name="description" content="The ultimate professional-grade NBA Top Shot analytics platform for collectors, traders, and investors." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-primary antialiased">
        <div id="app-root" className="min-h-screen bg-[var(--bg-primary)]">
          {children}
        </div>
      </body>
    </html>
  )
}
