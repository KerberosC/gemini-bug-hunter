/**
 * Console Reporter
 * Beautiful CLI output for vulnerability reports
 */

import chalk from 'chalk';
import Table from 'cli-table3';
import boxen from 'boxen';

class ConsoleReporter {
    /**
     * Display scan results
     */
    displayReport(report) {
        console.log('\n');

        // Header
        this._displayHeader(report);

        // Risk Overview
        this._displayRiskOverview(report);

        // Vulnerabilities
        if (report.vulnerabilities && report.vulnerabilities.length > 0) {
            this._displayVulnerabilities(report.vulnerabilities);
        } else {
            this._displayNoVulnerabilities();
        }

        // Footer
        this._displayFooter(report);

        console.log('\n');
    }

    /**
     * Display header
     * @private
     */
    _displayHeader(report) {
        const title = boxen(
            chalk.bold.white('🛡️  GEMINI BUG HUNTER REPORT'),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'double',
                borderColor: 'cyan',
            }
        );
        console.log(title);
    }

    /**
     * Display risk overview
     * @private
     */
    _displayRiskOverview(report) {
        const risk = report.projectRisk || {};
        const score = risk.score || 0;
        const level = risk.level || 'LOW';

        // Color based on risk level
        const levelColor = this._getLevelColor(level);
        const scoreBar = this._createScoreBar(score);

        console.log(chalk.bold('\n📊 Risk Assessment\n'));
        console.log(`  Risk Score: ${levelColor(score + '%')} ${scoreBar}`);
        console.log(`  Risk Level: ${levelColor(level)}`);
        console.log(`  Summary: ${chalk.gray(risk.summary || 'N/A')}\n`);

        // Severity breakdown
        if (risk.severityCounts) {
            this._displaySeverityBreakdown(risk.severityCounts);
        }
    }

    /**
     * Display severity breakdown
     * @private
     */
    _displaySeverityBreakdown(counts) {
        console.log(chalk.bold('🎯 Severity Breakdown\n'));

        const items = [
            { label: 'CRITICAL', count: counts.CRITICAL || 0, color: chalk.red.bold },
            { label: 'HIGH', count: counts.HIGH || 0, color: chalk.yellow.bold },
            { label: 'MEDIUM', count: counts.MEDIUM || 0, color: chalk.blue },
            { label: 'LOW', count: counts.LOW || 0, color: chalk.gray },
        ];

        items.forEach(item => {
            if (item.count > 0) {
                console.log(`  ${item.color('●')} ${item.label}: ${item.color(item.count)}`);
            }
        });

        console.log('');
    }

    /**
     * Display vulnerabilities
     * @private
     */
    _displayVulnerabilities(vulnerabilities) {
        console.log(chalk.bold('🔍 Detected Vulnerabilities\n'));

        vulnerabilities.forEach((vuln, index) => {
            this._displayVulnerability(vuln, index + 1);
        });
    }

    /**
     * Display single vulnerability
     * @private
     */
    _displayVulnerability(vuln, index) {
        const severityColor = this._getSeverityColor(vuln.severity);
        const icon = this._getSeverityIcon(vuln.severity);

        console.log(severityColor(`${icon} [${index}] ${vuln.title}`));
        console.log(chalk.gray(`    File: ${vuln.file}:${vuln.line || '?'}`));
        console.log(chalk.gray(`    Category: ${vuln.category}`));
        console.log(chalk.gray(`    Severity: ${vuln.severity} | Confidence: ${(vuln.confidence * 100).toFixed(0)}%`));
        console.log(`\n    ${chalk.white(vuln.description)}`);

        if (vuln.impact) {
            console.log(`\n    ${chalk.yellow('⚠️  Impact:')} ${vuln.impact}`);
        }

        if (vuln.recommendation) {
            console.log(`\n    ${chalk.green('✓ Fix:')} ${vuln.recommendation}`);
        }

        if (vuln.autoFixSafe) {
            console.log(chalk.green('    ✨ Auto-fix available'));
        }

        console.log(chalk.gray('\n    ' + '─'.repeat(80) + '\n'));
    }

    /**
     * Display no vulnerabilities message
     * @private
     */
    _displayNoVulnerabilities() {
        const message = boxen(
            chalk.green.bold('✓ No vulnerabilities detected!\n\n') +
            chalk.gray('Your code looks secure.'),
            {
                padding: 1,
                margin: 1,
                borderStyle: 'round',
                borderColor: 'green',
            }
        );
        console.log(message);
    }

    /**
     * Display footer
     * @private
     */
    _displayFooter(report) {
        const stats = report.scanStats || {};

        console.log(chalk.gray('\n📈 Scan Statistics\n'));
        console.log(chalk.gray(`  Files Scanned: ${stats.filesScanned || 0}`));
        console.log(chalk.gray(`  Lines Analyzed: ${stats.linesAnalyzed || 0}`));
        console.log(chalk.gray(`  Duration: ${stats.duration || 'N/A'}`));
        console.log(chalk.gray(`  Powered by: Gemini 3 API\n`));
    }

    /**
     * Create visual score bar
     * @private
     */
    _createScoreBar(score) {
        const barLength = 20;
        const filled = Math.round((score / 100) * barLength);
        const empty = barLength - filled;

        let color = chalk.green;
        if (score >= 70) color = chalk.red;
        else if (score >= 40) color = chalk.yellow;

        return color('█'.repeat(filled)) + chalk.gray('░'.repeat(empty));
    }

    /**
     * Get color for risk level
     * @private
     */
    _getLevelColor(level) {
        const colors = {
            CRITICAL: chalk.red.bold,
            HIGH: chalk.yellow.bold,
            MEDIUM: chalk.blue,
            LOW: chalk.green,
        };
        return colors[level] || chalk.white;
    }

    /**
     * Get color for severity
     * @private
     */
    _getSeverityColor(severity) {
        const colors = {
            CRITICAL: chalk.red.bold,
            HIGH: chalk.yellow,
            MEDIUM: chalk.blue,
            LOW: chalk.gray,
        };
        return colors[severity] || chalk.white;
    }

    /**
     * Get icon for severity
     * @private
     */
    _getSeverityIcon(severity) {
        const icons = {
            CRITICAL: '🔴',
            HIGH: '🟡',
            MEDIUM: '🔵',
            LOW: '⚪',
        };
        return icons[severity] || '●';
    }

    /**
     * Display progress spinner message
     */
    displayProgress(message) {
        console.log(chalk.cyan(`⏳ ${message}...`));
    }

    /**
     * Display success message
     */
    displaySuccess(message) {
        console.log(chalk.green(`✓ ${message}`));
    }

    /**
     * Display error message
     */
    displayError(message) {
        console.log(chalk.red(`✗ ${message}`));
    }

    /**
     * Display warning message
     */
    displayWarning(message) {
        console.log(chalk.yellow(`⚠️  ${message}`));
    }
}

export default ConsoleReporter;
