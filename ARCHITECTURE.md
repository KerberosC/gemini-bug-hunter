# Architecture Documentation

## Overview

Gemini Bug Hunter is an AI-first security CLI tool that uses **Gemini 3 API as its core intelligence engine** to detect, analyze, and help fix security vulnerabilities in code.

## Design Principles

1. **AI-First**: Gemini 3 is the brain, not an add-on
2. **Developer-Friendly**: Beautiful CLI, clear outputs
3. **Security-Accurate**: Focus on real vulnerabilities, minimize false positives
4. **Privacy-Conscious**: Redact secrets, require consent
5. **Actionable**: Every finding includes fix recommendations

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLI Layer                          │
│                   (cli/index.js)                        │
│  Commands: scan | doctor | config | explain            │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                   Engine Layer                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Scanner    │  │    Gemini    │  │     Risk     │ │
│  │              │  │    Client    │  │  Calculator  │ │
│  │ - Find files │  │ - Analyze    │  │ - Score      │ │
│  │ - Sanitize   │  │ - Generate   │  │ - Prioritize │ │
│  │ - Chunk      │  │ - Parse      │  │ - Assess     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
│                                                         │
└────────────────────┬────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────┐
│                  Reporter Layer                         │
│                (reporter/console.js)                    │
│  - Format output                                        │
│  - Colorize                                             │
│  - Display tables                                       │
└─────────────────────────────────────────────────────────┘
```

## Component Details

### 1. CLI Layer (`cli/index.js`)

**Responsibility**: User interface and command orchestration

**Commands**:
- `scan [path]` - Scan code for vulnerabilities
- `doctor` - System health check
- `config` - View configuration
- `explain <category>` - Learn about vulnerabilities

**Flow**:
1. Parse command and options
2. Initialize components
3. Orchestrate workflow
4. Display results

### 2. Scanner (`engine/scanner/scanner.js`)

**Responsibility**: File discovery and code preparation

**Key Functions**:
- `scan(path)` - Find and process files
- `_findFiles()` - Glob pattern matching
- `_processFile()` - Read and prepare code
- `_sanitizeCode()` - Redact secrets
- `chunkContent()` - Split large files

**Secret Redaction Patterns**:
- API keys (32+ char strings)
- Passwords in assignments
- Tokens and auth strings
- AWS keys
- Private keys

### 3. Gemini Client (`engine/gemini/client.js`)

**Responsibility**: AI-powered vulnerability analysis

**Key Functions**:
- `initialize()` - Setup Gemini model
- `analyzeCode()` - Send code for analysis
- `generateFix()` - Create secure fixes
- `_buildAnalysisPrompt()` - Construct prompts
- `_parseResponse()` - Extract structured data

**Prompt Engineering**:

System Prompt:
- Role: Ethical hacker + security engineer
- Focus: OWASP Top 10
- Output: Structured JSON
- Rules: No false positives, actionable advice

Analysis Prompt:
- Context: Language, file, environment
- Code: Sanitized source
- Instructions: Specific detection rules

**Response Schema**:
```javascript
{
  projectRiskScore: number,
  riskLevel: string,
  summary: string,
  vulnerabilities: [{
    id: string,
    title: string,
    severity: string,
    confidence: number,
    category: string,
    file: string,
    line: number,
    description: string,
    impact: string,
    exploitationScenario: string,
    recommendation: string,
    secureCodeExample: string,
    autoFixSafe: boolean
  }]
}
```

### 4. Risk Calculator (`engine/risk/calculator.js`)

**Responsibility**: Risk scoring and prioritization

**Scoring Algorithm**:
```
score = (severity × 0.4) + 
        (confidence × 100 × 0.3) + 
        (exploitability × 0.2) + 
        (impact × 0.1)
```

**Severity Mapping**:
- CRITICAL: 100 points
- HIGH: 75 points
- MEDIUM: 50 points
- LOW: 25 points

**Risk Levels**:
- CRITICAL: score ≥ 90
- HIGH: score ≥ 70
- MEDIUM: score ≥ 40
- LOW: score < 40

**Key Functions**:
- `calculateProjectRisk()` - Overall assessment
- `_calculateVulnerabilityScore()` - Individual scores
- `_estimateExploitability()` - Attack difficulty
- `_estimateImpact()` - Business impact
- `prioritize()` - Sort by risk

### 5. Console Reporter (`reporter/console.js`)

**Responsibility**: Beautiful terminal output

**Features**:
- Color-coded severity
- Risk score visualization
- Severity breakdown
- Detailed vulnerability cards
- Statistics summary

**Color Scheme**:
- CRITICAL: Red
- HIGH: Yellow
- MEDIUM: Blue
- LOW: Gray

## Data Flow

```
1. User runs: gbh scan ./src
                 ↓
2. CLI parses command
                 ↓
3. Scanner finds files
                 ↓
4. Scanner sanitizes code
                 ↓
5. Gemini analyzes code
                 ↓
6. Parser extracts vulnerabilities
                 ↓
7. Risk Calculator scores
                 ↓
8. Reporter formats output
                 ↓
9. Display to user
```

## Configuration

### Environment Variables (`.env`)
```
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-2.0-flash-exp
GEMINI_TEMPERATURE=0.2
GEMINI_MAX_TOKENS=8192
```

### Default Config (`config/default.js`)
- Gemini settings
- Scan patterns
- Security categories
- Risk weights
- Privacy settings

## Security & Privacy

### Secret Redaction
- Automatic pattern matching
- Configurable via `privacy.redactSecrets`
- Patterns: API keys, passwords, tokens, private keys

### Consent
- Configurable via `privacy.requireConsent`
- Future: Prompt before sending to API

### Offline Mode
- Planned feature
- Local-only analysis
- No API calls

## Error Handling

### API Errors
- Connection failures
- Invalid API key
- Rate limits
- Timeout

### Parsing Errors
- Invalid JSON responses
- Missing required fields
- Malformed data

### File Errors
- File too large
- Unsupported format
- Permission denied

## Performance Considerations

### File Size Limits
- Default: 500KB per file
- Configurable: `scan.maxFileSizeKB`
- Large files: Chunked analysis

### Timeouts
- Default: 30 seconds
- Configurable: `scan.timeoutMs`

### Concurrency
- Sequential file processing
- Future: Parallel analysis

## Extensibility

### Adding New Reporters
1. Create class in `reporter/`
2. Implement `displayReport()`
3. Add format option to CLI

### Adding New Commands
1. Add to `cli/index.js`
2. Follow Commander.js pattern
3. Update documentation

### Custom Vulnerability Rules
1. Add category to config
2. Update Gemini prompts
3. Test with samples

## Testing Strategy

### Current
- Manual testing
- Example vulnerable code
- Doctor command validation

### Planned
- Unit tests (Jest)
- Integration tests
- E2E tests
- CI/CD pipeline

## Future Enhancements

### Auto-Fix
- Safe code transformations
- Backup creation
- User confirmation
- Rollback capability

### CI/CD Integration
- GitHub Actions
- GitLab CI
- Jenkins plugin
- Security gates

### Multi-Language Support
- Python analyzer
- Java analyzer
- Go analyzer
- Language-specific rules

### Enterprise Features
- Team dashboards
- Historical tracking
- Custom policies
- SSO integration

## Dependencies

### Core
- `@google/generative-ai` - Gemini API
- `commander` - CLI framework
- `dotenv` - Environment config

### UI
- `chalk` - Terminal colors
- `cli-table3` - Tables
- `boxen` - Boxes
- `ora` - Spinners

### Utilities
- `glob` - File matching
- `fs/promises` - File operations

## Deployment

### NPM Package
```bash
npm publish
```

### Global Install
```bash
npm install -g gemini-bug-hunter
```

### Local Development
```bash
npm link
```

## Monitoring & Metrics

### Future Metrics
- Scans per day
- Vulnerabilities found
- False positive rate
- Fix adoption rate
- API usage

## License

MIT License - Open source and free to use

---

**Last Updated**: 2026-01-15
**Version**: 1.0.0
**Maintainer**: @holasoymalva
