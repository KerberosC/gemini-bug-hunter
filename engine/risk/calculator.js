/**
 * Risk Score Calculator
 * Calculates normalized risk scores for vulnerabilities
 */

import { DEFAULT_CONFIG } from '../../config/default.js';

class RiskCalculator {
    constructor() {
        this.weights = DEFAULT_CONFIG.riskWeights;
        this.thresholds = DEFAULT_CONFIG.severityThresholds;
    }

    /**
     * Calculate overall project risk score
     * @param {Array} vulnerabilities - Array of vulnerabilities
     * @returns {object} - Risk assessment
     */
    calculateProjectRisk(vulnerabilities) {
        if (!vulnerabilities || vulnerabilities.length === 0) {
            return {
                score: 0,
                level: 'LOW',
                summary: 'No vulnerabilities detected',
            };
        }

        // Calculate weighted average
        const scores = vulnerabilities.map(v => this._calculateVulnerabilityScore(v));
        const avgScore = scores.reduce((sum, s) => sum + s, 0) / scores.length;

        // Count by severity
        const severityCounts = this._countBySeverity(vulnerabilities);

        // Adjust score based on critical/high count
        let adjustedScore = avgScore;
        if (severityCounts.CRITICAL > 0) {
            adjustedScore = Math.max(adjustedScore, 85);
        } else if (severityCounts.HIGH > 0) {
            adjustedScore = Math.max(adjustedScore, 70);
        }

        const level = this._scoreToLevel(adjustedScore);

        return {
            score: Math.round(adjustedScore),
            level,
            summary: this._generateSummary(vulnerabilities, severityCounts),
            severityCounts,
        };
    }

    /**
     * Calculate individual vulnerability score
     * @private
     */
    _calculateVulnerabilityScore(vulnerability) {
        const severityScore = this._severityToScore(vulnerability.severity);
        const confidence = vulnerability.confidence || 0.8;
        const exploitability = this._estimateExploitability(vulnerability);
        const impact = this._estimateImpact(vulnerability);

        const score =
            severityScore * this.weights.severity +
            confidence * 100 * this.weights.confidence +
            exploitability * this.weights.exploitability +
            impact * this.weights.impact;

        return Math.min(100, Math.max(0, score));
    }

    /**
     * Convert severity to numeric score
     * @private
     */
    _severityToScore(severity) {
        const scores = {
            CRITICAL: 100,
            HIGH: 75,
            MEDIUM: 50,
            LOW: 25,
        };
        return scores[severity] || 25;
    }

    /**
     * Estimate exploitability (0-100)
     * @private
     */
    _estimateExploitability(vulnerability) {
        const category = vulnerability.category?.toLowerCase() || '';

        // High exploitability categories
        const highExploit = ['sql injection', 'command injection', 'xss', 'path traversal'];
        if (highExploit.some(cat => category.includes(cat))) {
            return 90;
        }

        // Medium exploitability
        const mediumExploit = ['csrf', 'authentication', 'authorization'];
        if (mediumExploit.some(cat => category.includes(cat))) {
            return 60;
        }

        // Default
        return 40;
    }

    /**
     * Estimate business impact (0-100)
     * @private
     */
    _estimateImpact(vulnerability) {
        const impact = vulnerability.impact?.toLowerCase() || '';

        if (impact.includes('data breach') || impact.includes('database')) {
            return 100;
        }
        if (impact.includes('authentication') || impact.includes('authorization')) {
            return 85;
        }
        if (impact.includes('sensitive') || impact.includes('credential')) {
            return 75;
        }

        return 50;
    }

    /**
     * Convert score to risk level
     * @private
     */
    _scoreToLevel(score) {
        if (score >= this.thresholds.critical) return 'CRITICAL';
        if (score >= this.thresholds.high) return 'HIGH';
        if (score >= this.thresholds.medium) return 'MEDIUM';
        return 'LOW';
    }

    /**
     * Count vulnerabilities by severity
     * @private
     */
    _countBySeverity(vulnerabilities) {
        const counts = {
            CRITICAL: 0,
            HIGH: 0,
            MEDIUM: 0,
            LOW: 0,
        };

        vulnerabilities.forEach(v => {
            const severity = v.severity || 'LOW';
            counts[severity] = (counts[severity] || 0) + 1;
        });

        return counts;
    }

    /**
     * Generate risk summary
     * @private
     */
    _generateSummary(vulnerabilities, counts) {
        const total = vulnerabilities.length;
        const critical = counts.CRITICAL || 0;
        const high = counts.HIGH || 0;

        if (critical > 0) {
            return `Found ${total} vulnerabilities including ${critical} CRITICAL issues requiring immediate attention`;
        }
        if (high > 0) {
            return `Found ${total} vulnerabilities including ${high} HIGH severity issues`;
        }
        if (total > 0) {
            return `Found ${total} vulnerabilities that should be reviewed`;
        }

        return 'No significant vulnerabilities detected';
    }

    /**
     * Prioritize vulnerabilities for fixing
     * @param {Array} vulnerabilities - Array of vulnerabilities
     * @returns {Array} - Sorted vulnerabilities
     */
    prioritize(vulnerabilities) {
        return vulnerabilities
            .map(v => ({
                ...v,
                score: this._calculateVulnerabilityScore(v),
            }))
            .sort((a, b) => b.score - a.score);
    }
}

export default RiskCalculator;
