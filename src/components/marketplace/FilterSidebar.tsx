'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input, SearchInput } from '../ui/Input'
import { cn } from '../../lib/utils'

interface FilterSidebarProps {
  onFiltersChange?: (filters: FilterState) => void
  className?: string
}

export interface FilterState {
  search: string
  priceMin: string
  priceMax: string
  rarity: string[]
  teams: string[]
  players: string[]
  sets: string[]
  series: string[]
  serialMin: string
  serialMax: string
  gainLossType: 'all' | 'profit' | 'loss'
  sortBy: string
  sortDirection: 'asc' | 'desc'
}

const defaultFilters: FilterState = {
  search: '',
  priceMin: '',
  priceMax: '',
  rarity: [],
  teams: [],
  players: [],
  sets: [],
  series: [],
  serialMin: '',
  serialMax: '',
  gainLossType: 'all',
  sortBy: 'currentValue',
  sortDirection: 'desc'
}

interface CollapsibleSectionProps {
  title: string
  defaultOpen?: boolean
  children: React.ReactNode
  count?: number
}

function CollapsibleSection({ title, defaultOpen = true, children, count }: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-[var(--border-primary)] last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--bg-secondary)] transition-colors"
      >
        <div className="flex items-center space-x-2">
          <span className="font-medium text-[var(--text-primary)]">{title}</span>
          {count !== undefined && (
            <span className="text-xs bg-[var(--bg-tertiary)] text-[var(--text-secondary)] px-2 py-1 rounded-full">
              {count}
            </span>
          )}
        </div>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={cn("transition-transform duration-200", isOpen && "rotate-180")}
        >
          <polyline points="6,9 12,15 18,9"/>
        </svg>
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          {children}
        </div>
      )}
    </div>
  )
}

interface CheckboxFilterProps {
  items: string[]
  selectedItems: string[]
  onSelectionChange: (items: string[]) => void
  searchable?: boolean
  showCount?: boolean
}

function CheckboxFilter({ 
  items, 
  selectedItems, 
  onSelectionChange, 
  searchable = false,
  showCount = false 
}: CheckboxFilterProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredItems = searchable
    ? items.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
    : items

  const toggleItem = (item: string) => {
    const newSelection = selectedItems.includes(item)
      ? selectedItems.filter(i => i !== item)
      : [...selectedItems, item]
    onSelectionChange(newSelection)
  }

  return (
    <div className="space-y-3">
      {searchable && (
        <SearchInput
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          showClear
          onClear={() => setSearchQuery('')}
          size="sm"
        />
      )}
      
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {filteredItems.map((item) => (
          <label
            key={item}
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={selectedItems.includes(item)}
              onChange={() => toggleItem(item)}
              className="w-4 h-4 text-[var(--primary-blue)] bg-[var(--bg-card)] border-[var(--border-secondary)] rounded focus:ring-[var(--primary-blue)] focus:ring-2"
            />
            <span className="text-sm text-[var(--text-primary)] group-hover:text-[var(--text-link)] transition-colors">
              {item}
            </span>
            {showCount && (
              <span className="text-xs text-[var(--text-tertiary)] ml-auto">
                {Math.floor(Math.random() * 100) + 1}
              </span>
            )}
          </label>
        ))}
      </div>

      {selectedItems.length > 0 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSelectionChange([])}
          className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        >
          Clear all
        </Button>
      )}
    </div>
  )
}

export function FilterSidebar({ onFiltersChange, className }: FilterSidebarProps) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const updateFilters = (updates: Partial<FilterState>) => {
    const newFilters = { ...filters, ...updates }
    setFilters(newFilters)
    onFiltersChange?.(newFilters)
  }

  const clearAllFilters = () => {
    setFilters(defaultFilters)
    onFiltersChange?.(defaultFilters)
  }

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'sortBy' || key === 'sortDirection') return false
    if (Array.isArray(value)) return value.length > 0
    return value !== '' && value !== 'all'
  })

  // Mock data - in real app, these would come from props or API
  const rarityOptions = ['COMMON', 'RARE', 'LEGENDARY', 'ULTIMATE']
  const teamOptions = ['Lakers', 'Warriors', 'Nets', 'Heat', 'Bucks', 'Celtics', 'Nuggets', 'Suns']
  const playerOptions = ['LeBron James', 'Stephen Curry', 'Kevin Durant', 'Giannis Antetokounmpo', 'Luka Dončić']
  const setOptions = ['Base Set', 'Metallic Gold LE', 'Platinum Ice', 'Championship Series']
  const seriesOptions = ['Series 1', 'Series 2', 'Series 3', 'Series 4']

  const sortOptions = [
    { value: 'currentValue', label: 'Price: High to Low' },
    { value: 'currentValue_asc', label: 'Price: Low to High' },
    { value: 'gainLoss', label: 'Profit: High to Low' },
    { value: 'gainLoss_asc', label: 'Profit: Low to High' },
    { value: 'serialNumber', label: 'Serial: Low to High' },
    { value: 'serialNumber_desc', label: 'Serial: High to Low' },
    { value: 'playerName', label: 'Player: A to Z' },
    { value: 'rarity', label: 'Rarity' }
  ]

  return (
    <Card className={cn("w-80 h-fit", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* Search */}
        <CollapsibleSection title="Search">
          <SearchInput
            placeholder="Search moments, players, teams..."
            value={filters.search}
            onChange={(e) => updateFilters({ search: e.target.value })}
            showClear
            onClear={() => updateFilters({ search: '' })}
          />
        </CollapsibleSection>

        {/* Sort */}
        <CollapsibleSection title="Sort">
          <select
            value={`${filters.sortBy}${filters.sortDirection === 'asc' ? '_asc' : ''}`}
            onChange={(e) => {
              const value = e.target.value
              const isAsc = value.endsWith('_asc')
              const sortBy = isAsc ? value.slice(0, -4) : value
              updateFilters({
                sortBy,
                sortDirection: isAsc ? 'asc' : 'desc'
              })
            }}
            className="w-full p-2 border border-[var(--border-primary)] rounded-lg bg-[var(--bg-card)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--border-focus)] focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </CollapsibleSection>

        {/* Price Range */}
        <CollapsibleSection title="Price Range">
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                value={filters.priceMin}
                onChange={(e) => updateFilters({ priceMin: e.target.value })}
                size="sm"
              />
              <Input
                placeholder="Max"
                value={filters.priceMax}
                onChange={(e) => updateFilters({ priceMax: e.target.value })}
                size="sm"
              />
            </div>
          </div>
        </CollapsibleSection>

        {/* Performance */}
        <CollapsibleSection title="Performance">
          <div className="space-y-2">
            {[
              { value: 'all', label: 'All Moments' },
              { value: 'profit', label: 'Profitable Only' },
              { value: 'loss', label: 'Loss Only' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="gainLossType"
                  value={option.value}
                  checked={filters.gainLossType === option.value}
                  onChange={(e) => updateFilters({ gainLossType: e.target.value as any })}
                  className="w-4 h-4 text-[var(--primary-blue)] bg-[var(--bg-card)] border-[var(--border-secondary)] focus:ring-[var(--primary-blue)] focus:ring-2"
                />
                <span className="text-sm text-[var(--text-primary)]">{option.label}</span>
              </label>
            ))}
          </div>
        </CollapsibleSection>

        {/* Rarity */}
        <CollapsibleSection title="Rarity" count={filters.rarity.length}>
          <CheckboxFilter
            items={rarityOptions}
            selectedItems={filters.rarity}
            onSelectionChange={(items) => updateFilters({ rarity: items })}
            showCount
          />
        </CollapsibleSection>

        {/* Teams */}
        <CollapsibleSection title="Teams" count={filters.teams.length}>
          <CheckboxFilter
            items={teamOptions}
            selectedItems={filters.teams}
            onSelectionChange={(items) => updateFilters({ teams: items })}
            searchable
            showCount
          />
        </CollapsibleSection>

        {/* Players */}
        <CollapsibleSection title="Players" count={filters.players.length}>
          <CheckboxFilter
            items={playerOptions}
            selectedItems={filters.players}
            onSelectionChange={(items) => updateFilters({ players: items })}
            searchable
            showCount
          />
        </CollapsibleSection>

        {/* Sets */}
        <CollapsibleSection title="Sets" count={filters.sets.length} defaultOpen={false}>
          <CheckboxFilter
            items={setOptions}
            selectedItems={filters.sets}
            onSelectionChange={(items) => updateFilters({ sets: items })}
            searchable
            showCount
          />
        </CollapsibleSection>

        {/* Series */}
        <CollapsibleSection title="Series" count={filters.series.length} defaultOpen={false}>
          <CheckboxFilter
            items={seriesOptions}
            selectedItems={filters.series}
            onSelectionChange={(items) => updateFilters({ series: items })}
            showCount
          />
        </CollapsibleSection>

        {/* Serial Range */}
        <CollapsibleSection title="Serial Number" defaultOpen={false}>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Input
                placeholder="Min"
                value={filters.serialMin}
                onChange={(e) => updateFilters({ serialMin: e.target.value })}
                size="sm"
              />
              <Input
                placeholder="Max"
                value={filters.serialMax}
                onChange={(e) => updateFilters({ serialMax: e.target.value })}
                size="sm"
              />
            </div>
          </div>
        </CollapsibleSection>
      </CardContent>
    </Card>
  )
} 