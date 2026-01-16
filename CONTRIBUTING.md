# Contributing to Gemini Bug Hunter

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Development Setup

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create `.env` with your Gemini API key
5. Run tests: `npm start doctor`

## Project Structure

```
gemini-bug-hunter/
├── cli/              # CLI interface
├── engine/           # Core analysis engine
│   ├── gemini/      # Gemini API integration
│   ├── scanner/     # Code scanning
│   └── risk/        # Risk calculation
├── reporter/         # Output formatting
├── config/          # Configuration
└── examples/        # Sample code
```

## Code Style

- Use ES6+ modules
- Follow existing patterns
- Add JSDoc comments
- Keep functions focused and small
- Use meaningful variable names

## Adding Features

### New Vulnerability Detection

1. Add category to `config/default.js`
2. Update Gemini prompts in `engine/gemini/client.js`
3. Test with sample vulnerable code
4. Update documentation

### New Commands

1. Add command in `cli/index.js`
2. Follow existing command structure
3. Add to README and QUICKSTART
4. Test thoroughly

### New Reporters

1. Create new file in `reporter/`
2. Implement display methods
3. Add format option to CLI
4. Document usage

## Testing

Currently manual testing:

```bash
# Test on example code
npm start scan examples/

# Test specific features
npm start doctor
npm start explain "XSS"
```

Future: Automated test suite planned

## Pull Request Process

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Update documentation
5. Submit PR with clear description

## Reporting Issues

When reporting bugs, include:

- Node.js version
- Operating system
- Steps to reproduce
- Expected vs actual behavior
- Error messages

## Feature Requests

We welcome feature requests! Please:

- Check existing issues first
- Describe the use case
- Explain expected behavior
- Consider implementation approach

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers
- Focus on constructive feedback
- Help others learn

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

## Questions?

Open an issue or reach out to [@holasoymalva](https://github.com/holasoymalva)

---

Thank you for contributing! 🙏
