#!/bin/bash

# Gemini Bug Hunter - Setup Script
# Automates the initial setup process

set -e  # Exit on error

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║              🛡️  GEMINI BUG HUNTER SETUP                      ║"
echo "║                                                                ║"
echo "║              AI-Powered Security Scanner                       ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check Node.js version
echo "📋 Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher"
    echo "Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Check if dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed"
else
    echo "✅ Dependencies already installed"
fi
echo ""

# Check for .env file
if [ ! -f ".env" ]; then
    echo "⚙️  Setting up environment configuration..."
    
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file from template"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo "⚠️  IMPORTANT: You need to add your Gemini API key!"
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
        echo "Steps:"
        echo "1. Visit: https://aistudio.google.com/app/apikey"
        echo "2. Sign in with your Google account"
        echo "3. Click 'Create API Key'"
        echo "4. Copy your API key"
        echo "5. Edit .env file and replace 'your_gemini_api_key_here' with your key"
        echo ""
        echo "Then run this script again or run: npm start doctor"
        echo ""
        exit 0
    else
        echo "❌ .env.example not found"
        exit 1
    fi
else
    echo "✅ .env file exists"
fi
echo ""

# Check if API key is set
if grep -q "your_gemini_api_key_here" .env; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "⚠️  Gemini API key not configured!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Please edit .env and add your API key:"
    echo "1. Get key from: https://aistudio.google.com/app/apikey"
    echo "2. Edit .env file"
    echo "3. Replace 'your_gemini_api_key_here' with your actual key"
    echo ""
    echo "Then run: npm start doctor"
    echo ""
    exit 0
fi

# Run doctor command
echo "🏥 Running system diagnostics..."
echo ""
npm start doctor

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ Setup complete!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Next steps:"
echo ""
echo "  # Test with example vulnerable code"
echo "  npm start scan examples/"
echo ""
echo "  # Scan your own project"
echo "  npm start scan ./your-project"
echo ""
echo "  # Learn about vulnerabilities"
echo "  npm start explain \"SQL Injection\""
echo ""
echo "  # Optional: Install globally"
echo "  npm link"
echo "  gbh scan"
echo ""
echo "📖 For more information, see:"
echo "   - README.md (main documentation)"
echo "   - QUICKSTART.md (quick start guide)"
echo "   - ARCHITECTURE.md (technical details)"
echo ""
echo "Happy hunting! 🛡️"
echo ""
