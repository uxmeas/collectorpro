# Unified Table System Documentation

## Overview

The Unified Table System is a high-performance, consistent table solution built on TanStack Table (React Table v8) designed for CollectorPRO. It provides lightning-fast sorting, filtering, virtual scrolling, and multiple view modes while maintaining consistent styling across all data displays.

## 🚀 Key Features

- **Performance**: <200ms filtering, virtual scrolling for 1000+ items
- **Multiple Views**: Table, Grid, and List view modes
- **Consistent Styling**: Dark theme with professional OpenSea-style design
- **Mobile Responsive**: Touch-friendly with mobile-optimized layouts
- **Flexible**: Reusable cell components and configurable columns
- **Accessible**: Keyboard navigation and screen reader support

## 📁 File Structure

```
src/components/table/
├── UnifiedTable.tsx              # Main table component
├── TableCells.tsx                # Reusable cell components
└── configs/
    ├── MomentTableConfig.tsx     # NBA Top Shot moment configurations
    └── PortfolioTableConfig.tsx  # Portfolio and activity configurations
```

## 🛠 Basic Usage

### 1. Import Components

```typescript
import { UnifiedTable } from '@/components/table/UnifiedTable'
import { momentTableColumns } from '@/components/table/configs/MomentTableConfig'
```

### 2. Basic Table

```typescript
<UnifiedTable
  columns={momentTableColumns}
  data={moments}
  loading={false}
  enableSorting={true}
  enableFiltering={true}
  defaultViewMode={{ mode: 'table' }}
  containerHeight={600}
/>
```

### 3. Grid View with Custom Cards

```typescript
<UnifiedTable
  columns={momentTableColumns}
  data={moments}
  defaultViewMode={{ mode: 'grid', gridColumns: 4 }}
  renderGridCard={(moment, index) => (
    <MomentGridCard
      moment={moment}
      index={index}
      onRowClick={(moment) => console.log('Clicked:', moment.id)}
    />
  )}
  containerHeight={800}
/>
```

## 🔧 Configuration Options

### UnifiedTableProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `columns` | `ColumnDef<T>[]` | Required | TanStack Table column definitions |
| `data` | `T[]` | Required | Array of data objects |
| `loading` | `boolean` | `false` | Show loading state |
| `enableSorting` | `boolean` | `true` | Enable column sorting |
| `enableFiltering` | `boolean` | `true` | Enable global and column filtering |
| `enableVirtualization` | `boolean` | `true` | Enable virtual scrolling |
| `defaultViewMode` | `TableViewMode` | `{ mode: 'table' }` | Initial view mode |
| `containerHeight` | `number` | `600` | Container height in pixels |
| `searchPlaceholder` | `string` | `"Search..."` | Search input placeholder |
| `onRowClick` | `(row: T) => void` | `undefined` | Row click handler |
| `renderGridCard` | `(item: T, index: number) => ReactNode` | `undefined` | Custom grid card renderer |
| `renderListItem` | `(item: T, index: number) => ReactNode` | `undefined` | Custom list item renderer |

### TableViewMode

```typescript
interface TableViewMode {
  mode: 'grid' | 'list' | 'table'
  gridColumns?: number // Number of columns for grid view
}
```

## 🧩 Available Cell Components

### PriceCell
Display formatted prices with change indicators.

```typescript
<PriceCell
  value={1250}
  change={50}
  changePercent={4.2}
  currency="USD"
/>
```

### NumberCell
Format numbers with various display options.

```typescript
<NumberCell
  value={1234567}
  format="compact" // "default" | "compact" | "percentage"
  decimals={1}
  prefix="$"
  suffix="M"
/>
```

### DateCell
Display dates with relative or absolute formatting.

```typescript
<DateCell
  value={new Date()}
  format="relative" // "relative" | "short" | "long" | "time"
/>
```

### BadgeCell
Styled badges with color mapping.

```typescript
<BadgeCell
  value="Legendary"
  colorMap={{
    'Common': 'default',
    'Rare': 'info',
    'Legendary': 'warning'
  }}
/>
```

### MomentCell
NBA Top Shot moment display with player and play info.

```typescript
<MomentCell
  playerName="LeBron James"
  playerImage="👑"
  playType="Dunk"
  setName="Base Set"
  serialNumber={1234}
  momentImage="🎬"
/>
```

### ActionsCell
Action buttons for table rows.

```typescript
<ActionsCell
  actions={[
    {
      label: 'View',
      icon: <ExternalLink className="h-4 w-4" />,
      onClick: () => window.open(url),
      variant: 'primary'
    },
    {
      label: 'Edit',
      icon: <Edit className="h-4 w-4" />,
      onClick: handleEdit
    }
  ]}
/>
```

## 📊 Pre-built Configurations

### Moment Discovery Table

```typescript
import { momentTableColumns, MomentGridCard } from '@/components/table/configs/MomentTableConfig'

<UnifiedTable
  columns={momentTableColumns}
  data={moments}
  renderGridCard={(moment, index) => (
    <MomentGridCard moment={moment} index={index} />
  )}
/>
```

### Portfolio Management

```typescript
import { portfolioTableColumns, PortfolioGridCard } from '@/components/table/configs/PortfolioTableConfig'

<UnifiedTable
  columns={portfolioTableColumns}
  data={portfolioMoments}
  renderGridCard={(moment, index) => (
    <PortfolioGridCard moment={moment} index={index} />
  )}
/>
```

### Activity Feed

```typescript
import { activityTableColumns, ActivityListItem } from '@/components/table/configs/PortfolioTableConfig'

<UnifiedTable
  columns={activityTableColumns}
  data={activities}
  defaultViewMode={{ mode: 'list' }}
  renderListItem={(activity, index) => (
    <ActivityListItem activity={activity} index={index} />
  )}
/>
```

## 🎨 Styling and Theming

### Dark Theme Colors

- Background: `#0a0a0a`
- Cards: `#1a1a1a`
- Borders: `#374151` (gray-700)
- Text: `#ffffff` (white)
- Secondary Text: `#9ca3af` (gray-400)
- Accent: `#3b82f6` (blue-500)

### Custom Styling

```typescript
<UnifiedTable
  className="custom-table-styles"
  // ... other props
/>
```

```css
.custom-table-styles {
  --table-bg: #0a0a0a;
  --table-border: #374151;
  --table-hover: #1f2937;
}
```

## 📱 Mobile Responsiveness

The table automatically adapts to mobile devices:

- **Mobile**: List view with touch-friendly interactions
- **Tablet**: Grid view with 2-3 columns
- **Desktop**: Full table view with all features

### Mobile Features

- Touch-friendly row selection
- Swipe gestures for navigation
- Optimized card layouts
- Responsive typography

## ⚡ Performance Optimization

### Virtual Scrolling

Automatically enabled for datasets > 100 items:

```typescript
<UnifiedTable
  enableVirtualization={true}
  containerHeight={600} // Required for virtual scrolling
  // ... other props
/>
```

### Best Practices

1. **Large Datasets**: Use server-side filtering and pagination
2. **Custom Renderers**: Wrap expensive components in `React.memo`
3. **State Management**: Debounce search inputs (built-in 200ms)
4. **Memory**: Implement data cleanup for very large datasets

### Performance Metrics

- **Filtering**: <200ms response time
- **Sorting**: <100ms for 1000 items
- **Scrolling**: 60fps with virtual scrolling
- **Memory**: Constant memory usage regardless of dataset size

## 🔄 State Management

### URL State Integration

```typescript
const [filters, setFilters] = useState<Filters>({})
const searchParams = useSearchParams()

// Sync with URL
useEffect(() => {
  const urlFilters = parseFiltersFromURL(searchParams)
  setFilters(urlFilters)
}, [searchParams])

// Update URL on filter change
useEffect(() => {
  const params = buildURLFromFilters(filters)
  router.replace(`/discover?${params}`)
}, [filters])
```

### Global State

For complex applications, integrate with state management:

```typescript
// With Redux/Zustand
const { data, loading, filters } = useTableStore()

<UnifiedTable
  data={data}
  loading={loading}
  // ... other props
/>
```

## 🧪 Testing

### Component Testing

```typescript
import { render, screen } from '@testing-library/react'
import { UnifiedTable } from '@/components/table/UnifiedTable'

test('renders table with data', () => {
  render(
    <UnifiedTable
      columns={testColumns}
      data={testData}
      loading={false}
    />
  )
  
  expect(screen.getByText('Test Data')).toBeInTheDocument()
})
```

### Performance Testing

```typescript
// Test virtual scrolling performance
test('handles large datasets efficiently', () => {
  const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`
  }))
  
  const { container } = render(
    <UnifiedTable
      columns={testColumns}
      data={largeDataset}
      enableVirtualization={true}
    />
  )
  
  // Should render only visible rows
  expect(container.querySelectorAll('tr')).toHaveLength(lessThan(50))
})
```

## 🔧 Customization

### Custom Column Types

```typescript
const customColumn: ColumnDef<DataType> = {
  id: 'custom',
  header: 'Custom Column',
  cell: ({ row }) => (
    <div className="custom-cell">
      {/* Custom rendering logic */}
    </div>
  ),
  size: 150,
  enableSorting: true,
}
```

### Custom View Renderers

```typescript
const CustomGridCard = ({ item, index }) => (
  <div className="custom-card">
    {/* Custom card layout */}
  </div>
)

<UnifiedTable
  renderGridCard={CustomGridCard}
  // ... other props
/>
```

## 🐛 Troubleshooting

### Common Issues

1. **Virtual Scrolling Not Working**
   - Ensure `containerHeight` is set
   - Check that `enableVirtualization={true}`

2. **Performance Issues**
   - Enable virtual scrolling for large datasets
   - Optimize custom cell renderers
   - Consider server-side filtering

3. **Styling Issues**
   - Check Tailwind CSS classes are available
   - Verify dark theme variables are set
   - Ensure proper z-index for overlays

### Debug Mode

```typescript
<UnifiedTable
  data={data}
  loading={false}
  // Add debug logging
  onRowClick={(row) => console.log('Row clicked:', row)}
  // ... other props
/>
```

## 📚 Examples

See `/app/table-demo` for comprehensive examples including:

- Moment discovery table
- Portfolio management
- Activity feed
- Performance benchmarks
- Custom implementations

## 🤝 Contributing

When adding new table configurations:

1. Create configuration in `configs/` directory
2. Export column definitions and custom renderers
3. Add TypeScript interfaces for data types
4. Include example usage in demo page
5. Update this documentation

## 📄 License

Part of the CollectorPRO application. See main project license for details. 