/**
 * Code Scanner
 * Collects and prepares code for Gemini analysis
 */

import fs from 'fs/promises';
import path from 'path';
import { glob } from 'glob';
import { DEFAULT_CONFIG } from '../../config/default.js';

class Scanner {
    constructor(config = {}) {
        this.config = { ...DEFAULT_CONFIG.scan, ...config };
    }

    /**
     * Scan a directory or file
     * @param {string} targetPath - Path to scan
     * @returns {Promise<Array>} - Array of file objects
     */
    async scan(targetPath) {
        const stats = await fs.stat(targetPath);

        if (stats.isFile()) {
            return [await this._processFile(targetPath)];
        }

        // Scan directory
        const files = await this._findFiles(targetPath);
        const processed = [];

        for (const file of files) {
            try {
                const fileData = await this._processFile(file);
                if (fileData) {
                    processed.push(fileData);
                }
            } catch (error) {
                console.warn(`⚠️  Skipping ${file}: ${error.message}`);
            }
        }

        return processed;
    }

    /**
     * Find all relevant files in directory
     * @private
     */
    async _findFiles(dirPath) {
        const patterns = this.config.includeExtensions.map(
            ext => `**/*${ext}`
        );

        const files = await glob(patterns, {
            cwd: dirPath,
            absolute: true,
            ignore: this.config.excludePatterns,
            nodir: true,
        });

        return files;
    }

    /**
     * Process a single file
     * @private
     */
    async _processFile(filePath) {
        const stats = await fs.stat(filePath);
        const sizeKB = stats.size / 1024;

        // Check file size
        if (sizeKB > this.config.maxFileSizeKB) {
            throw new Error(`File too large (${sizeKB.toFixed(2)}KB > ${this.config.maxFileSizeKB}KB)`);
        }

        // Read file content
        const content = await fs.readFile(filePath, 'utf-8');

        // Detect language
        const language = this._detectLanguage(filePath);

        // Sanitize content
        const sanitized = this._sanitizeCode(content);

        return {
            path: filePath,
            relativePath: path.basename(filePath),
            content: sanitized,
            originalContent: content,
            language,
            size: stats.size,
            lines: content.split('\n').length,
        };
    }

    /**
     * Detect programming language from file extension
     * @private
     */
    _detectLanguage(filePath) {
        const ext = path.extname(filePath).toLowerCase();
        const languageMap = {
            '.js': 'JavaScript',
            '.jsx': 'JavaScript (React)',
            '.ts': 'TypeScript',
            '.tsx': 'TypeScript (React)',
            '.py': 'Python',
            '.java': 'Java',
            '.go': 'Go',
            '.rb': 'Ruby',
            '.php': 'PHP',
            '.cs': 'C#',
            '.cpp': 'C++',
            '.c': 'C',
            '.h': 'C/C++ Header',
        };

        return languageMap[ext] || 'Unknown';
    }

    /**
     * Sanitize code by redacting secrets
     * @private
     */
    _sanitizeCode(code) {
        if (!DEFAULT_CONFIG.privacy.redactSecrets) {
            return code;
        }

        let sanitized = code;

        // Redact common secret patterns
        const secretPatterns = [
            // API Keys
            /(['"`])([A-Za-z0-9_-]{32,})(['"`])/g,
            // Passwords in assignments
            /(password|passwd|pwd)\s*[:=]\s*(['"`])([^'"`]+)(['"`])/gi,
            // Tokens
            /(token|auth|secret|key)\s*[:=]\s*(['"`])([^'"`]+)(['"`])/gi,
            // AWS Keys
            /(AKIA[0-9A-Z]{16})/g,
            // Private Keys
            /(-----BEGIN (RSA |EC )?PRIVATE KEY-----[\s\S]*?-----END (RSA |EC )?PRIVATE KEY-----)/g,
        ];

        secretPatterns.forEach(pattern => {
            sanitized = sanitized.replace(pattern, (match) => {
                return match.replace(/[A-Za-z0-9]/g, '*');
            });
        });

        return sanitized;
    }

    /**
     * Chunk large files for analysis
     * @param {string} content - File content
     * @returns {Array<string>} - Array of chunks
     */
    chunkContent(content) {
        const chunks = [];
        const lines = content.split('\n');
        let currentChunk = [];
        let currentSize = 0;

        for (const line of lines) {
            const lineSize = line.length;

            if (currentSize + lineSize > this.config.chunkSize && currentChunk.length > 0) {
                chunks.push(currentChunk.join('\n'));
                currentChunk = [];
                currentSize = 0;
            }

            currentChunk.push(line);
            currentSize += lineSize;
        }

        if (currentChunk.length > 0) {
            chunks.push(currentChunk.join('\n'));
        }

        return chunks;
    }

    /**
     * Get file statistics
     * @param {Array} files - Processed files
     * @returns {object} - Statistics
     */
    getStatistics(files) {
        const totalFiles = files.length;
        const totalLines = files.reduce((sum, f) => sum + f.lines, 0);
        const totalSize = files.reduce((sum, f) => sum + f.size, 0);

        const languages = {};
        files.forEach(f => {
            languages[f.language] = (languages[f.language] || 0) + 1;
        });

        return {
            totalFiles,
            totalLines,
            totalSizeKB: (totalSize / 1024).toFixed(2),
            languages,
        };
    }
}

export default Scanner;
