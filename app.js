'use strict';

// ─── Utilities ───────────────────────────────────────────────────────────────

document.getElementById('year').textContent = new Date().getFullYear();

function get(id) {
  return document.getElementById(id).value.trim();
}

function set(id, text) {
  document.getElementById(id).textContent = text;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function showToast(msg = 'Copied to clipboard!') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2200);
}

// ─── Copy Helpers ─────────────────────────────────────────────────────────────

function copyCard(id) {
  const text = document.getElementById(id).textContent;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
}

function copyAll() {
  const ids = ['productTitle', 'shortDesc', 'longDesc', 'instagramCaption', 'facebookAd', 'seoTitle', 'seoMeta'];
  const labels = {
    productTitle: 'PRODUCT TITLE',
    shortDesc: 'SHORT DESCRIPTION',
    longDesc: 'LONG DESCRIPTION',
    instagramCaption: 'INSTAGRAM CAPTION',
    facebookAd: 'FACEBOOK AD COPY',
    seoTitle: 'SEO TITLE',
    seoMeta: 'SEO META DESCRIPTION',
  };
  const text = ids
    .map(id => `--- ${labels[id]} ---\n${document.getElementById(id).textContent}`)
    .join('\n\n');
  navigator.clipboard.writeText(text).then(() => showToast('All content copied!'));
}

// ─── Content Templates ────────────────────────────────────────────────────────

const descriptors = {
  'Luxurious & Elegant': {
    adj:    ['exquisite', 'opulent', 'refined', 'sophisticated', 'timeless', 'impeccable', 'magnificent'],
    verbs:  ['adorns', 'elevates', 'graces', 'enchants', 'captivates', 'embodies'],
    nouns:  ['luxury', 'elegance', 'prestige', 'grandeur', 'splendour', 'distinction'],
    cta:    ['Indulge in unparalleled luxury.', 'Reserve yours today.', 'Elevate every moment.'],
    instaEnding: ['#FineJewelry #LuxuryJewelry #Kara3'],
  },
  'Romantic & Poetic': {
    adj:    ['enchanting', 'dreamy', 'ethereal', 'radiant', 'tender', 'celestial', 'luminous'],
    verbs:  ['whispers', 'blooms', 'shimmers', 'glows', 'dances', 'blossoms'],
    nouns:  ['romance', 'poetry', 'devotion', 'magic', 'grace', 'wonder'],
    cta:    ['Tell your story.', 'A love made to last forever.', 'For the moments that matter most.'],
    instaEnding: ['#LoveJewelry #RomanticGifts #Kara3'],
  },
  'Bold & Confident': {
    adj:    ['striking', 'powerful', 'daring', 'statement-making', 'fierce', 'iconic', 'unapologetic'],
    verbs:  ['commands', 'defines', 'asserts', 'dominates', 'inspires', 'transforms'],
    nouns:  ['power', 'confidence', 'presence', 'attitude', 'statement', 'edge'],
    cta:    ['Own your moment.', 'Make a statement.', 'Be unforgettable.'],
    instaEnding: ['#BoldJewelry #StatementPiece #Kara3'],
  },
  'Minimalist & Clean': {
    adj:    ['understated', 'sleek', 'pure', 'effortless', 'quiet', 'clean', 'considered'],
    verbs:  ['simplifies', 'complements', 'refines', 'defines', 'balances', 'speaks'],
    nouns:  ['simplicity', 'balance', 'purity', 'clarity', 'harmony', 'intention'],
    cta:    ['Less is more.', 'Quietly extraordinary.', 'Where simplicity meets craft.'],
    instaEnding: ['#MinimalistJewelry #CleanDesign #Kara3'],
  },
  'Playful & Trendy': {
    adj:    ['vibrant', 'fun', 'fresh', 'chic', 'lively', 'spirited', 'on-trend'],
    verbs:  ['sparkles', 'pops', 'shines', 'catches', 'delights', 'energises'],
    nouns:  ['joy', 'fun', 'energy', 'style', 'trend', 'personality'],
    cta:    ['Treat yourself.', 'Fresh drops, just for you.', 'Add a little sparkle to your day.'],
    instaEnding: ['#TrendyJewelry #OOTD #Kara3'],
  },
  'Timeless & Classic': {
    adj:    ['classic', 'enduring', 'iconic', 'heritage', 'perennial', 'ageless', 'heirloom-quality'],
    verbs:  ['endures', 'transcends', 'honours', 'preserves', 'celebrates', 'stands for'],
    nouns:  ['heritage', 'legacy', 'tradition', 'craftsmanship', 'timelessness', 'permanence'],
    cta:    ['A piece for generations.', 'Crafted to last a lifetime.', 'Tradition reimagined.'],
    instaEnding: ['#TimelessJewelry #ClassicDesign #Kara3'],
  },
};

const audiencePhrases = {
  'Women 25–35':       'the modern woman',
  'Women 35–50':       'the discerning woman',
  'Men 25–40':         'the contemporary man',
  'Couples / Gifts':   'those who cherish connection',
  'Brides / Bridal':   'the bride-to-be',
  'Luxury Shoppers':   'the connoisseur of fine luxury',
  'Minimalists':       'the lover of considered design',
  'Fashion-forward':   'the style-forward individual',
};

const stoneLines = {
  Diamond:          'set with a brilliant diamond that catches every light',
  Ruby:             'adorned with a deep red ruby, symbol of passion and power',
  Sapphire:         'featuring a velvety sapphire, evoking the depth of the night sky',
  Emerald:          'centred on a lush emerald, rich with natural beauty',
  Pearl:            'graced with a lustrous pearl, a tribute to the ocean\'s quiet wonder',
  Amethyst:         'set with a violet amethyst, serene and contemplative',
  Opal:             'adorned with a play-of-colour opal, alive with shifting hues',
  Turquoise:        'featuring a sky-blue turquoise, grounding and ancient',
  Moonstone:        'set with an iridescent moonstone, otherworldly and romantic',
  Topaz:            'featuring a warm topaz, radiant and uplifting',
  Garnet:           'adorned with a deep garnet, rich in warmth and depth',
  'Cubic Zirconia': 'set with precision-cut cubic zirconia for dazzling brilliance',
};

const hashtags = {
  Ring:      '#Ring #JewelryRing',
  Necklace:  '#Necklace #JewelryNecklace',
  Bracelet:  '#Bracelet #JewelryBracelet',
  Earrings:  '#Earrings #JewelryEarrings',
  Pendant:   '#Pendant #JewelryPendant',
  Anklet:    '#Anklet #JewelryAnklet',
  Brooch:    '#Brooch #JewelryBrooch',
  Cuff:      '#Cuff #CuffBracelet',
};

// ─── Generator ────────────────────────────────────────────────────────────────

function generateContent() {
  const name     = get('productName')    || 'Signature Piece';
  const type     = get('productType')    || 'Jewelry';
  const material = get('material')       || 'fine metal';
  const stone    = get('stone')          || '';
  const color    = get('color')          || '';
  const audience = get('targetAudience') || '';
  const tone     = get('toneOfVoice')    || 'Luxurious & Elegant';

  const lang = descriptors[tone] || descriptors['Luxurious & Elegant'];
  const audiencePhrase = audiencePhrases[audience] || 'the discerning individual';
  const stoneLine = stoneLines[stone] || '';
  const colorNote = color ? ` in a beautiful ${color} finish` : '';
  const productHashtags = hashtags[type] || '#Jewelry';

  const adj1 = pick(lang.adj);
  const adj2 = pick(lang.adj.filter(a => a !== adj1));
  const verb = pick(lang.verbs);
  const noun = pick(lang.nouns);

  // ── Product Title ─────────────────────────────────────────────────────────
  const titleFormats = [
    `${name} — ${adj1.charAt(0).toUpperCase() + adj1.slice(1)} ${material} ${type}`,
    `The ${name} ${type} | Kara3`,
    `${name} ${type} in ${material}${stone ? ' & ' + stone : ''}`,
  ];
  const productTitle = pick(titleFormats);

  // ── Short Description ─────────────────────────────────────────────────────
  const shortDesc = [
    `An ${adj1} ${type.toLowerCase()} crafted from ${material}${stoneLine ? ', ' + stoneLine : ''}${colorNote}. `,
    `Designed for ${audiencePhrase}, the ${name} ${verb} with quiet ${noun}.`,
  ].join('');

  // ── Long Description ──────────────────────────────────────────────────────
  const longDesc = [
    `Introducing the ${name} — a truly ${adj1} piece from Kara3's ${tone.toLowerCase()} collection.`,
    `\n\nHandcrafted from ${material}${stoneLine ? ' and ' + stoneLine : ''}${colorNote}, `,
    `this ${type.toLowerCase()} is an embodiment of ${noun} and meticulous craftsmanship. `,
    `Every curve, every detail has been considered to create a piece that ${verb} effortlessly.`,
    `\n\nPerfect for ${audiencePhrase}, the ${name} transitions seamlessly from intimate moments to grand occasions. `,
    `Whether gifted or chosen for yourself, it carries with it the promise of enduring beauty and the unmistakable signature of Kara3.`,
    `\n\n${pick(lang.cta)}`,
  ].join('');

  // ── Instagram Caption ─────────────────────────────────────────────────────
  const instagramCaption = [
    `${pick(['✦', '◆', '—', '·'])} The ${name}. ${adj1.charAt(0).toUpperCase() + adj1.slice(1)}, ${adj2}, unmistakable.`,
    `\n\nCrafted from ${material}${stoneLine ? ', ' + stoneLine : ''}. `,
    `Made for ${audiencePhrase} who ${pick(['know their worth.', 'seek the extraordinary.', 'live beautifully.', 'wear their story.'])}`,
    `\n\n${pick(lang.cta)}`,
    `\n\n${pick(lang.instaEnding)} ${productHashtags} #Kara3Jewelry #LuxuryJewellery`,
  ].join('');

  // ── Facebook Ad Copy ──────────────────────────────────────────────────────
  const facebookAd = [
    `Introducing the ${name} by Kara3.`,
    `\n\nThis ${adj1} ${type.toLowerCase()} — crafted from ${material}${stoneLine ? ', ' + stoneLine : ''} — `,
    `is more than jewellery. It's a declaration of ${noun}.`,
    `\n\nDesigned for ${audiencePhrase}, the ${name} combines ${adj2} design with the finest materials, `,
    `creating a piece you'll treasure for years to come.`,
    `\n\n${pick(lang.cta)} Shop now at Kara3.`,
  ].join('');

  // ── SEO Title ─────────────────────────────────────────────────────────────
  const seoTitleOptions = [
    `${name} ${material} ${type} | Kara3 Fine Jewelry`,
    `${adj1.charAt(0).toUpperCase() + adj1.slice(1)} ${material} ${type}${stone ? ' with ' + stone : ''} — Kara3`,
    `Buy ${name} ${type} | Luxury ${material} Jewelry | Kara3`,
  ];
  const seoTitle = pick(seoTitleOptions);

  // ── SEO Meta Description ──────────────────────────────────────────────────
  const seoMetaOptions = [
    `Shop the ${name}, an ${adj1} ${material} ${type}${stoneLine ? ' ' + stoneLine : ''} from Kara3. ${pick(lang.cta)} Free shipping available.`,
    `Discover the ${name} — a ${adj1} ${type.toLowerCase()} in ${material}${stone ? ' set with ' + stone : ''}, crafted for ${audiencePhrase}. Explore Kara3's fine jewelry collection.`,
  ];
  const seoMeta = pick(seoMetaOptions);

  // ── Render ────────────────────────────────────────────────────────────────
  set('productTitle', productTitle);
  set('shortDesc', shortDesc);
  set('longDesc', longDesc);
  set('instagramCaption', instagramCaption);
  set('facebookAd', facebookAd);
  set('seoTitle', seoTitle);
  set('seoMeta', seoMeta);

  // SEO char counts
  renderCharCount('seoTitle', seoTitle, 60, 'seoTitleCount');
  renderCharCount('seoMeta', seoMeta, 160, 'seoMetaCount');

  // Show output panel
  const outputPanel = document.getElementById('outputPanel');
  outputPanel.hidden = false;
  setTimeout(() => {
    outputPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
}

function renderCharCount(id, text, ideal, countId) {
  const len = text.length;
  const el = document.getElementById(countId);
  el.textContent = `${len} characters${len > ideal ? ` (ideal ≤${ideal})` : ''}`;
  el.classList.toggle('warn', len > ideal);
}
