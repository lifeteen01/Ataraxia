# Ataraxia

Marketing site for Ataraxia. Static HTML, CSS and one script, no build step.

```
index.html      overview, store, status board, community, FAQ
tos.html        terms of service
assets/         styles.css, app.js
robots.txt      crawl rules, points at the sitemap
sitemap.xml     both pages
```

Open `index.html` in a browser to view it, or serve the folder with anything
that hands out static files.

## Before it goes live

- Replace `ataraxia.example` in `robots.txt`, `sitemap.xml` and the `canonical`
  tag on each page with the real domain.
- Replace the Discord invite in the community section.
- Replace `support@ataraxia.example` on both pages.
- Fill in the governing-law clause in section 15 of the terms.
- Prices, build numbers and status rows are placeholders. The buy buttons open
  an example dialog; there is no checkout wired up.
