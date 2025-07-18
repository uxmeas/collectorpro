import { ColumnDef } from '@tanstack/react-table'
import { ExternalLink, Heart, TrendingUp, AlertCircle } from 'lucide-react'
import { 
  PriceCell, 
  NumberCell, 
  BadgeCell, 
  MomentCell, 
  ActionsCell,
  DateCell,
  StatusCell
} from '../TableCells'
import { DiscoveryMoment } from '@/lib/discovery-service'
import { Button } from "@/components/ui/Button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/Card"

// Define moment table columns
export const momentTableColumns: ColumnDef<DiscoveryMoment>[] = [
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
    id: 'price',
    header: 'Price',
    accessorKey: 'currentPrice',
    cell: ({ row }) => (
      <PriceCell
        value={row.original.currentPrice}
        change={row.original.priceChange24h}
        changePercent={row.original.priceChangePercent}
      />
    ),
    size: 140,
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
    id: 'serial',
    header: 'Serial',
    accessorKey: 'serialNumber',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <NumberCell value={row.original.serialNumber} format="default" />
        <span className="text-gray-500">/</span>
        <NumberCell value={row.original.supply} format="compact" className="text-gray-400" />
      </div>
    ),
    size: 120,
    enableSorting: true,
  },
  {
    id: 'marketData',
    header: 'Market',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Ask:</span>
          <span>${row.original.lowestAsk.toFixed(0)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-400">Bid:</span>
          <span>${row.original.highestBid.toFixed(0)}</span>
        </div>
      </div>
    ),
    size: 100,
  },
  {
    id: 'analytics',
    header: 'Analytics',
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-400">RSI:</span>
          <span className={
            row.original.rsi < 30 ? 'text-green-400' :
            row.original.rsi > 70 ? 'text-red-400' : 'text-gray-300'
          }>
            {row.original.rsi.toFixed(0)}
          </span>
        </div>
        <div className="flex items-center gap-1 text-xs">
          <span className="text-gray-400">Liq:</span>
          <span>{row.original.liquidityScore.toFixed(0)}</span>
        </div>
      </div>
    ),
    size: 100,
  },
  {
    id: 'momentum',
    header: 'Trend',
    accessorKey: 'momentum',
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <BadgeCell
          value={row.original.momentum}
          colorMap={{
            'bullish': 'success',
            'bearish': 'error',
            'neutral': 'default'
          }}
        />
        {row.original.isDeal && (
          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
            <AlertCircle className="h-3 w-3 mr-1" />
            Deal
          </Badge>
        )}
      </div>
    ),
    size: 120,
    enableSorting: true,
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
            label: 'Add to Watchlist',
            icon: <Heart className="h-4 w-4" />,
            onClick: () => console.log('Add to watchlist:', row.original.id)
          }
        ]}
      />
    ),
    size: 120,
    enableSorting: false,
  },
]

// Grid card renderer for moments
export function MomentGridCard({ 
  moment, 
  index, 
  onRowClick 
}: { 
  moment: DiscoveryMoment
  index: number
  onRowClick?: (moment: DiscoveryMoment) => void 
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <Card 
      key={index}
      className="bg-[#1a1a1a] border-gray-800 hover:border-blue-500/50 transition-all duration-200 group relative overflow-hidden cursor-pointer"
      onClick={() => onRowClick?.(moment)}
    >
      {moment.isDeal && (
        <div className="absolute top-2 left-2 z-10">
          <Badge className="bg-orange-500/20 text-orange-400 border-orange-500/30">
            <AlertCircle className="h-3 w-3 mr-1" />
            Deal
          </Badge>
        </div>
      )}
      
      {moment.momentum === 'bullish' && (
        <div className="absolute top-2 right-2 z-10">
          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
            <TrendingUp className="h-3 w-3 mr-1" />
            Hot
          </Badge>
        </div>
      )}
      
      <CardContent className="p-4">
        {/* Moment Image/Video */}
        <div className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg mb-4 flex items-center justify-center text-4xl relative overflow-hidden">
          {moment.momentImage}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200"></div>
          
          {/* Analytics Overlay */}
          <div className="absolute bottom-2 left-2 right-2 bg-black/80 rounded p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <div className="grid grid-cols-2 gap-1 text-xs">
              <div>Vol: {formatNumber(moment.salesLast24h)}</div>
              <div>RSI: {moment.rsi.toFixed(0)}</div>
              <div>Liq: {moment.liquidityScore.toFixed(0)}</div>
              <div>Score: {moment.trendScore.toFixed(0)}</div>
            </div>
          </div>
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
          
          {/* Play Details */}
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {moment.playType}
            </Badge>
            <Badge variant="outline" className="text-xs">
              #{moment.serialNumber}
            </Badge>
          </div>
          
          <div className="text-xs text-gray-400">
            {moment.setName} • {moment.series}
          </div>
          
          {/* Price Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">{formatPrice(moment.currentPrice)}</span>
              <div className={`flex items-center gap-1 text-xs ${
                moment.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'
              }`}>
                {moment.priceChangePercent >= 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingUp className="h-3 w-3 rotate-180" />
                )}
                {Math.abs(moment.priceChangePercent).toFixed(1)}%
              </div>
            </div>
            
            {/* Market Data */}
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div>Ask: {formatPrice(moment.lowestAsk)}</div>
              <div>Bid: {formatPrice(moment.highestBid)}</div>
            </div>
          </div>
          
          {/* Analytics */}
          <div className="flex items-center justify-between text-xs text-gray-400">
            <span>Score: {formatNumber(moment.topShotScore)}</span>
            <span>Supply: {formatNumber(moment.circulatingSupply)}</span>
          </div>
          
          {/* Recommendations */}
          {moment.recommendations.length > 0 && (
            <div className="text-xs">
              <Badge 
                variant="outline" 
                className={
                  moment.recommendations[0].type === 'buy' ? 'border-green-500 text-green-400' :
                  moment.recommendations[0].type === 'sell' ? 'border-red-500 text-red-400' :
                  'border-blue-500 text-blue-400'
                }
              >
                {moment.recommendations[0].type.toUpperCase()} • {moment.recommendations[0].confidence.toFixed(0)}%
              </Badge>
            </div>
          )}
          
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
              View on NBA Top Shot
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="px-3"
              onClick={(e) => {
                e.stopPropagation()
                console.log('Add to watchlist:', moment.id)
              }}
            >
              <Heart className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// List item renderer for moments
export function MomentListItem({ 
  moment, 
  index, 
  onRowClick 
}: { 
  moment: DiscoveryMoment
  index: number
  onRowClick?: (moment: DiscoveryMoment) => void 
}) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card 
      key={index}
      className="bg-[#1a1a1a] border-gray-800 hover:border-blue-500/50 transition-all duration-200 cursor-pointer"
      onClick={() => onRowClick?.(moment)}
    >
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Moment Image */}
          <div className="w-16 h-16 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">
            {moment.momentImage}
          </div>
          
          {/* Content */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm">{moment.playerImage}</span>
                <div>
                  <h3 className="font-medium text-sm">{moment.playerName}</h3>
                  <p className="text-xs text-gray-400">{moment.teamName}</p>
                </div>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="font-medium">{moment.playType}</div>
              <div className="text-gray-400 text-xs">#{moment.serialNumber}</div>
            </div>
            
            <div className="text-sm">
              <div className="font-bold">{formatPrice(moment.currentPrice)}</div>
              <div className={`text-xs ${moment.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {moment.priceChangePercent >= 0 ? '+' : ''}{moment.priceChangePercent.toFixed(1)}%
              </div>
            </div>
            
            <div className="flex gap-1">
              {moment.isDeal && (
                <Badge className="bg-orange-500/20 text-orange-400 text-xs">Deal</Badge>
              )}
              <Badge variant="outline" className="text-xs">{moment.rarityTier}</Badge>
            </div>
            
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white flex-1"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(moment.marketplaceUrl, '_blank')
                }}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Buy
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="px-3"
                onClick={(e) => {
                  e.stopPropagation()
                  console.log('Add to watchlist:', moment.id)
                }}
              >
                <Heart className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 