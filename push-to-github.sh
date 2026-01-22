#!/bin/bash
# Script to push NBA project to GitHub repos

set -e  # Exit on error

echo "🚀 Pushing NBA Watchability to GitHub..."
echo ""

# Navigate to repo
repo_root="$(cd "$(dirname "$0")" && pwd)"
cd "$repo_root"

echo "📍 Current directory: $(pwd)"
echo ""

# Show current remotes
echo "🔗 Git remotes:"
git remote -v
echo ""

# Show what will be pushed
echo "📦 Commits to push:"
git log origin/main..HEAD --oneline || echo "No unpushed commits to origin"
echo ""

# Push to personal repo
echo "⬆️  Pushing to personal GitHub (origin)..."
git push origin main
echo "✅ Pushed to personal repo!"
echo ""

# Check if WE3 repo exists
echo "🔍 Checking WE3 repo..."
if git ls-remote we3 &> /dev/null; then
    echo "⬆️  Pushing to WE3 GitHub..."
    git push we3 main
    echo "✅ Pushed to WE3 repo!"
else
    echo "⚠️  WE3 repo doesn't exist yet. Create it first:"
    echo "   https://github.com/organizations/WE3io/repositories/new"
    echo "   Name: we3-playground-nba"
    echo "   Then run: git push we3 main"
fi

echo ""
echo "✨ Done! NBA project pushed to GitHub."
