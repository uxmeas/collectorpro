import { ColumnDef } from '@tanstack/react-table'
import { ExternalLink, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { 
  PriceCell, 
  NumberCell, 
  BadgeCell, 
  MomentCell, 
  ActionsCell,
  DateCell,
  PlayerCell,
  LinkCell,
  CopyCell
} from '../TableCells'
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/Card"

// Portfolio Moment interface (user's owned moments)
export interface PortfolioMoment {
  id: string
  playId: string
  serialNumber: number
  playerName: string
  playerImage: string
  teamName: string
  playType: string
  setName: string
  series: string
  rarityTier: string
  purchasePrice: number
  purchaseDate: Date
  currentPrice: number
  priceChange: number
  priceChangePercent: number
  marketplaceUrl: string
  momentImage: string
  locked: boolean
  inPack: boolean
}

// Activity/Transaction interface
export interface ActivityItem {
  id: string
  type: 'purchase' | 'sale' | 'transfer' | 'pack_opening' | 'offer_received' | 'offer_made'
  momentId?: string
  playerName?: string
  playerImage?: string
  playType?: string
  serialNumber?: number
  price?: number
  fromAddress?: string
  toAddress?: string
  transactionHash?: string
  timestamp: Date
  status: 'completed' | 'pending' | 'failed'
}

// Portfolio table columns
export const portfolioTableColumns: ColumnDef<PortfolioMoment>[] = [
  {
    id: 'moment',
    header: 'Moment',
    accessorKey: 'playerName',
    cell: ({ row }) => (
      <MomentCell
        playerName={row.original.playerName}
        playerImage={row.original.playerImage}
        playType={row.original.playType}
        setName={row.original.setName}
        serialNumber={row.original.serialNumber}
        momentImage={row.original.momentImage}
      />
    ),
    size: 280,
    enableSorting: true,
  },
  {
    id: 'purchase',
    header: 'Purchase',
    cell: ({ row }) => (
      <div className="space-y-1">
        <PriceCell value={row.original.purchasePrice} />
        <DateCell value={row.original.purchaseDate} format="short" className="text-xs" />
      </div>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    id: 'current',
    header: 'Current Value',
    accessorKey: 'currentPrice',
    cell: ({ row }) => (
      <PriceCell
        value={row.original.currentPrice}
        change={row.original.priceChange}
        changePercent={row.original.priceChangePercent}
      />
    ),
    size: 140,
    enableSorting: true,
  },
  {
    id: 'profit',
    header: 'P&L',
    cell: ({ row }) => {
      const profit = row.original.currentPrice - row.original.purchasePrice
      const profitPercent = (profit / row.original.purchasePrice) * 100
      
      return (
        <div className={`flex flex-col gap-1 ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
          <div className="flex items-center gap-1">
            {profit >= 0 ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="font-semibold">
              ${Math.abs(profit).toFixed(0)}
            </span>
          </div>
          <div className="text-xs">
            {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
          </div>
        </div>
      )
    },
    size: 100,
    enableSorting: true,
  },
  {
    id: 'rarity',
    header: 'Rarity',
    accessorKey: 'rarityTier',
    cell: ({ row }) => (
      <BadgeCell
        value={row.original.rarityTier}
        colorMap={{
          'Common': 'default',
          'Rare': 'info',
          'Legendary': 'warning',
          'Ultimate': 'success'
        }}
      />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className="flex flex-col gap-1">
        {row.original.locked && (
          <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Locked</Badge>
        )}
        {row.original.inPack && (
          <Badge className="bg-blue-500/20 text-blue-400 text-xs">In Pack</Badge>
        )}
        {!row.original.locked && !row.original.inPack && (
          <Badge className="bg-green-500/20 text-green-400 text-xs">Available</Badge>
        )}
      </div>
    ),
    size: 100,
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => (
      <ActionsCell
        actions={[
          {
            label: 'View on NBA Top Shot',
            icon: <ExternalLink className="h-4 w-4" />,
            onClick: () => window.open(row.original.marketplaceUrl, '_blank'),
            variant: 'primary'
          },
          {
            label: 'List for Sale',
            icon: <TrendingUp className="h-4 w-4" />,
            onClick: () => console.log('List for sale:', row.original.id)
          }
        ]}
      />
    ),
    size: 120,
    enableSorting: false,
  },
]

// Activity table columns
export const activityTableColumns: ColumnDef<ActivityItem>[] = [
  {
    id: 'type',
    header: 'Activity',
    accessorKey: 'type',
    cell: ({ row }) => {
      const typeConfig = {
        purchase: { 
          label: 'Purchase', 
          icon: <ArrowDownLeft className="h-4 w-4" />, 
          color: 'text-green-400' 
        },
        sale: { 
          label: 'Sale', 
          icon: <ArrowUpRight className="h-4 w-4" />, 
          color: 'text-blue-400' 
        },
        transfer: { 
          label: 'Transfer', 
          icon: <ArrowUpRight className="h-4 w-4" />, 
          color: 'text-gray-400' 
        },
        pack_opening: { 
          label: 'Pack Opening', 
          icon: <span>📦</span>, 
          color: 'text-purple-400' 
        },
        offer_received: { 
          label: 'Offer Received', 
          icon: <span>📨</span>, 
          color: 'text-orange-400' 
        },
        offer_made: { 
          label: 'Offer Made', 
          icon: <span>📤</span>, 
          color: 'text-yellow-400' 
        },
      }
      
      const config = typeConfig[row.original.type]
      
      return (
        <div className={`flex items-center gap-2 ${config.color}`}>
          {config.icon}
          <span className="font-medium">{config.label}</span>
        </div>
      )
    },
    size: 140,
    enableSorting: true,
  },
  {
    id: 'moment',
    header: 'Moment',
    cell: ({ row }) => {
      if (!row.original.playerName) return <span className="text-gray-500">—</span>
      
      return (
        <div className="flex items-center gap-2">
          <span className="text-lg">{row.original.playerImage}</span>
          <div>
            <div className="font-medium text-sm">{row.original.playerName}</div>
            <div className="text-xs text-gray-400">
              {row.original.playType} • #{row.original.serialNumber}
            </div>
          </div>
        </div>
      )
    },
    size: 200,
  },
  {
    id: 'price',
    header: 'Price',
    accessorKey: 'price',
    cell: ({ row }) => {
      if (!row.original.price) return <span className="text-gray-500">—</span>
      
      return <PriceCell value={row.original.price} />
    },
    size: 100,
    enableSorting: true,
  },
  {
    id: 'parties',
    header: 'From/To',
    cell: ({ row }) => (
      <div className="space-y-1">
        {row.original.fromAddress && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">From:</span>
            <CopyCell 
              value={row.original.fromAddress} 
              truncate={true}
              className="text-xs"
            />
          </div>
        )}
        {row.original.toAddress && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-500">To:</span>
            <CopyCell 
              value={row.original.toAddress} 
              truncate={true}
              className="text-xs"
            />
          </div>
        )}
      </div>
    ),
    size: 160,
  },
  {
    id: 'timestamp',
    header: 'Time',
    accessorKey: 'timestamp',
    cell: ({ row }) => (
      <DateCell value={row.original.timestamp} format="relative" />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ row }) => (
      <BadgeCell
        value={row.original.status}
        colorMap={{
          'completed': 'success',
          'pending': 'warning',
          'failed': 'error'
        }}
      />
    ),
    size: 100,
    enableSorting: true,
  },
  {
    id: 'transaction',
    header: 'Tx',
    cell: ({ row }) => {
      if (!row.original.transactionHash) return <span className="text-gray-500">—</span>
      
      return (
        <LinkCell 
          href={`https://flowscan.org/transaction/${row.original.transactionHash}`}
          external={true}
          className="text-xs"
        >
          View
        </LinkCell>
      )
    },
    size: 60,
  },
]

// Portfolio grid card renderer
export function PortfolioGridCard({ 
  moment, 
  index, 
  onRowClick 
}: { 
  moment: PortfolioMoment
  index: number
  onRowClick?: (moment: PortfolioMoment) => void 
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const profit = moment.currentPrice - moment.purchasePrice
  const profitPercent = (profit / moment.purchasePrice) * 100

  return (
    <Card 
      key={index}
      className="bg-[#1a1a1a] border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
      onClick={() => onRowClick?.(moment)}
    >
      <CardContent className="p-4">
        {/* Status badges */}
        <div className="flex gap-1 mb-3">
          {moment.locked && (
            <Badge className="bg-yellow-500/20 text-yellow-400 text-xs">Locked</Badge>
          )}
          {moment.inPack && (
            <Badge className="bg-blue-500/20 text-blue-400 text-xs">In Pack</Badge>
          )}
        </div>

        {/* Moment Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center text-4xl">
          {moment.momentImage}
        </div>
        
        {/* Player Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">{moment.playerImage}</span>
            <div>
              <h3 className="font-medium text-sm">{moment.playerName}</h3>
              <p className="text-xs text-gray-400">{moment.teamName}</p>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            {moment.playType} • #{moment.serialNumber}
          </div>
          
          {/* Price Information */}
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <div className="text-gray-400 text-xs">Purchased</div>
                <div className="font-semibold">{formatPrice(moment.purchasePrice)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-xs">Current</div>
                <div className="font-semibold">{formatPrice(moment.currentPrice)}</div>
              </div>
            </div>
            
            {/* P&L */}
            <div className={`text-center p-2 rounded ${
              profit >= 0 ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}>
              <div className="font-bold">
                {profit >= 0 ? '+' : ''}{formatPrice(profit)}
              </div>
              <div className="text-xs">
                {profit >= 0 ? '+' : ''}{profitPercent.toFixed(1)}%
              </div>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                window.open(moment.marketplaceUrl, '_blank')
              }}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              View
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={(e) => {
                e.stopPropagation()
                console.log('List for sale:', moment.id)
              }}
            >
              List
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Activity list item renderer
export function ActivityListItem({ 
  activity, 
  index, 
  onRowClick 
}: { 
  activity: ActivityItem
  index: number
  onRowClick?: (activity: ActivityItem) => void 
}) {
  const typeConfig = {
    purchase: { 
      label: 'Purchase', 
      icon: <ArrowDownLeft className="h-4 w-4" />, 
      color: 'text-green-400' 
    },
    sale: { 
      label: 'Sale', 
      icon: <ArrowUpRight className="h-4 w-4" />, 
      color: 'text-blue-400' 
    },
    transfer: { 
      label: 'Transfer', 
      icon: <ArrowUpRight className="h-4 w-4" />, 
      color: 'text-gray-400' 
    },
    pack_opening: { 
      label: 'Pack Opening', 
      icon: <span>📦</span>, 
      color: 'text-purple-400' 
    },
    offer_received: { 
      label: 'Offer Received', 
      icon: <span>📨</span>, 
      color: 'text-orange-400' 
    },
    offer_made: { 
      label: 'Offer Made', 
      icon: <span>📤</span>, 
      color: 'text-yellow-400' 
    },
  }

  const config = typeConfig[activity.type]

  return (
    <Card 
      key={index}
      className="bg-[#1a1a1a] border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
      onClick={() => onRowClick?.(activity)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Activity type */}
            <div className={`flex items-center gap-2 ${config.color}`}>
              {config.icon}
              <span className="font-medium">{config.label}</span>
            </div>
            
            {/* Moment info */}
            {activity.playerName && (
              <div className="flex items-center gap-2">
                <span className="text-lg">{activity.playerImage}</span>
                <div>
                  <div className="font-medium text-sm">{activity.playerName}</div>
                  <div className="text-xs text-gray-400">
                    {activity.playType} • #{activity.serialNumber}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            {/* Price */}
            {activity.price && (
              <div className="text-right">
                <div className="font-semibold">
                  ${activity.price.toLocaleString()}
                </div>
              </div>
            )}
            
            {/* Time and status */}
            <div className="text-right">
              <DateCell value={activity.timestamp} format="relative" />
              <div className="mt-1">
                <BadgeCell
                  value={activity.status}
                  colorMap={{
                    'completed': 'success',
                    'pending': 'warning',
                    'failed': 'error'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 