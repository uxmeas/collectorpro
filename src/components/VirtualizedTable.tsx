'use client'

import React, { useMemo } from 'react'
import { NBATopShotMoment } from '@/lib/nba-topshot-types'

interface VirtualizedTableProps {
  moments: NBATopShotMoment[]
  viewMode: 'grid' | 'list'
  sortBy: string
  sortDirection: 'asc' | 'desc'
  onSort: (field: string) => void
}

export const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  moments,
  viewMode,
  sortBy,
  sortDirection,
  onSort
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`
  }

  const calculateROI = (moment: NBATopShotMoment) => {
    if (!moment.purchasePrice || moment.purchasePrice === 0) return 0
    return ((moment.currentValue - moment.purchasePrice) / moment.purchasePrice) * 100
  }

  const SortButton = ({ field, children }: { field: string; children: React.ReactNode }) => (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1 text-left font-medium text-gray-300 hover:text-white transition-colors"
    >
      {children}
      {sortBy === field && (
        <span className="text-[#FDB927]">
          {sortDirection === 'asc' ? '↑' : '↓'}
        </span>
      )}
    </button>
  )

  const MomentRow = React.memo(({ moment, index }: { moment: NBATopShotMoment; index: number }) => {
    const roi = calculateROI(moment)
    return (
      <tr className={`${index % 2 === 0 ? 'bg-[#1E2124]' : 'bg-[#23272A]'} hover:bg-[#2C2F33] transition-colors`}>
        <td className="px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FDB927] to-[#E09F0F] rounded-lg flex items-center justify-center text-black font-bold text-sm">
              #{moment.serialNumber}
            </div>
            <div>
              <div className="font-medium text-white">{moment.playerName}</div>
              <div className="text-sm text-gray-400">{moment.teamName}</div>
            </div>
          </div>
        </td>
        <td className="px-4 py-3">
          <div>
            <div className="text-white">{moment.set}</div>
            <div className="text-sm text-gray-400">{moment.series}</div>
          </div>
        </td>
        <td className="px-4 py-3">
          <span className={`px-2 py-1 rounded text-xs font-medium ${
            moment.rarity === 'LEGENDARY' ? 'bg-purple-500/20 text-purple-400' :
            moment.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
            'bg-gray-500/20 text-gray-400'
          }`}>
            {moment.rarity}
          </span>
        </td>
        <td className="px-4 py-3 text-white">{formatCurrency(moment.currentValue)}</td>
        <td className="px-4 py-3">
          <span className={`font-medium ${
            roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : 'text-gray-400'
          }`}>
            {formatPercentage(roi)}
          </span>
        </td>
        <td className="px-4 py-3 text-gray-300">{formatCurrency(moment.floorPrice)}</td>
        <td className="px-4 py-3 text-gray-300">#{moment.serialNumber}/{moment.totalCirculation}</td>
      </tr>
    )
  })

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {moments.map((moment) => {
          const roi = calculateROI(moment)
          return (
            <div key={moment.id} className="bg-[#23272A] rounded-lg p-4 hover:bg-[#2C2F33] transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-[#FDB927] to-[#E09F0F] rounded text-black font-bold text-xs flex items-center justify-center">
                    #{moment.serialNumber}
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    moment.rarity === 'LEGENDARY' ? 'bg-purple-500/20 text-purple-400' :
                    moment.rarity === 'RARE' ? 'bg-blue-500/20 text-blue-400' :
                    'bg-gray-500/20 text-gray-400'
                  }`}>
                    {moment.rarity}
                  </span>
                </div>
              </div>
              <div className="mb-2">
                <div className="font-medium text-white">{moment.playerName}</div>
                <div className="text-sm text-gray-400">{moment.teamName}</div>
              </div>
              <div className="mb-2">
                <div className="text-sm text-gray-300">{moment.set}</div>
                <div className="text-xs text-gray-500">{moment.series}</div>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-white font-medium">{formatCurrency(moment.currentValue)}</div>
                <div className={`text-sm font-medium ${
                  roi > 0 ? 'text-green-400' : roi < 0 ? 'text-red-400' : 'text-gray-400'
                }`}>
                  {formatPercentage(roi)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-[#2C2F33] sticky top-0">
          <tr>
            <th className="px-4 py-3 text-left">
              <SortButton field="playerName">Player</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="set">Set</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="rarity">Rarity</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="currentValue">Value</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="roi">ROI</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="floorPrice">Floor</SortButton>
            </th>
            <th className="px-4 py-3 text-left">
              <SortButton field="serialNumber">Serial</SortButton>
            </th>
          </tr>
        </thead>
        <tbody>
          {moments.map((moment, index) => (
            <MomentRow key={moment.id} moment={moment} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
} 