import { ColumnDef } from '@tanstack/react-table'
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react'
import { 
  PriceCell, 
  NumberCell, 
  BadgeCell, 
  MomentCell, 
  ActionsCell
} from '../TableCells'
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"

// NBA TopShot Moment interface for marketplace activity
export interface NBATopShotMoment {
  id: string
  playerName: string
  playDescription: string
  setName: string
  series: string
  rarity: 'Common' | 'Rare' | 'Legendary' | 'Ultimate'
  circulation: number
  serialNumber: number
  supply: number
  lowAsk: number
  highestOffer: number
  owned: number
  inPacks: number
  burned: number
  locked: number
  listed: number
  sales: number
  playerImage: string
  teamName: string
  lastSalePrice?: number
  priceChange?: number
}

// Pack Activity interface
export interface PackActivity {
  id: string
  packName: string
  series: string
  price: number
  momentsCount: number
  rarity: 'Standard' | 'Premium' | 'Ultimate'
  openedBy: string
  timestamp: Date
  contents: string[]
  packImage: string
}

// Activity marketplace table columns for TanStack Table v8
export const activityTableColumns: ColumnDef<NBATopShotMoment>[] = [
  {
    id: 'moment',
    header: 'MOMENT',
    accessorKey: 'playerName',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
          <img 
            src={row.original.playerImage}
            alt={row.original.playerName}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/api/placeholder/48/48'
            }}
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium text-sm">
            {row.original.playerName}
          </div>
          <div className="text-gray-400 text-xs">
            {row.original.playDescription}
          </div>
        </div>
      </div>
    ),
    size: 250,
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return rowA.original.playerName.localeCompare(rowB.original.playerName)
    }
  },
  {
    id: 'supply',
    header: 'SUPPLY',
    accessorKey: 'supply',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.supply.toLocaleString()}
      </span>
    ),
    size: 80,
    enableSorting: true,
  },
  {
    id: 'lowAsk',
    header: 'LOW ASK',
    accessorKey: 'lowAsk',
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        <span className="text-green-400 font-bold text-sm">
          ${row.original.lowAsk.toFixed(2)}
        </span>
        {row.original.priceChange && (
          <span className={`text-xs ${
            row.original.priceChange > 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {row.original.priceChange > 0 ? '↗' : '↘'}
          </span>
        )}
      </div>
    ),
    size: 100,
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return rowA.original.lowAsk - rowB.original.lowAsk
    }
  },
  {
    id: 'highestOffer',
    header: 'HIGHEST OFFER',
    accessorKey: 'highestOffer',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        ${row.original.highestOffer.toFixed(2)}
      </span>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    id: 'owned',
    header: 'OWNED',
    accessorKey: 'owned',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.owned}
      </span>
    ),
    size: 80,
    enableSorting: true,
  },
  {
    id: 'inPacks',
    header: 'IN PACKS',
    accessorKey: 'inPacks',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.inPacks.toLocaleString()}
      </span>
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'burned',
    header: 'BURNED',
    accessorKey: 'burned',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.burned}
      </span>
    ),
    size: 80,
    enableSorting: true,
  },
  {
    id: 'locked',
    header: 'LOCKED',
    accessorKey: 'locked',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.locked}
      </span>
    ),
    size: 80,
    enableSorting: true,
  },
  {
    id: 'listed',
    header: 'LISTED',
    accessorKey: 'listed',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.listed}
      </span>
    ),
    size: 80,
    enableSorting: true,
  },
  {
    id: 'sales',
    header: 'SALES',
    accessorKey: 'sales',
    cell: ({ row }) => (
      <span className="text-white text-sm font-mono">
        {row.original.sales}
      </span>
    ),
    size: 80,
    enableSorting: true,
  },
  {
    id: 'actions',
    header: 'ACTION',
    cell: ({ row }) => (
      <Button 
        size="sm" 
        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1"
      >
        BUY NOW
      </Button>
    ),
    size: 120,
    enableSorting: false,
  }
]

// Pack activity table columns
export const packActivityColumns: ColumnDef<PackActivity>[] = [
  {
    id: 'pack',
    header: 'PACK',
    accessorKey: 'packName',
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
          <img 
            src={row.original.packImage}
            alt={row.original.packName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-white font-medium text-sm">
            {row.original.packName}
          </div>
          <div className="text-gray-400 text-xs">
            {row.original.series}
          </div>
        </div>
      </div>
    ),
    size: 250,
    enableSorting: true,
  },
  {
    id: 'price',
    header: 'PRICE',
    accessorKey: 'price',
    cell: ({ row }) => (
      <span className="text-green-400 font-bold text-sm">
        ${row.original.price.toFixed(2)}
      </span>
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'momentsCount',
    header: 'MOMENTS',
    accessorKey: 'momentsCount',
    cell: ({ row }) => (
      <span className="text-white text-sm">{row.original.momentsCount}</span>
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'rarity',
    header: 'RARITY',
    accessorKey: 'rarity',
    cell: ({ row }) => (
      <Badge 
        variant={
          row.original.rarity === 'Ultimate' ? 'default' :
          row.original.rarity === 'Premium' ? 'secondary' : 'outline'
        }
        className={`
          ${row.original.rarity === 'Ultimate' ? 'bg-purple-600 text-white' : ''}
          ${row.original.rarity === 'Premium' ? 'bg-yellow-600 text-white' : ''}
          ${row.original.rarity === 'Standard' ? 'bg-gray-600 text-white' : ''}
        `}
      >
        {row.original.rarity}
      </Badge>
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'openedBy',
    header: 'OPENED BY',
    accessorKey: 'openedBy',
    cell: ({ row }) => (
      <span className="text-blue-400 text-sm font-mono">
        {row.original.openedBy}
      </span>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    id: 'timestamp',
    header: 'TIME',
    accessorKey: 'timestamp',
    cell: ({ row }) => {
      const formatRelativeTime = (date: Date): string => {
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        
        if (hours > 0) return `${hours}h ago`
        return `${minutes}m ago`
      }
      
      return (
        <span className="text-gray-400 text-xs">
          {formatRelativeTime(row.original.timestamp)}
        </span>
      )
    },
    size: 100,
    enableSorting: true,
    sortingFn: (rowA, rowB) => {
      return rowB.original.timestamp.getTime() - rowA.original.timestamp.getTime()
    }
  },
  {
    id: 'contents',
    header: 'CONTENTS',
    accessorKey: 'contents',
    cell: ({ row }) => (
      <div className="text-xs text-gray-300">
        {row.original.contents.join(', ')}
      </div>
    ),
    size: 200,
    enableSorting: false,
  }
] 