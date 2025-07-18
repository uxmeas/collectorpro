#!/bin/bash

# Bloomberg Emergency Rollback Script
# Use this script if Bloomberg upgrades cause issues

set -e  # Exit on any error

echo "🚨 Bloomberg Emergency Rollback Script"
echo "======================================"

# Function to check if file exists and restore it
rollback_file() {
    local backup_file="$1"
    local target_file="$2"
    local description="$3"
    
    if [ -f "$backup_file" ]; then
        echo "✅ Restoring $description..."
        cp "$backup_file" "$target_file"
    else
        echo "⚠️  Warning: Backup file not found: $backup_file"
    fi
}

# Function to check if directory exists and restore it
rollback_directory() {
    local backup_dir="$1"
    local target_dir="$2"
    local description="$3"
    
    if [ -d "$backup_dir" ]; then
        echo "✅ Restoring $description..."
        rm -rf "$target_dir" 2>/dev/null || true
        cp -r "$backup_dir" "$target_dir"
    else
        echo "⚠️  Warning: Backup directory not found: $backup_dir"
    fi
}

# Find the most recent backup
echo "🔍 Finding most recent backup..."
LATEST_BACKUP=$(ls -td backups/bloomberg-upgrade-* 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ No Bloomberg backup found!"
    echo "💡 Try manual rollback:"
    echo "   git checkout HEAD -- src/app/dashboard/page.tsx"
    echo "   git checkout HEAD -- src/styles/bloomberg-colors.css"
    echo "   git checkout HEAD -- src/lib/bloomberg-utils.ts"
    exit 1
fi

echo "📁 Using backup: $LATEST_BACKUP"

# Stop development server if running
echo "🛑 Stopping development server..."
pkill -f "next dev" 2>/dev/null || echo "⚠️  No development server found"

# Clear Next.js cache
echo "🧹 Clearing Next.js cache..."
rm -rf .next 2>/dev/null || echo "⚠️  No .next directory found"

echo ""
echo "🔄 Starting rollback process..."

# Rollback Bloomberg files
echo "🔵 Rolling back Bloomberg files..."
rollback_file "$LATEST_BACKUP/bloomberg-colors.css" "src/styles/bloomberg-colors.css" "Bloomberg CSS"
rollback_file "$LATEST_BACKUP/bloomberg-utils.ts" "src/lib/bloomberg-utils.ts" "Bloomberg utils"
rollback_directory "$LATEST_BACKUP/bloomberg-components" "src/components/bloomberg" "Bloomberg components"

# Rollback dashboard files
echo "📊 Rolling back dashboard files..."
rollback_file "$LATEST_BACKUP/dashboard-page.tsx" "src/app/dashboard/page.tsx" "Dashboard page"
rollback_file "$LATEST_BACKUP/globals.css" "src/app/globals.css" "Global CSS"

# Rollback configuration files
echo "⚙️  Rolling back configuration files..."
rollback_file "$LATEST_BACKUP/next.config.ts" "next.config.ts" "Next.js config"
rollback_file "$LATEST_BACKUP/package.json" "package.json" "Package.json"
rollback_file "$LATEST_BACKUP/package-lock.json" "package-lock.json" "Package lock"

echo ""
echo "🧹 Cleaning up..."

# Remove any Bloomberg imports from dashboard if they exist
if [ -f "src/app/dashboard/page.tsx" ]; then
    echo "🔧 Removing Bloomberg imports from dashboard..."
    # Create temporary file without Bloomberg imports
    grep -v "BloombergHeaderBar\|bloomberg-colors" "src/app/dashboard/page.tsx" > "src/app/dashboard/page.tsx.tmp" 2>/dev/null || echo "⚠️  Could not clean Bloomberg imports"
    mv "src/app/dashboard/page.tsx.tmp" "src/app/dashboard/page.tsx" 2>/dev/null || echo "⚠️  Could not update dashboard file"
fi

# Reinstall dependencies if package.json changed
if [ -f "$LATEST_BACKUP/package.json" ]; then
    echo "📦 Reinstalling dependencies..."
    npm install
fi

echo ""
echo "✅ Rollback completed!"
echo ""
echo "🔄 Starting development server..."
echo "💡 If issues persist, try:"
echo "   1. git reset --hard HEAD"
echo "   2. git clean -fd"
echo "   3. npm install"
echo "   4. npm run dev"
echo ""
echo "🚀 Starting server..."
npm run dev 