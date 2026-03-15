# Kara3 — Commerce Engine

An all-in-one, client-side marketing content generator for **Kara3** fine jewellery. No backend, no API key, no build step — everything runs in the browser.

---

## What It Does

Fill in a **Product Brief** and click **Generate Content** to produce six full panels of marketing material simultaneously:

| Panel | Content produced |
|---|---|
| **Product** | Title options, luxury name suggestions, positioning summary, short & long descriptions, bullet highlights, CTA variations |
| **Ad Copy** | Meta/Facebook primary text, short/long/hook/urgency/luxury/gift/trust/retargeting copies, headline bank |
| **SEO** | SEO title, meta description, keyword list, product tags, collection SEO text, image alt text (×3) |
| **Social** | Instagram caption (full & short), Story slides, Reel caption, TikTok hook ideas, UGC script, influencer brief, FAQ comment replies |
| **Collection** | Collection name ideas, campaign theme, collection description, slogans, taglines, launch angle, seasonal angle |
| **Persona** | Buyer persona, why-they-buy, emotional selling angle, objection handling, value proposition |

---

## Form Inputs

| Field | Options |
|---|---|
| Product Name | Free text |
| Product Type | Ring, Necklace, Bracelet, Earrings, Pendant, Cuff, Anklet, Brooch |
| Material | Sterling Silver, 14K/18K Gold, Rose Gold, White Gold, Gold Vermeil, Platinum… |
| Gemstone | Moissanite, Zultanite, Diamond, Ruby, Sapphire, Emerald, Pearl, and more |
| Color / Finish | Free text (e.g. Icy White, Champagne) |
| Target Audience | Women 25–35, Women 35–50, Men 25–40, Couples/Gifts, Brides, Luxury Shoppers, Minimalists, Fashion-forward |
| Tone of Voice | Luxurious & Elegant, Romantic & Poetic, Bold & Confident, Minimalist & Clean, Timeless & Classic, Warm & Gifting |
| Price Positioning | Entry Luxury, Mid Luxury, High Luxury, Ultra Premium |
| Campaign Goal | New Launch, Brand Awareness, Sales/Conversion, Gift Season, Bridal, Valentine's Day, Mother's Day, Anniversary |

**Quick Presets:** Moissanite Ring · Zultanite Necklace · Silver Bracelet · Gold Earrings

---

## Features

- **6-panel tabbed output** — navigate by content type
- **Language toggle** — EN / TR interface
- **Collapsible Product Brief** sidebar
- **Per-card Copy** buttons + **Copy All** + **Download .txt**
- **SEO character-count indicators** (title ≤60, meta ≤160)
- **Randomised variations** — click Generate again for fresh copy
- Dark luxury theme with gold accents, fully responsive

---

## Setup

No build step or server required. Open `index.html` directly in any modern browser, or serve locally:

```bash
# Clone
git clone <repo-url>
cd Kara3

# Option 1 — open directly
open index.html          # macOS
xdg-open index.html      # Linux

# Option 2 — local server (recommended for Google Fonts)
python3 -m http.server 8080
# → http://localhost:8080

# Option 3 — Node
npx serve .
```

VS Code: right-click `index.html` → **Open with Live Server**.

---

## File Structure

```
Kara3/
├── index.html   # App markup — 6-panel Commerce Engine layout
├── styles.css   # Dark luxury theme with gold accents
├── app.js       # All content generation logic (zero dependencies)
└── README.md    # This file
```

---

## Customisation

- **Add tones** — extend the `TONES` object in `app.js`
- **Add gemstones** — extend `STONE_LINES` in `app.js`
- **Add presets** — extend `PRESETS` in `app.js`
- **Add a language** — extend `i18n` in `app.js` and add an `<option>` to `#langSelect`
- **Brand colours** — update CSS custom properties in the `:root` block of `styles.css`

---

## Browser Support

All modern browsers (Chrome, Firefox, Safari, Edge). Requires the Clipboard API for copy functionality — available in all evergreen browsers over HTTPS or localhost.

---

*Built for Kara3 Fine Jewellery.*
