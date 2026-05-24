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

const profile = {
	name: 'Paolo Donà',
	givenName: 'Paolo',
	familyName: 'Donà',
	url: `${SITE_URL}/`,
	image: SITE_IMAGE,
	jobTitle: 'Chief Information Officer',
	worksFor: {
		name: 'Staycity Group',
		url: 'https://www.staycity.com',
		description: "Europe's leading aparthotel operator"
	},
	description: "Software engineer and startup entrepreneur turned technologist and C-level executive. Chief Information Officer at Staycity Group, Europe's leading aparthotel operator.",
	summary: "Software engineer turned executive. Chief Information Officer at Staycity Group, Europe's leading aparthotel operator. Keenly interested in AI, automation, and building small, fast-paced, world-class technical teams.",
	contacts: [
		{ label: 'LinkedIn', url: 'https://www.linkedin.com/in/paolodona' },
		{ label: 'Work email', url: 'mailto:paolo.dona@staycity.com', value: 'paolo.dona@staycity.com' },
		{ label: 'Personal email', url: 'mailto:paolo.dona@gmail.com', value: 'paolo.dona@gmail.com' }
	],
	locations: ['Dublin, Ireland', 'Northern Italy'],
	interests: ['Artificial Intelligence', 'Automation', 'Software Engineering', 'Technology Leadership', 'Digital Transformation', 'Cycling'],
	about: [
		"I am the Chief Information Officer at Staycity Group, Europe's leading aparthotel operator, where I lead technology strategy and digital transformation across our European portfolio. In my career I've built, led, and learned from technology teams across software engineering, entrepreneurship, and executive leadership.",
		"I'm especially energised by AI and automation right now: how they reshape what a small team can ship, and how to apply them pragmatically to real business problems rather than as a fashion. My happy place is creating and leading small, fast-paced, world-class technical teams.",
		"My background blends deep technical expertise with commercial acumen. I'm as comfortable in the boardroom of a €500M-a-year company as I am in detailed technical discussions with engineers.",
		"Outside of work I'm a keen cyclist across road, gravel, and MTB, and I divide my time between Ireland and Northern Italy."
	]
};

const workHistory = [
	{
		organization: 'Staycity Group',
		url: 'https://www.staycity.com',
		roles: [{ title: 'Chief Information Officer', startDate: '2019-07', endDate: 'present' }],
		summary: 'Responsible for technology vision and strategy across the group, and for the full technology stack: IT, web and mobile apps, data warehouse and BI, security, AI, third-party development, and the IT team, vendors and system integrators.'
	},
	{
		organization: 'Homestay.com',
		url: 'https://www.homestay.com',
		roles: [
			{ title: 'Managing Director', startDate: '2017-06', endDate: '2019-06' },
			{ title: 'CTO & Director', startDate: '2012-01', endDate: '2017-05' }
		],
		summary: 'Co-founded the global homestay marketplace after NiftySchool was acquired by Irish investors. Built the product, engineering, data, and multi-currency payments infrastructure from day one, grew the team to around 30, then stepped up as Managing Director to restructure the company and lead it to break-even.'
	},
	{
		organization: 'NiftySchool.com',
		roles: [{ title: 'Founder, Director & CTO', startDate: '2009-05', endDate: '2012-05' }],
		summary: 'Founded and ran a SaaS platform for language schools. Grew it from a London pilot to 100+ schools across three continents; acquired by Homestay Technologies in May 2012.'
	},
	{
		organization: 'Mobile Interactive Group',
		roles: [
			{ title: 'Product Manager', startDate: '2009-06', endDate: '2011-06' },
			{ title: 'Lead Developer', startDate: '2008-07', endDate: '2009-06' }
		],
		summary: 'Joined as a senior Ruby on Rails developer on large-scale mobile platforms, then moved into product to define and run SMS content distribution and multi-channel marketing platforms used by O2, Vodafone, Three, Sky, Virgin Media and ITV.'
	},
	{
		organization: 'SeeSaw srl',
		location: 'Verona, Italy',
		roles: [{ title: 'Founder & Lead Developer', startDate: '2006-09', endDate: '2008-09' }],
		summary: 'Co-founded and ran a boutique software consultancy serving small and medium-sized customers across Italy, including work for impresa.gov.it and Q8 Petroleum. Also ran the first commercial Ruby on Rails courses in Italy.'
	},
	{
		organization: 'Earlier roles',
		roles: [{ title: 'Software developer / analyst', startDate: '2000', endDate: '2006' }],
		summary: 'Software developer and analyst roles at Archeometra and Supernet S.p.A., working across Java/J2EE, Liferay portals, and Ruby on Rails.'
	}
];

const education = [
	{ institution: 'University of Padua', credential: "Master's degree in Computer Engineering", year: '2000' },
	{ institution: 'Istituto Tecnico Industriale, Belluno', credential: 'Technical diploma in Electronics and Telecommunications', year: '1996' }
];

const sideProjects = [
	{
		name: 'Este Bike Website',
		url: 'https://www.estebike.it',
		summary: 'Local cycling club website for Este Bike in Este, Italy, the home base for road, gravel and MTB rides in the Veneto.'
	},
	{
		name: 'Whatevernote',
		url: 'https://www.whatevernote.com',
		summary: 'A lightning-fast, distributed, offline-first note-taking app.'
	}
];

const books = [
	{ title: 'Scaling People', author: 'Claire Hughes Johnson', url: 'https://press.stripe.com/scaling-people', image: `${SITE_URL}/img/books/scaling-people.jpg` },
	{ title: 'Slow Productivity', author: 'Cal Newport', url: 'https://www.amazon.co.uk/Slow-Productivity-Accomplishment-Without-Burnout/dp/024165291X', image: `${SITE_URL}/img/books/slow-productivity.jpg` },
	{ title: 'Four Thousand Weeks', author: 'Oliver Burkeman', url: 'https://www.amazon.co.uk/Four-Thousand-Weeks-Embrace-thousand/dp/1784704008', image: `${SITE_URL}/img/books/four-thousand-weeks.jpg` },
	{ title: 'Indistractable', author: 'Nir Eyal', url: 'https://www.amazon.co.uk/Indistractable-Control-Your-Attention-Choose/dp/1526610205', image: `${SITE_URL}/img/books/indistractable.jpg` },
	{ title: 'Building a Second Brain', author: 'Tiago Forte', url: 'https://www.amazon.co.uk/s?k=Building+a+Second+Brain+Tiago+Forte', image: `${SITE_URL}/img/books/building-a-second-brain.jpg` },
	{ title: 'Essentialism', author: 'Greg McKeown', url: 'https://www.amazon.co.uk/Essentialism-Disciplined-Pursuit-Greg-McKeown/dp/0753555166', image: `${SITE_URL}/img/books/essentialism.jpg` },
	{ title: 'Priceless', author: 'William Poundstone', url: 'https://www.amazon.co.uk/Priceless-Hidden-Psychology-William-Poundstone/dp/1851688293', image: `${SITE_URL}/img/books/priceless.jpg` },
	{ title: 'High Growth Handbook', author: 'Elad Gil', url: 'https://press.stripe.com/high-growth-handbook', image: `${SITE_URL}/img/books/high-growth-handbook.jpg` },
	{ title: 'Principles', author: 'Ray Dalio', url: 'https://www.principles.com/', image: `${SITE_URL}/img/books/principles.jpg` },
	{ title: 'Principles for Dealing with the Changing World Order', author: 'Ray Dalio', url: 'https://www.principles.com/', image: `${SITE_URL}/img/books/changing-world-order.jpg` },
	{ title: 'How to Avoid a Climate Disaster', author: 'Bill Gates', url: 'https://www.gatesnotes.com/How-to-Avoid-a-Climate-Disaster-announcement', image: `${SITE_URL}/img/books/how-to-avoid-a-climate-disaster.jpg` },
	{ title: 'Permanent Record', author: 'Edward Snowden', url: 'https://www.amazon.co.uk/Permanent-Record-Edward-Snowden/dp/1529035694', image: `${SITE_URL}/img/books/permanent-record.jpg` },
	{ title: 'Freakonomics', author: 'Steven D. Levitt & Stephen J. Dubner', url: 'https://www.amazon.co.uk/Freakonomics-Rogue-Economist-Explores-Everything/dp/0141030089', image: `${SITE_URL}/img/books/freakonomics.jpg` },
	{ title: 'The Coming Wave', author: 'Mustafa Suleyman', url: 'https://the-coming-wave.com/', image: `${SITE_URL}/img/books/the-coming-wave.jpg` },
	{ title: 'Digital Minimalism', author: 'Cal Newport', url: 'https://www.amazon.co.uk/Digital-Minimalism-Choosing-Focused-Noisy/dp/0241341132', image: `${SITE_URL}/img/books/digital-minimalism.jpg` },
	{ title: "It Doesn't Have to Be Crazy at Work", author: 'Jason Fried & David Heinemeier Hansson', url: 'https://basecamp.com/books', image: `${SITE_URL}/img/books/it-doesnt-have-to-be-crazy-at-work.jpg` },
	{ title: 'Deep Work', author: 'Cal Newport', url: 'https://www.amazon.co.uk/Deep-Work-Focused-Success-Distracted/dp/0349411905', image: `${SITE_URL}/img/books/deep-work.jpg` },
	{ title: 'Evil Plans', author: 'Hugh MacLeod', url: 'https://www.amazon.co.uk/Evil-Plans-Having-Road-Domination/dp/1591843847', image: `${SITE_URL}/img/books/evil-plans.jpg` },
	{ title: 'Profit First', author: 'Mike Michalowicz', url: 'https://www.amazon.co.uk/Profit-First-Transform-Cash-Eating-Money-Making/dp/073521414X', image: `${SITE_URL}/img/books/profit-first.jpg` },
	{ title: 'Berkshire Hathaway: Letters to Shareholders 1965-2024', author: 'Warren E. Buffett', url: 'https://www.berkshirehathaway.com/letters/letters.html', image: `${SITE_URL}/img/books/berkshire-hathaway-letters.jpg` },
	{ title: 'Fooled by Randomness', author: 'Nassim Nicholas Taleb', url: 'https://www.fooledbyrandomness.com/', image: `${SITE_URL}/img/books/fooled-by-randomness.jpg` }
];

const STATIC_PAGES = [
	{
		path: '/',
		markdownPath: '/index.html.md',
		title: 'About',
		summary: 'Bio, current role, interests, and contact links.',
		markdown: () => `# Paolo Donà

${profile.summary}

${profile.about.join('\n\n')}

## Contact

${profile.contacts.map(c => `- ${c.label}: ${c.value || c.url}`).join('\n')}
`
	},
	{
		path: '/work.html',
		markdownPath: '/work.html.md',
		title: 'Work',
		summary: 'Career history across software engineering, startups, and C-level technology leadership.',
		markdown: () => `# Work

A short history of the companies and roles Paolo Donà has been part of.

${workHistory.map(item => `## ${item.organization}

${item.roles.map(role => `- ${role.title}: ${role.startDate} to ${role.endDate}`).join('\n')}
${item.url ? `- URL: ${item.url}\n` : ''}${item.location ? `- Location: ${item.location}\n` : ''}
${item.summary}`).join('\n\n')}

## Education

${education.map(item => `- ${item.institution}: ${item.credential}, ${item.year}`).join('\n')}
`
	},
	{
		path: '/side-projects.html',
		markdownPath: '/side-projects.html.md',
		title: 'Side Projects',
		summary: 'Whatevernote, Este Bike, and other projects built outside the day job.',
		markdown: () => `# Side Projects

Things Paolo Donà has built outside the day job.

${sideProjects.map(project => `## ${project.name}

- URL: ${project.url}
- Summary: ${project.summary}`).join('\n\n')}
`
	},
	{
		path: '/bookshelf.html',
		markdownPath: '/bookshelf.html.md',
		title: 'Bookshelf',
		summary: 'Books Paolo Donà is reading or has read and enjoyed.',
		markdown: () => `# Bookshelf

A selection of books Paolo Donà is reading or has read and enjoyed.

${books.map(book => `- [${book.title}](${book.url}) by ${book.author}`).join('\n')}
`
	},
	{
		path: '/blog.html',
		markdownPath: '/blog.html.md',
		title: 'Blog',
		summary: 'Notes and writing on technology, leadership, AI, and life.',
		markdown: () => `# Blog

Occasional notes by Paolo Donà on technology, leadership, AI, and life.

${posts.map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug}.html): ${p.summary}`).join('\n')}
`
	}
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

function postTemplate({ title, date, summary, body, slug, wordCount }) {
	const url = `${SITE_URL}/blog/${slug}.html`;
	const desc = attrEscape(summary || '');
	const ld = {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'BlogPosting',
				'@id': `${url}#post`,
				headline: title,
				description: summary || '',
				datePublished: date,
				dateModified: date,
				author: { '@id': `${SITE_URL}/#paolo` },
				publisher: { '@id': `${SITE_URL}/#paolo` },
				mainEntityOfPage: { '@id': `${url}#webpage` },
				url,
				image: SITE_IMAGE,
				inLanguage: 'en',
				wordCount,
				isPartOf: { '@id': `${SITE_URL}/blog.html#blog` }
			},
			{
				'@type': 'WebPage',
				'@id': `${url}#webpage`,
				url,
				name: `${title} — ${SITE_AUTHOR}`,
				isPartOf: { '@id': `${SITE_URL}/#website` },
				about: { '@id': `${url}#post` },
				primaryImageOfPage: { '@id': `${SITE_IMAGE}#image` },
				inLanguage: 'en'
			},
			{
				'@type': 'BreadcrumbList',
				'@id': `${url}#breadcrumbs`,
				itemListElement: [
					{ '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
					{ '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog.html` },
					{ '@type': 'ListItem', position: 3, name: title, item: url }
				]
			}
		]
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
	<link rel="alternate" type="text/markdown" title="${attrEscape(title)} — Markdown" href="/blog/${slug}.html.md">
	<link href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="/css/custom.css">
	<script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
	</script>
</head>
<body>
	<main class="page">${navHtml}

		<article itemscope itemtype="https://schema.org/BlogPosting">
			<meta itemprop="author" content="Paolo Don&agrave;">
			<link itemprop="mainEntityOfPage" href="${url}">
			<h1 class="post__title" itemprop="headline">${title}</h1>
			<p class="post__date"><time datetime="${date}" itemprop="datePublished">${formatHumanDate(date)}</time></p>
			<div class="post__body" itemprop="articleBody">
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
	const wordCount = content.split(/\s+/).filter(Boolean).length;
	return { slug, title: data.title, date, summary: data.summary || '', body, markdown: content.trim(), wordCount };
});

posts.sort((a, b) => b.date.localeCompare(a.date));

for (const post of posts) {
	const html = postTemplate(post);
	writeFileSync(join(blogDir, `${post.slug}.html`), html);
	writeFileSync(join(blogDir, `${post.slug}.html.md`), `# ${post.title}

- URL: ${SITE_URL}/blog/${post.slug}.html
- Published: ${formatHumanDate(post.date)} (${post.date})
- Summary: ${post.summary}

${post.markdown}
`);
	console.log(`wrote blog/${post.slug}.html`);
	console.log(`wrote blog/${post.slug}.html.md`);
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

for (const page of STATIC_PAGES) {
	writeFileSync(join(root, page.markdownPath.slice(1)), page.markdown().trim() + '\n');
	console.log(`wrote ${page.markdownPath.slice(1)}`);
}

const today = new Date().toISOString().slice(0, 10);
const siteJson = {
	'@context': 'https://schema.org',
	'@type': 'WebSite',
	'@id': `${SITE_URL}/#website`,
	name: SITE_AUTHOR,
	url: SITE_URL,
	description: profile.summary,
	inLanguage: 'en',
	publisher: { '@id': `${SITE_URL}/#paolo` },
	dateModified: today,
	mainEntity: {
		'@type': 'Person',
		'@id': `${SITE_URL}/#paolo`,
		...profile,
		email: profile.contacts.filter(c => c.value).map(c => c.value),
		sameAs: profile.contacts.filter(c => c.label === 'LinkedIn').map(c => c.url),
		knowsAbout: profile.interests,
		hasOccupation: {
			'@type': 'Occupation',
			name: profile.jobTitle,
			occupationLocation: { '@type': 'Country', name: 'Ireland' }
		},
		alumniOf: education.map(item => ({ '@type': 'EducationalOrganization', name: item.institution }))
	},
	pages: STATIC_PAGES.map(page => ({
		name: page.title,
		url: `${SITE_URL}${page.path}`,
		markdownUrl: `${SITE_URL}${page.markdownPath}`,
		description: page.summary
	})),
	workHistory,
	education,
	sideProjects,
	books,
	blogPosts: posts.map(post => ({
		title: post.title,
		url: `${SITE_URL}/blog/${post.slug}.html`,
		markdownUrl: `${SITE_URL}/blog/${post.slug}.html.md`,
		datePublished: post.date,
		summary: post.summary,
		wordCount: post.wordCount
	})),
	feeds: {
		rss: `${SITE_URL}/feed.xml`,
		sitemap: `${SITE_URL}/sitemap.xml`,
		llms: `${SITE_URL}/llms.txt`,
		llmsFull: `${SITE_URL}/llms-full.txt`
	}
};
writeFileSync(join(root, 'site.json'), JSON.stringify(siteJson, null, 2) + '\n');
console.log('wrote site.json');

// sitemap.xml
const sitemapEntries = [
	...STATIC_PAGES.map(p => ({ loc: `${SITE_URL}${p.path}`, lastmod: today })),
	...STATIC_PAGES.map(p => ({ loc: `${SITE_URL}${p.markdownPath}`, lastmod: today })),
	...posts.map(p => ({ loc: `${SITE_URL}/blog/${p.slug}.html`, lastmod: p.date })),
	...posts.map(p => ({ loc: `${SITE_URL}/blog/${p.slug}.html.md`, lastmod: p.date })),
	{ loc: `${SITE_URL}/feed.xml`, lastmod: today },
	{ loc: `${SITE_URL}/llms.txt`, lastmod: today },
	{ loc: `${SITE_URL}/llms-full.txt`, lastmod: today },
	{ loc: `${SITE_URL}/site.json`, lastmod: today }
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
const buildDate = new Date(`${today}T00:00:00Z`).toUTCString();
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

// llms.txt — concise markdown index for LLM crawlers and agents.
const llms = `# Paolo Donà

> ${profile.summary}

Personal website of Paolo Donà (${SITE_URL}). The site is static HTML, with Markdown mirrors and a structured JSON corpus for AI agents. Canonical structured data uses Schema.org JSON-LD and references Paolo as ${SITE_URL}/#paolo.

## Core Pages

${STATIC_PAGES.map(page => `- [${page.title}](${SITE_URL}${page.markdownPath}): ${page.summary}`).join('\n')}

## Structured Data

- [Machine-readable site corpus](${SITE_URL}/site.json): Profile, work history, education, side projects, books, posts, feeds, and canonical URLs as JSON.
- [Full LLM corpus](${SITE_URL}/llms-full.txt): Full Markdown text of the public site and blog posts.
- [Sitemap](${SITE_URL}/sitemap.xml): XML sitemap for crawl discovery.
- [RSS feed](${SITE_URL}/feed.xml): Blog feed.

## Blog Posts

${posts.map(p => `- [${p.title}](${SITE_URL}/blog/${p.slug}.html.md): ${formatHumanDate(p.date)}. ${p.summary}`).join('\n')}

## Contact

${profile.contacts.map(c => `- ${c.label}: ${c.value || c.url}`).join('\n')}

## Optional

- [Human-readable home page](${SITE_URL}/): Canonical visual home page.
- [Human-readable blog index](${SITE_URL}/blog.html): Browser-oriented blog index.
`;
writeFileSync(join(root, 'llms.txt'), llms);
console.log('wrote llms.txt');

// llms-full.txt — full corpus for LLM ingestion.
const llmsFull = `# Paolo Donà — Full Site Corpus

> Personal website of Paolo Donà (${SITE_URL}). This file inlines the full public prose of the static pages and blog posts in Markdown for LLM ingestion. Last built ${today}.

---

${STATIC_PAGES.map(page => `## ${page.title}

- URL: ${SITE_URL}${page.path}
- Markdown: ${SITE_URL}${page.markdownPath}

${page.markdown().trim()}

---`).join('\n\n')}

## Blog posts

${posts.map(p => `### ${p.title}

- URL: ${SITE_URL}/blog/${p.slug}.html
- Markdown: ${SITE_URL}/blog/${p.slug}.html.md
- Published: ${formatHumanDate(p.date)} (${p.date})
- Summary: ${p.summary}

${p.markdown}

---`).join('\n\n')}
`;
writeFileSync(join(root, 'llms-full.txt'), llmsFull);
console.log('wrote llms-full.txt');
