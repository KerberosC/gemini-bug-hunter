#!/bin/bash

# Gemini Bug Hunter - Demo Script
# This script demonstrates the key features of the tool

echo "🛡️  Gemini Bug Hunter - Demo"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env from .env.example and add your GEMINI_API_KEY"
    echo ""
    echo "Steps:"
    echo "1. cp .env.example .env"
    echo "2. Edit .env and add your API key from https://aistudio.google.com/app/apikey"
    exit 1
fi

echo "Step 1: Running system diagnostics..."
echo "--------------------------------------"
npm start doctor
echo ""

echo "Step 2: Viewing configuration..."
echo "--------------------------------------"
npm start config
echo ""

echo "Step 3: Scanning example vulnerable code..."
echo "--------------------------------------"
npm start scan examples/
echo ""

echo "Step 4: Explaining a vulnerability..."
echo "--------------------------------------"
npm start explain "SQL Injection"
echo ""

echo "✅ Demo complete!"
echo ""
echo "Next steps:"
echo "- Scan your own project: npm start scan ./your-project"
echo "- Save reports: npm start scan --output report.json"
echo "- Learn more: cat QUICKSTART.md"
