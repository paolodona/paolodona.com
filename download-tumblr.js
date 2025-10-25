#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

class TumblrCrawler {
    constructor(blogUrl, outputDir = './') {
        this.blogUrl = blogUrl;
        this.outputDir = outputDir;
        this.downloadedUrls = new Set();
        this.baseUrl = new URL(blogUrl).origin;
        this.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
    }

    async downloadFile(url, filePath) {
        return new Promise((resolve, reject) => {
            if (this.downloadedUrls.has(url)) {
                resolve();
                return;
            }

            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            const protocol = url.startsWith('https') ? https : http;
            const options = {
                headers: {
                    'User-Agent': this.userAgent,
                    'Accept': '*/*',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'Cache-Control': 'no-cache'
                }
            };

            console.log(`Downloading: ${url}`);

            const request = protocol.get(url, options, (response) => {
                if (response.statusCode === 301 || response.statusCode === 302) {
                    const redirectUrl = response.headers.location;
                    if (redirectUrl) {
                        this.downloadFile(redirectUrl, filePath).then(resolve).catch(reject);
                        return;
                    }
                }

                if (response.statusCode !== 200) {
                    console.warn(`Failed to download ${url}: ${response.statusCode}`);
                    resolve();
                    return;
                }

                const fileStream = fs.createWriteStream(filePath);
                response.pipe(fileStream);

                fileStream.on('finish', () => {
                    fileStream.close();
                    this.downloadedUrls.add(url);
                    console.log(`Downloaded: ${path.basename(filePath)}`);
                    resolve();
                });

                fileStream.on('error', (err) => {
                    fs.unlink(filePath, () => {});
                    reject(err);
                });
            });

            request.on('error', reject);
            request.setTimeout(30000, () => {
                request.destroy();
                reject(new Error('Request timeout'));
            });
        });
    }

    async fetchPage(url, retries = 3) {
        for (let attempt = 1; attempt <= retries; attempt++) {
            try {
                return await new Promise((resolve, reject) => {
                    const protocol = url.startsWith('https') ? https : http;
                    const options = {
                        headers: {
                            'User-Agent': this.userAgent,
                            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                            'Accept-Language': 'en-US,en;q=0.9',
                            'Connection': 'keep-alive'
                        },
                        timeout: 30000
                    };

                    const request = protocol.get(url, options, (response) => {
                        if (response.statusCode === 301 || response.statusCode === 302) {
                            const redirectUrl = response.headers.location;
                            if (redirectUrl) {
                                this.fetchPage(redirectUrl, retries).then(resolve).catch(reject);
                                return;
                            }
                        }

                        if (response.statusCode !== 200) {
                            reject(new Error(`HTTP ${response.statusCode}: ${url}`));
                            return;
                        }

                        let data = '';
                        response.setEncoding('utf8');
                        response.on('data', chunk => data += chunk);
                        response.on('end', () => resolve(data));
                        response.on('error', reject);
                    });

                    request.on('error', reject);
                    request.on('timeout', () => {
                        request.destroy();
                        reject(new Error('Request timeout'));
                    });
                });
            } catch (error) {
                console.warn(`Attempt ${attempt}/${retries} failed for ${url}: ${error.message}`);
                if (attempt === retries) {
                    throw error;
                }
                await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
            }
        }
    }

    extractUrls(html, baseUrl) {
        const urls = {
            images: [],
            css: [],
            js: [],
            pages: []
        };

        // Extract images
        const imgRegex = /<img[^>]+src\s*=\s*["']([^"']+)["']/gi;
        let match;
        while ((match = imgRegex.exec(html)) !== null) {
            urls.images.push(this.resolveUrl(match[1], baseUrl));
        }

        // Extract CSS
        const cssRegex = /<link[^>]+href\s*=\s*["']([^"']+\.css[^"']*)["']/gi;
        while ((match = cssRegex.exec(html)) !== null) {
            urls.css.push(this.resolveUrl(match[1], baseUrl));
        }

        // Extract JS
        const jsRegex = /<script[^>]+src\s*=\s*["']([^"']+\.js[^"']*)["']/gi;
        while ((match = jsRegex.exec(html)) !== null) {
            urls.js.push(this.resolveUrl(match[1], baseUrl));
        }

        // Extract pagination and internal links - only from paolodona.tumblr.com
        const linkRegex = /<a[^>]+href\s*=\s*["']([^"']+)["']/gi;
        while ((match = linkRegex.exec(html)) !== null) {
            const url = this.resolveUrl(match[1], baseUrl);
            try {
                const urlObj = new URL(url);
                if (urlObj.hostname === 'paolodona.tumblr.com' && !url.includes('#')) {
                    urls.pages.push(url);
                }
            } catch (e) {
                // Skip malformed URLs
            }
        }

        return urls;
    }

    resolveUrl(url, baseUrl) {
        try {
            return new URL(url, baseUrl).toString();
        } catch {
            return url;
        }
    }

    getLocalPath(url) {
        try {
            const urlObj = new URL(url);
            let pathname = urlObj.pathname;

            if (pathname === '/' || pathname === '') {
                pathname = '/index.html';
            }

            if (!path.extname(pathname)) {
                pathname += '.html';
            }

            return path.join(this.outputDir, pathname.substring(1));
        } catch {
            const filename = url.split('/').pop() || 'index.html';
            return path.join(this.outputDir, filename);
        }
    }

    async processPage(url, depth = 0, maxDepth = 5) {
        if (depth > maxDepth || this.downloadedUrls.has(url)) {
            return;
        }

        try {
            console.log(`Processing page: ${url} (depth: ${depth})`);
            const html = await this.fetchPage(url);

            // Save the HTML file
            const localPath = this.getLocalPath(url);
            const dir = path.dirname(localPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(localPath, html);
            this.downloadedUrls.add(url);

            // Extract all URLs from the page
            const urls = this.extractUrls(html, url);

            // Download CSS files
            for (const cssUrl of urls.css) {
                try {
                    const cssPath = this.getLocalPath(cssUrl);
                    await this.downloadFile(cssUrl, cssPath);
                } catch (err) {
                    console.warn(`Failed to download CSS: ${cssUrl}`, err.message);
                }
            }

            // Download JS files
            for (const jsUrl of urls.js) {
                try {
                    const jsPath = this.getLocalPath(jsUrl);
                    await this.downloadFile(jsUrl, jsPath);
                } catch (err) {
                    console.warn(`Failed to download JS: ${jsUrl}`, err.message);
                }
            }

            // Download images
            for (const imgUrl of urls.images) {
                try {
                    const imgPath = this.getLocalPath(imgUrl);
                    await this.downloadFile(imgUrl, imgPath);
                } catch (err) {
                    console.warn(`Failed to download image: ${imgUrl}`, err.message);
                }
            }

            // Process pagination and other pages (limited depth)
            for (const pageUrl of [...new Set(urls.pages)]) {
                if (!this.downloadedUrls.has(pageUrl)) {
                    await this.processPage(pageUrl, depth + 1, maxDepth);
                }
            }

        } catch (err) {
            console.error(`Error processing ${url}:`, err.message);
        }
    }

    async crawl() {
        console.log(`Starting crawl of ${this.blogUrl}`);
        console.log(`Output directory: ${this.outputDir}`);

        // Clear output directory
        if (fs.existsSync(this.outputDir)) {
            console.log('Clearing existing files...');
            const files = fs.readdirSync(this.outputDir);
            for (const file of files) {
                if (file !== '.git' && file !== 'download-tumblr.js' && file !== 'node_modules') {
                    const filePath = path.join(this.outputDir, file);
                    const stat = fs.statSync(filePath);
                    if (stat.isDirectory()) {
                        fs.rmSync(filePath, { recursive: true, force: true });
                    } else {
                        fs.unlinkSync(filePath);
                    }
                }
            }
        }

        await this.processPage(this.blogUrl);
        console.log('Crawl completed!');
        console.log(`Downloaded ${this.downloadedUrls.size} unique resources`);
    }
}

// Main execution
if (require.main === module) {
    const blogUrl = 'https://paolodona.tumblr.com';
    const outputDir = './';

    const crawler = new TumblrCrawler(blogUrl, outputDir);
    crawler.crawl().catch(console.error);
}

module.exports = TumblrCrawler;