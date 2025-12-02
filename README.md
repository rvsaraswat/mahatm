# Mahatm Innovations Website

 A modern, AI‑themed landing page for Mahatm Innovations with a lightweight interactive mini‑game (Neuron Connect) to engage visitors.

## Features
- Tailwind CSS (CDN) + Alpine.js (CDN) for fast, static delivery
- SEO meta: title, description, Open Graph/Twitter cards, canonical
 - Analytics: Plausible analytics integrated for `mahatm.in`
- Accessible, responsive layout with dark theme and subtle glow aesthetics
- Simple puzzle game: connect neurons without crossing lines
 - One‑click solver: "Solve" button auto‑solves the puzzle
- Contact form (Formspree placeholder) + social links

## Development
This repo is static HTML/JS. Open `index.html` in a browser, or serve locally.

### Run locally (PowerShell)
```
python -m http.server 8080 ; Start-Process http://localhost:8080
```

## Deployment (GitHub Pages)
- Ensure `CNAME` contains `mahatm.in`
- Push `index.html`, `js/game.js`, `favicon.ico`, and images (e.g., `og-card.png`)
- In repo settings, enable GitHub Pages for the `main`/`master` branch root
 - Optional: Configure Plausible for `mahatm.in` to view analytics

## TODO
- Replace Formspree endpoint with your form URL
- Add `favicon.ico` and `og-card.png`
- Optional: Add analytics (Plausible) and `sitemap.xml`, `robots.txt`
 - Improve the game: add levels, timer/score, shareable results
