#!/bin/bash
# Vercel Build Script
# Switches Prisma to PostgreSQL schema for production, then builds

set -e

echo "🔧 Switching Prisma to PostgreSQL schema for production build..."

# Copy production schema (PostgreSQL) over the default schema
cp prisma/schema.prod.prisma prisma/schema.prisma

echo "✅ Schema switched to PostgreSQL"

# Generate Prisma client with PostgreSQL provider
npx prisma generate

echo "✅ Prisma client generated for PostgreSQL"

# Build Next.js
echo "📦 Building Next.js..."
npx next build

echo "✅ Build complete!"
