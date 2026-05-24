---
name: add-book
description: Add a book to the bookshelf grid in bookshelf.html. Downloads the cover image, picks the best link (publisher > amazon.co.uk > amazon.com), and inserts a new <li> at the TOP of the grid using the existing markup pattern. Use whenever the user says "add <title> [by <author>] to my bookshelf" or similar.
---

# Add a book to the bookshelf

This skill inserts a new book into `bookshelf.html` and downloads the cover into `img/books/`.

## Inputs you need

- **Title** — required.
- **Author** — required. Ask if not given.
- **Subtitle** — usually omit from caption; only use full title if the user asks.

If only a title is provided and the author is ambiguous, ask before proceeding.

## Steps

### 1. Pick the slug

Slug = lowercase, kebab-case of the **title only** (no author, no subtitle, no edition info, no "the" stripping). Examples:
- "Slow Productivity" → `slow-productivity`
- "It Doesn't Have to Be Crazy at Work" → `it-doesnt-have-to-be-crazy-at-work` (drop apostrophes)
- "Berkshire Hathaway: Letters to Shareholders 1965-2024" → `berkshire-hathaway-letters` (shorten reasonably for very long titles, match existing pattern)

Check `img/books/` first — if `<slug>.jpg` already exists or a near-match exists, ask the user before overwriting.

### 2. Pick the link (priority order)

Use `WebSearch` / `WebFetch` to find the best canonical URL. Priority:

1. **Publisher / official page** — `press.stripe.com`, `basecamp.com/books`, `principles.com`, `gatesnotes.com`, author's own site, `the-coming-wave.com`, `fooledbyrandomness.com`, `berkshirehathaway.com/letters/letters.html`, etc. Always prefer this when one exists.
2. **`amazon.co.uk`** product page (UK store — Paolo is in Ireland/UK market).
3. **`amazon.com`** only as a last resort if no UK listing.

Verify the URL resolves (HTTP 200) with `WebFetch` before using it. Don't link to search-result pages unless absolutely no product page exists (one existing entry uses `amazon.co.uk/s?k=...` for a missing product page — acceptable fallback).

### 3. Find and download the cover

Find the cover image (publisher page, Amazon, Google Books, etc.). Save as `img/books/<slug>.jpg`. Constraints:
- JPEG format.
- Reasonable file size — existing covers range ~10–280KB. If you find a multi-MB image, that's fine but prefer something smaller if available.
- Front cover only — not a 3D mockup, not a banner, not a book + author photo composite.
- Aspect ratio should look like a normal book cover (taller than wide).

Use the `Read` tool to verify the file was downloaded correctly (you'll see it as an image).

### 4. Insert the markup at the TOP of the grid

Open `bookshelf.html`, find `<ul class="book-grid">`, and insert the new `<li>` as the **first child** (immediately after the `<ul>` opening tag, before the existing first `<li>`). Newest books go on top.

**Exact markup template** (match indentation — tabs, 3 levels deep inside `<ul>`):

```html
			<li>
				<a href="<URL>" target="_blank" rel="noopener" title="<Title> — <Author>">
					<img src="img/books/<slug>.jpg" alt="<Title> by <Author>">
					<span class="book-caption"><Title><span class="book-author"><Author></span></span>
				</a>
			</li>
```

**HTML entity rules:**
- Em dash in `title=` and captions: literal `—` (U+2014). The existing file is mixed but recent entries use literal Unicode — keep doing that.
- Apostrophes in titles: `&rsquo;` (e.g. "It Doesn&rsquo;t Have to Be Crazy at Work").
- Ampersands in author names: `&amp;` (e.g. "Steven D. Levitt &amp; Stephen J. Dubner").
- En dash for year ranges in captions: `&ndash;` (e.g. "1965&ndash;2024").
- Accented characters: HTML entities (`&agrave;`, `&eacute;`, etc.).

### 5. Do NOT run the build

`bookshelf.html` is hand-edited — it is **not** a generated file. The build script does not touch it, and the bookshelf does not appear in `llms-full.txt`. So no `npm run build` is needed for a book addition.

### 6. Show the diff and stop

Show the user `git diff bookshelf.html` and `ls img/books/<slug>.jpg`. **Do not commit** unless the user explicitly asks. Do not push.

## Quality checks before reporting done

- [ ] New `<li>` is the FIRST child of `<ul class="book-grid">`.
- [ ] Indentation matches surrounding entries (tabs).
- [ ] `href` is reachable (verified with `WebFetch`).
- [ ] Image file exists at `img/books/<slug>.jpg` and is a real cover image.
- [ ] `title=`, `alt=`, and `<span class="book-caption">` all carry the same title and author.
- [ ] HTML entities are correctly applied (apostrophes, ampersands, accents).

## Examples

User: "Add 'Slow Productivity' to my bookshelf"

→ Slug: `slow-productivity`. Author: Cal Newport (well-known, no need to ask). Link: try `calnewport.com` book page first, fall back to `amazon.co.uk`. Download cover to `img/books/slow-productivity.jpg`. Insert as the first `<li>`. Show diff.

User: "Add Antifragile by Taleb"

→ Slug: `antifragile`. Author: Nassim Nicholas Taleb (full name in markup). Link: try `fooledbyrandomness.com` (his book site) first, then `amazon.co.uk`. Cover → `img/books/antifragile.jpg`. Insert at top. Show diff.
