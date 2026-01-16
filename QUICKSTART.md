<div align="center">
  <img src="logo-cli.png" alt="Gemini Bug Hunter Logo" width="150"/>
</div>

# 🚀 Quick Start Guide

## Step 1: Get Your Gemini API Key

1. Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

## Step 2: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API key
# Replace 'your_gemini_api_key_here' with your actual key
```

Your `.env` file should look like:
```
GEMINI_API_KEY=AIzaSyD...your-actual-key-here
```

## Step 3: Test Installation

```bash
# Check system health
npm start doctor
```

You should see:
- ✓ Node.js version
- ✓ .env file found
- ✓ GEMINI_API_KEY is set
- ✓ Gemini API connection successful

## Step 4: Run Your First Scan

```bash
# Scan the example vulnerable code
npm start scan examples/

# Or scan your own project
npm start scan ./src
```

## Step 5: Understanding the Output

The report will show:

- **Risk Score** (0-100%) - Overall project security score
- **Risk Level** - LOW, MEDIUM, HIGH, or CRITICAL
- **Severity Breakdown** - Count of issues by severity
- **Detailed Vulnerabilities** - Each issue with:
  - Title and description
  - File location and line number
  - Impact and exploitation scenario
  - Recommended fix
  - Auto-fix availability

## Common Commands

```bash
# Scan current directory
npm start scan

# Scan specific path
npm start scan ./src

# Save report to file
npm start scan --output report.json

# Get JSON output
npm start scan --json

# Explain a vulnerability type
npm start explain "SQL Injection"

# Check configuration
npm start config

# Run diagnostics
npm start doctor
```

## Optional: Global Installation

To use `gbh` command from anywhere:

```bash
npm link
```

Then you can use:
```bash
gbh scan
gbh doctor
gbh explain "XSS"
```

## Troubleshooting

### "GEMINI_API_KEY not found"
- Make sure you created `.env` file
- Check that your API key is correctly set
- No quotes needed around the key

### "Failed to connect to Gemini API"
- Verify your API key is valid
- Check your internet connection
- Make sure you have API quota available

### "No files found"
- Check the path you're scanning
- Verify file extensions are supported
- Review exclude patterns in config

## Next Steps

1. **Scan your project** - Run on your actual codebase
2. **Review findings** - Analyze the vulnerabilities
3. **Fix issues** - Apply recommended fixes
4. **Re-scan** - Verify fixes worked
5. **Integrate CI/CD** - Add to your pipeline (coming soon)

## Example Workflow

```bash
# 1. Initial scan
npm start scan ./src --output initial-scan.json

# 2. Review critical issues
cat initial-scan.json | grep -i "CRITICAL"

# 3. Learn about a vulnerability
npm start explain "SQL Injection"

# 4. Fix the code
# ... make your changes ...

# 5. Verify fix
npm start scan ./src

# 6. Compare results
# Risk score should be lower!
```

## Tips

- **Start small** - Scan one file or directory first
- **Review carefully** - AI can have false positives
- **Learn from it** - Use the explanations to improve
- **Iterate** - Scan regularly during development
- **Share** - Help your team improve security

## Need Help?

- 📖 Read the full [README.md](README.md)
- 🐛 Report issues on [GitHub](https://github.com/holasoymalva/gemini-bug-hunter/issues)
- 🔑 Get API key at [Google AI Studio](https://aistudio.google.com/app/apikey)

---

**Happy hunting! 🛡️**
