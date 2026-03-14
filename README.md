# Kara3 — Product Content Generator

A lightweight, client-side web app that generates polished marketing copy for **Kara3** jewelry products. No backend or API key required — everything runs in the browser.

---

## Features

| Input | Output |
|---|---|
| Product name | Product title |
| Product type | Short description |
| Material | Long description |
| Gemstone / stone | Instagram caption |
| Primary color | Facebook ad copy |
| Target audience | SEO title |
| Tone of voice | SEO meta description |

- Dark luxury theme with gold accents
- Mobile-friendly responsive layout
- One-click copy for each content block, or "Copy All" to grab everything at once
- SEO character-count indicators for title and meta description
- Multiple variations generated on each run — click **Regenerate** for fresh copy

---

## Setup

No build step or server is needed. Just open the file in a browser.

### Option 1 — Open directly

```bash
# Clone the repository
git clone <repo-url>
cd Kara3

# Open index.html in your default browser
open index.html          # macOS
xdg-open index.html      # Linux
start index.html         # Windows
```

### Option 2 — Local dev server (recommended for Google Fonts to load)

Using Python:

```bash
cd Kara3
python3 -m http.server 8080
# Visit http://localhost:8080
```

Using Node.js (`npx`):

```bash
cd Kara3
npx serve .
# Visit the URL shown in your terminal
```

Using VS Code:
Install the **Live Server** extension, right-click `index.html` → **Open with Live Server**.

---

## File Structure

```
Kara3/
├── index.html   # App markup and layout
├── styles.css   # Dark luxury theme
├── app.js       # Content generation logic
└── README.md    # This file
```

---

## Customisation

- **Add more tones or product types** — edit the `descriptors` and `stoneLines` objects in `app.js`
- **Change brand colors** — update CSS custom properties in the `:root` block of `styles.css`
- **Add your own logo** — replace the `.logo` element in `index.html`

---

## Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge). Requires the Clipboard API for copy functionality — available in all evergreen browsers over HTTPS or localhost.

---

*Built for Kara3 Fine Jewelry.*
