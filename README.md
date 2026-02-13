# Suraj Biswas Personal Brand Site

Premium, bold-playful, dark-themed single-page website built with semantic HTML, modular CSS, and vanilla JS only.

## Mini Style Guide
- Typography
  - Headings: `Space Grotesk` (Google Fonts)
  - Body/UI: `Inter` (Google Fonts)
- Icon language
  - Single icon style: `Lucide`-style outline, 24px grid, round linecaps and joins
  - Icons are inline SVG for performance and styling consistency
- Graphic approach
  - Original SVG-only abstract gradient blobs + subtle procedural noise texture
  - No heavy raster hero photography; visual identity is intentionally geometric, premium, and cohesive
- Motion
  - Transform/opacity transitions only, shared easing: `cubic-bezier(0.2, 0.8, 0.2, 1)`

## Tech
- HTML5 semantic sections
- CSS split by layer:
  - `css/base.css`
  - `css/components.css`
  - `css/sections.css`
  - `css/animations.css`
- Vanilla JS split by responsibility:
  - `js/data.js`
  - `js/main.js`
  - `js/scroll.js`
  - `js/reveal.js`
  - `js/theme.js`
  - `js/games.js`

## Run locally
1. Open `index.html` directly, or
2. Serve with any static server:
   - `python3 -m http.server 8080`
   - then open `http://localhost:8080`

## Deploy
- Upload all files to any static host (Netlify, Vercel static, GitHub Pages, Cloudflare Pages).
- Ensure canonical/OG URLs in `index.html` match your production domain.

## Notes
- Content is editable from `js/data.js`.
- Contact section includes direct email and social links.
- Includes one built-in mini game in `js/games.js`.
