#!/usr/bin/env node
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const postsDir = join(root, 'posts');
const blogDir = join(root, 'blog');
const blogIndex = join(root, 'blog.html');

const SITE_URL = 'https://paolodona.com';
const SITE_AUTHOR = 'Paolo Donà';
const SITE_IMAGE = `${SITE_URL}/img/paolodona.png`;

const STATIC_PAGES = [
	{ path: '/', title: 'About' },
	{ path: '/work.html', title: 'Work' },
	{ path: '/side-projects.html', title: 'Side Projects' },
	{ path: '/bookshelf.html', title: 'Bookshelf' },
	{ path: '/blog.html', title: 'Blog' }
];

if (!existsSync(blogDir)) mkdirSync(blogDir, { recursive: true });

const navHtml = `
		<nav class="site-nav" aria-label="Primary">
			<a href="/">About</a>
			<a href="/work.html">Work</a>
			<a href="/side-projects.html">Side Projects</a>
			<a href="/bookshelf.html">Bookshelf</a>
			<a href="/blog.html">Blog</a>
		</nav>`;

const footerHtml = `
		<footer class="site-footer">
			<span>&copy; 2026 Paolo Don&agrave;</span>
			<span><a href="https://www.linkedin.com/in/paolodona">LinkedIn</a> &middot; <a href="mailto:paolo.dona@gmail.com">Email</a></span>
		</footer>`;

function formatHumanDate(iso) {
	const d = new Date(`${iso}T00:00:00Z`);
	const day = d.getUTCDate();
	const j = day % 10, k = day % 100;
	const suffix = (k >= 11 && k <= 13) ? 'th' : (j === 1 ? 'st' : j === 2 ? 'nd' : j === 3 ? 'rd' : 'th');
	const month = d.toLocaleString('en-GB', { month: 'long', timeZone: 'UTC' });
	return `${day}${suffix} ${month} ${d.getUTCFullYear()}`;
}

const xmlEscape = (s) => String(s)
	.replace(/&/g, '&amp;')
	.replace(/</g, '&lt;')
	.replace(/>/g, '&gt;')
	.replace(/"/g, '&quot;')
	.replace(/'/g, '&apos;');

const attrEscape = (s) => String(s).replace(/"/g, '&quot;');

function postTemplate({ title, date, summary, body, slug }) {
	const url = `${SITE_URL}/blog/${slug}.html`;
	const desc = attrEscape(summary || '');
	const ld = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		headline: title,
		description: summary || '',
		datePublished: date,
		author: { '@type': 'Person', name: SITE_AUTHOR, url: `${SITE_URL}/` },
		mainEntityOfPage: url,
		image: SITE_IMAGE
	};
	return `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>${title} — Paolo Don&agrave;</title>
	<meta name="author" content="Paolo Don&agrave;">
	<meta name="description" content="${desc}">
	<link rel="canonical" href="${url}">
	<meta property="og:type" content="article">
	<meta property="og:site_name" content="Paolo Don&agrave;">
	<meta property="og:title" content="${attrEscape(title)}">
	<meta property="og:description" content="${desc}">
	<meta property="og:url" content="${url}">
	<meta property="og:image" content="${SITE_IMAGE}">
	<meta property="article:author" content="Paolo Don&agrave;">
	<meta property="article:published_time" content="${date}">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="${attrEscape(title)}">
	<meta name="twitter:description" content="${desc}">
	<meta name="twitter:image" content="${SITE_IMAGE}">
	<link rel="shortcut icon" href="/img/paolodona.png">
	<link rel="alternate" type="application/rss+xml" title="Paolo Don&agrave; — Blog" href="/feed.xml">
	<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="/css/custom.css">
	<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
	</script>
</head>
<body>
	<main class="page">${navHtml}

		<article>
			<h1 class="post__title">${title}</h1>
			<p class="post__date">${formatHumanDate(date)}</p>
			<div class="post__body">
${body}
			</div>
		</article>
${footerHtml}
	</main>
	<script src="/js/lightbox.js" defer></script>
</body>
</html>
`;
}

const files = readdirSync(postsDir).filter(f => f.endsWith('.md'));
const posts = files.map(file => {
	const raw = readFileSync(join(postsDir, file), 'utf8');
	const { data, content } = matter(raw);
	const slug = data.slug || file.replace(/\.md$/, '');
	const date = data.date instanceof Date
		? data.date.toISOString().slice(0, 10)
		: String(data.date);
	const body = marked.parse(content);
	return { slug, title: data.title, date, summary: data.summary || '', body };
});

posts.sort((a, b) => b.date.localeCompare(a.date));

for (const post of posts) {
	const html = postTemplate(post);
	writeFileSync(join(blogDir, `${post.slug}.html`), html);
	console.log(`wrote blog/${post.slug}.html`);
}

// blog.html post list
const listHtml = posts.map(p => `			<li class="entry">
				<h2 class="entry__title"><a href="/blog/${p.slug}.html">${p.title}</a></h2>
				<p class="entry__meta">${formatHumanDate(p.date)}</p>
				<p class="entry__summary">${p.summary}</p>
			</li>`).join('\n');

const indexRaw = readFileSync(blogIndex, 'utf8');
const updated = indexRaw.replace(
	/<!-- posts:start -->[\s\S]*?<!-- posts:end -->/,
	`<!-- posts:start -->\n${listHtml}\n\t\t<!-- posts:end -->`
);
writeFileSync(blogIndex, updated);
console.log(`updated blog.html with ${posts.length} post(s)`);

// sitemap.xml
const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = [
	...STATIC_PAGES.map(p => ({ loc: `${SITE_URL}${p.path}`, lastmod: today })),
	...posts.map(p => ({ loc: `${SITE_URL}/blog/${p.slug}.html`, lastmod: p.date }))
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(e => `	<url>
		<loc>${xmlEscape(e.loc)}</loc>
		<lastmod>${e.lastmod}</lastmod>
	</url>`).join('\n')}
</urlset>
`;
writeFileSync(join(root, 'sitemap.xml'), sitemap);
console.log(`wrote sitemap.xml (${sitemapEntries.length} URLs)`);

// feed.xml (RSS 2.0)
const buildDate = new Date().toUTCString();
const rssItems = posts.map(p => {
	const url = `${SITE_URL}/blog/${p.slug}.html`;
	const pubDate = new Date(`${p.date}T00:00:00Z`).toUTCString();
	return `		<item>
			<title>${xmlEscape(p.title)}</title>
			<link>${xmlEscape(url)}</link>
			<guid isPermaLink="true">${xmlEscape(url)}</guid>
			<pubDate>${pubDate}</pubDate>
			<description>${xmlEscape(p.summary)}</description>
		</item>`;
}).join('\n');
const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>Paolo Donà — Blog</title>
		<link>${SITE_URL}/blog.html</link>
		<atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
		<description>Notes and writing by Paolo Donà on technology, leadership, AI and life.</description>
		<language>en</language>
		<lastBuildDate>${buildDate}</lastBuildDate>
${rssItems}
	</channel>
</rss>
`;
writeFileSync(join(root, 'feed.xml'), feed);
console.log(`wrote feed.xml (${posts.length} item(s))`);

// llms.txt — quick markdown index for LLM crawlers
const llms = `# Paolo Donà

> Software engineer turned executive. Chief Information Officer at Staycity Group, Europe's leading aparthotel operator. Keenly interested in AI, automation, and building small, fast-paced, world-class technical teams.

Personal website of Paolo Donà (paolodona.com). Static HTML — all content is in the page bodies, no JavaScript required to read it.

## Pages

- [About](${SITE_URL}/): Bio, current role, interests, and how to get in touch.
- [Work](${SITE_URL}/work.html): Career history — Staycity Group, Homestay.com, NiftySchool / 4niches, Mobile Interactive Group, and earlier roles.
- [Side Projects](${SITE_URL}/side-projects.html): Whatevernote (a fast distributed offline-first note app), the Este Bike cycling-club website, and other experiments.
- [Bookshelf](${SITE_URL}/bookshelf.html): Books currently being read or recently enjoyed.
- [Blog](${SITE_URL}/blog.html): Notes and writing.

## Blog posts

${posts.map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug}.html) (${formatHumanDate(p.date)}) — ${p.summary}`).join('\n')}

## Contact

- LinkedIn: https://www.linkedin.com/in/paolodona
- Email: paolo.dona@gmail.com
- Work email: paolo.dona@staycity.com

## Feeds

- RSS: ${SITE_URL}/feed.xml
- Sitemap: ${SITE_URL}/sitemap.xml
`;
writeFileSync(join(root, 'llms.txt'), llms);
console.log('wrote llms.txt');
