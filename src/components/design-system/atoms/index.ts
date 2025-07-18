// Atomic Design System - Atoms
// These are the smallest building blocks of our UI

export { Button } from '../../ui/Button'
export { Input } from '../../ui/Input'
export { Badge } from '../../ui/badge'
export { Card, CardHeader, CardContent, CardTitle } from '../../ui/Card'
export { Separator } from '../../ui/separator'
export { Slider } from '../../ui/slider'

// Loading States
export { LoadingSpinner } from './LoadingSpinner'
export { LoadingSkeleton } from './LoadingSkeleton'

// Typography
export { Heading } from './Heading'
export { Text } from './Text'

// Icons
export { Icon } from './Icon'

// Platform Branding
export { PlatformBadge, PlatformBadgeCompact, PlatformIcon } from './PlatformBadge'

// Mobile Accessibility
export { TouchTarget, CTATouchTarget, NavTouchTarget, FormTouchTarget, useTouchTargetValidation } from './TouchTarget'

// Dark Theme Optimization
export { 
  DarkText, 
  DarkCard, 
  DarkImageContainer, 
  DarkButton, 
  useDarkThemeContrast, 
  DarkThemeProvider, 
  useDarkThemeClasses 
} from './DarkThemeOptimizer' 