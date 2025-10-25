# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

This is a simplified static personal website (paolodona.com) originally based on content from a Tumblr blog. The site has been decoupled from Tumblr and refactored into a clean, standalone single-page website.

## Project Structure

The repository contains:
- `index.html` - Main single-page website (simplified from Tumblr's "Selfie" theme)
- `index-tumblr-original.html` - Backup of the original Tumblr-generated HTML
- `download-tumblr.js` - Legacy Node.js web crawler (no longer needed for the current site)

**Active directories:**
- `css/` - Organized stylesheets
  - `styles.css` - Main theme styles (from Selfie theme)
  - `social-icons.css` - Social media icon fonts
  - `custom.css` - Custom color scheme and overrides
- `js/` - JavaScript files
  - `jquery.min.js` - jQuery library
  - `plugins.js` - Owl Carousel and other plugins
  - `site.js` - Minimal site functionality (menu, carousel, scroll)

**Legacy directories (from Tumblr download):**
- `e6lc7yi/` - Original theme files (no longer used)
- `ajax/`, `assets/`, `client/`, `en_US/`, `tag/`, `wp-content/` - Tumblr artifacts (can be removed)

## Key Commands

### Development

The site is a simple static website that can be opened directly in a browser:

```bash
# Open in browser (no build process needed)
open index.html
# or
python3 -m http.server 8000  # Then visit http://localhost:8000
```

### Legacy: Download/Update Site Content (No Longer Used)

The `download-tumblr.js` script was used to mirror content from Tumblr. It's kept for historical reference but is no longer needed for the current simplified site.

## Technical Details

### Site Architecture

The site is a clean, single-page static website with:
- **No dependencies on external services** (Tumblr, analytics, social embeds, etc.)
- **Minimal JavaScript**: Only essential features (menu toggle, header carousel, scroll effects)
- **Responsive design**: Mobile/tablet/desktop breakpoints
- **No build process**: Pure HTML/CSS/JS that works directly in browsers

### JavaScript Functionality

The site includes only essential JavaScript (`js/site.js`):
- Menu toggle and dropdown hover effects
- Owl Carousel for header image rotation (if multiple images)
- Smooth scroll animations (scroll to top, scroll to content)
- Body-ready class for entrance animations

**Removed Tumblr features:**
- Infinite scroll / pagination
- Instagram feeds
- Twitter embeds
- Analytics tracking
- Disqus comments
- Search functionality
- Photoset grids
- Video/audio embed processing

### Theme

Based on "Selfie Premium Theme by PRECRAFTED" (Version 1.5), simplified and decoupled from Tumblr:
- Responsive design (mobile/tablet/desktop breakpoints)
- Header carousel with overlay
- Custom color scheme (blues and oranges)
- Social media icon integration (LinkedIn, Email)
- Owl Carousel for the header background image

## Git Workflow

This repository uses git to track the downloaded static content. The typical workflow is:
1. Run `node download-tumblr.js` to fetch latest content from Tumblr
2. Review changes with `git status` and `git diff`
3. Commit updated content to preserve snapshots over time

The main branch is `master`.

## Important Notes

- This is a **simplified static single-page website** - no build process or compilation needed
- The site is **decoupled from Tumblr** and has no external dependencies
- You can freely edit `index.html`, CSS files in `css/`, and JS files in `js/`
- No package.json or Node.js runtime needed to serve the site
- The site is self-contained and can be served directly from any static web host
- Legacy Tumblr directories (`e6lc7yi/`, `ajax/`, `assets/`, etc.) can be safely removed if desired
