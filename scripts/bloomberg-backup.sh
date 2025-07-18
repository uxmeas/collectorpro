#!/bin/bash

# Bloomberg Upgrade Backup Script
# This script creates a comprehensive backup before Bloomberg upgrades

set -e  # Exit on any error

echo "🛡️ Bloomberg Upgrade Backup Script"
echo "=================================="

# Create timestamp for backup directory
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_DIR="backups/bloomberg-upgrade-$TIMESTAMP"

echo "📁 Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Function to backup file with error handling
backup_file() {
    local source_file="$1"
    local backup_file="$2"
    
    if [ -f "$source_file" ]; then
        echo "✅ Backing up: $source_file"
        cp "$source_file" "$backup_file"
    else
        echo "⚠️  Warning: File not found: $source_file"
    fi
}

# Function to backup directory with error handling
backup_directory() {
    local source_dir="$1"
    local backup_dir="$2"
    
    if [ -d "$source_dir" ]; then
        echo "✅ Backing up directory: $source_dir"
        cp -r "$source_dir" "$backup_dir"
    else
        echo "⚠️  Warning: Directory not found: $source_dir"
    fi
}

echo ""
echo "📋 Backing up critical files..."

# Backup Bloomberg-specific files
echo "🔵 Bloomberg Files:"
backup_file "src/styles/bloomberg-colors.css" "$BACKUP_DIR/bloomberg-colors.css"
backup_file "src/lib/bloomberg-utils.ts" "$BACKUP_DIR/bloomberg-utils.ts"
backup_directory "src/components/bloomberg" "$BACKUP_DIR/bloomberg-components"

# Backup dashboard integration files
echo "📊 Dashboard Files:"
backup_file "src/app/dashboard/page.tsx" "$BACKUP_DIR/dashboard-page.tsx"
backup_file "src/app/globals.css" "$BACKUP_DIR/globals.css"

# Backup configuration files
echo "⚙️  Configuration Files:"
backup_file "next.config.ts" "$BACKUP_DIR/next.config.ts"
backup_file "package.json" "$BACKUP_DIR/package.json"
backup_file "package-lock.json" "$BACKUP_DIR/package-lock.json"
backup_file "tailwind.config.js" "$BACKUP_DIR/tailwind.config.js"
backup_file "postcss.config.mjs" "$BACKUP_DIR/postcss.config.mjs"

# Backup testing files
echo "🧪 Testing Files:"
backup_file "testing/BLOOMBERG_TESTING_FRAMEWORK.md" "$BACKUP_DIR/BLOOMBERG_TESTING_FRAMEWORK.md"
backup_file "testing/BLOOMBERG_PHASE1_TEST_SCENARIOS.md" "$BACKUP_DIR/BLOOMBERG_PHASE1_TEST_SCENARIOS.md"
backup_file "scripts/test-bloomberg-phase1.js" "$BACKUP_DIR/test-bloomberg-phase1.js"
backup_file "BLOOMBERG_PHASE1_TESTING_SUMMARY.md" "$BACKUP_DIR/BLOOMBERG_PHASE1_TESTING_SUMMARY.md"

# Create backup manifest
echo ""
echo "📝 Creating backup manifest..."
cat > "$BACKUP_DIR/BACKUP_MANIFEST.md" << EOF
# Bloomberg Upgrade Backup Manifest

**Backup Created:** $(date)
**Timestamp:** $TIMESTAMP
**Backup Directory:** $BACKUP_DIR

## Files Backed Up

### Bloomberg Files
- src/styles/bloomberg-colors.css
- src/lib/bloomberg-utils.ts
- src/components/bloomberg/ (directory)

### Dashboard Files
- src/app/dashboard/page.tsx
- src/app/globals.css

### Configuration Files
- next.config.ts
- package.json
- package-lock.json
- tailwind.config.js
- postcss.config.mjs

### Testing Files
- testing/BLOOMBERG_TESTING_FRAMEWORK.md
- testing/BLOOMBERG_PHASE1_TEST_SCENARIOS.md
- scripts/test-bloomberg-phase1.js
- BLOOMBERG_PHASE1_TESTING_SUMMARY.md

## Restore Commands

### Restore Specific File
\`\`\`bash
cp $BACKUP_DIR/[filename] [destination]
\`\`\`

### Restore All Files
\`\`\`bash
cp $BACKUP_DIR/bloomberg-colors.css src/styles/
cp $BACKUP_DIR/bloomberg-utils.ts src/lib/
cp -r $BACKUP_DIR/bloomberg-components/* src/components/bloomberg/
cp $BACKUP_DIR/dashboard-page.tsx src/app/dashboard/page.tsx
cp $BACKUP_DIR/globals.css src/app/globals.css
cp $BACKUP_DIR/next.config.ts ./
cp $BACKUP_DIR/package.json ./
cp $BACKUP_DIR/package-lock.json ./
\`\`\`

## Pre-Backup State
- Development server status: [Check with npm run dev]
- Dashboard functionality: [Document current state]
- Known issues: [List any existing issues]

## Notes
- Backup created before Bloomberg Phase 1 implementation
- All critical files preserved
- Ready for rollback if needed
EOF

# Create quick restore script
echo ""
echo "🔧 Creating quick restore script..."
cat > "$BACKUP_DIR/restore.sh" << 'EOF'
#!/bin/bash

# Quick Restore Script for Bloomberg Backup
echo "🔄 Restoring Bloomberg backup..."

# Restore Bloomberg files
cp bloomberg-colors.css ../../src/styles/ 2>/dev/null || echo "⚠️  Could not restore bloomberg-colors.css"
cp bloomberg-utils.ts ../../src/lib/ 2>/dev/null || echo "⚠️  Could not restore bloomberg-utils.ts"
cp -r bloomberg-components/* ../../src/components/bloomberg/ 2>/dev/null || echo "⚠️  Could not restore bloomberg components"

# Restore dashboard files
cp dashboard-page.tsx ../../src/app/dashboard/page.tsx 2>/dev/null || echo "⚠️  Could not restore dashboard page"
cp globals.css ../../src/app/globals.css 2>/dev/null || echo "⚠️  Could not restore globals.css"

# Restore configuration files
cp next.config.ts ../../ 2>/dev/null || echo "⚠️  Could not restore next.config.ts"
cp package.json ../../ 2>/dev/null || echo "⚠️  Could not restore package.json"
cp package-lock.json ../../ 2>/dev/null || echo "⚠️  Could not restore package-lock.json"

echo "✅ Restore complete!"
echo "🔄 Restart development server: npm run dev"
EOF

chmod +x "$BACKUP_DIR/restore.sh"

# Create Git backup
echo ""
echo "🌿 Creating Git backup..."
if git status --porcelain | grep -q .; then
    echo "📝 Committing current changes..."
    git add .
    git commit -m "Pre-Bloomberg upgrade backup: $TIMESTAMP" || echo "⚠️  Git commit failed (may already be committed)"
fi

# Create backup branch
echo "🌿 Creating backup branch..."
git checkout -b "backup/pre-bloomberg-$TIMESTAMP" 2>/dev/null || echo "⚠️  Backup branch creation failed (may already exist)"

# Return to main branch
git checkout main 2>/dev/null || echo "⚠️  Could not return to main branch"

echo ""
echo "✅ Backup completed successfully!"
echo ""
echo "📁 Backup location: $BACKUP_DIR"
echo "📝 Manifest: $BACKUP_DIR/BACKUP_MANIFEST.md"
echo "🔧 Restore script: $BACKUP_DIR/restore.sh"
echo ""
echo "🚀 Ready to begin Bloomberg upgrades!"
echo ""
echo "📋 Next steps:"
echo "1. Create feature branch: git checkout -b feature/bloomberg-phase1"
echo "2. Start incremental changes"
echo "3. Test after each change"
echo "4. Use restore script if needed: $BACKUP_DIR/restore.sh"
echo ""
echo "🛡️ Safety first - you can always rollback!" 