'use strict';

// ─── Language ─────────────────────────────────────────────────────────────────

let currentLang = 'en';

const i18n = {
  en: {
    generating: 'Generating…',
    generate:   'Generate Content',
    copied:     'Copied!',
    copiedAll:  'All content copied!',
    noContent:  'Generate content first.',
    downloaded: 'Downloaded!',
  },
  tr: {
    generating: 'Oluşturuluyor…',
    generate:   'İçerik Oluştur',
    copied:     'Kopyalandı!',
    copiedAll:  'Tüm içerik kopyalandı!',
    noContent:  'Önce içerik oluşturun.',
    downloaded: 'İndirildi!',
  },
};

function t(key) {
  return (i18n[currentLang] || i18n.en)[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
}

// ─── Utilities ────────────────────────────────────────────────────────────────

function gv(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function setEl(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  const result = [];
  for (let i = 0; i < Math.min(n, copy.length); i++) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
  }
  return result;
}

function showToast(msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2400);
}

// ─── View / UI ────────────────────────────────────────────────────────────────

function switchView(view) {
  document.querySelectorAll('.section-view').forEach(el => el.classList.add('hidden'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('view-' + view);
  if (target) target.classList.remove('hidden');
  const btn = document.querySelector(`[data-view="${view}"]`);
  if (btn) btn.classList.add('active');
}

function toggleBrief() {
  const panel   = document.getElementById('formPanel');
  const overlay = document.getElementById('briefOverlay');
  const body    = document.getElementById('appBody');
  if (!panel) return;
  const open = panel.classList.toggle('open');
  if (overlay) overlay.classList.toggle('visible', open);
  if (body)    body.classList.toggle('brief-open', open);
}

// ─── Copy / Download ──────────────────────────────────────────────────────────

function copyCard(id) {
  const el = document.getElementById(id);
  if (!el || el.textContent === '—') { showToast(t('noContent')); return; }
  navigator.clipboard.writeText(el.textContent).then(() => showToast(t('copied')));
}

const ALL_OUTPUT_IDS = [
  'productTitle','luxuryNames','positioning','shortDesc','bullets','longDesc','ctas',
  'metaPrimary','shortAd','longAd','hookAd','urgencyAd','luxuryAd','giftAd','trustAd','retargetAd','headlines',
  'seoTitle','seoMeta','seoKeywords','productTags','collectionSeo','altText',
  'igCaption','igShort','storyText','reelCaption','tiktokHooks','ugcScript','influencerBrief','commentReplies',
  'collectionNames','campaignTheme','collectionDesc','slogans','taglines','launchAngle','seasonalAngle',
  'buyerPersona','whyBuy','emotionalAngle','objections','valueProp',
];

const LABEL_MAP = {
  productTitle:     'PRODUCT TITLE OPTIONS',
  luxuryNames:      'LUXURY NAME SUGGESTIONS',
  positioning:      'POSITIONING SUMMARY',
  shortDesc:        'SHORT DESCRIPTION',
  bullets:          'BULLET HIGHLIGHTS',
  longDesc:         'LONG DESCRIPTION',
  ctas:             'CALL-TO-ACTION VARIATIONS',
  metaPrimary:      'META / FACEBOOK PRIMARY TEXT',
  shortAd:          'SHORT AD COPY',
  longAd:           'LONG AD COPY',
  hookAd:           'HOOK-FIRST AD',
  urgencyAd:        'URGENCY ANGLE',
  luxuryAd:         'LUXURY ANGLE',
  giftAd:           'GIFT ANGLE',
  trustAd:          'TRUST ANGLE',
  retargetAd:       'RETARGETING COPY',
  headlines:        'HEADLINE OPTIONS',
  seoTitle:         'SEO TITLE',
  seoMeta:          'META DESCRIPTION',
  seoKeywords:      'SEO KEYWORDS',
  productTags:      'PRODUCT TAGS',
  collectionSeo:    'COLLECTION SEO TEXT',
  altText:          'IMAGE ALT TEXT',
  igCaption:        'INSTAGRAM CAPTION (FULL)',
  igShort:          'INSTAGRAM SHORT CAPTION',
  storyText:        'STORY TEXT (3 SLIDES)',
  reelCaption:      'REEL CAPTION',
  tiktokHooks:      'TIKTOK HOOK IDEAS',
  ugcScript:        'UGC SCRIPT ANGLE',
  influencerBrief:  'INFLUENCER BRIEF',
  commentReplies:   'FAQ COMMENT REPLIES',
  collectionNames:  'COLLECTION NAME IDEAS',
  campaignTheme:    'CAMPAIGN THEME',
  collectionDesc:   'COLLECTION DESCRIPTION',
  slogans:          'SLOGAN IDEAS',
  taglines:         'TAGLINE IDEAS',
  launchAngle:      'LAUNCH ANGLE',
  seasonalAngle:    'SEASONAL ANGLE',
  buyerPersona:     'BUYER PERSONA',
  whyBuy:           'WHY THIS BUYER WANTS IT',
  emotionalAngle:   'EMOTIONAL SELLING ANGLE',
  objections:       'OBJECTION HANDLING',
  valueProp:        'VALUE PROPOSITION SUMMARY',
};

function copyAllOutputs() {
  const parts = ALL_OUTPUT_IDS
    .map(id => {
      const el = document.getElementById(id);
      if (!el || el.textContent === '—') return null;
      return `=== ${LABEL_MAP[id] || id.toUpperCase()} ===\n${el.textContent}`;
    })
    .filter(Boolean);
  if (!parts.length) { showToast(t('noContent')); return; }
  navigator.clipboard.writeText(parts.join('\n\n')).then(() => showToast(t('copiedAll')));
}

function downloadTxt() {
  const parts = ALL_OUTPUT_IDS
    .map(id => {
      const el = document.getElementById(id);
      if (!el || el.textContent === '—') return null;
      return `=== ${LABEL_MAP[id] || id.toUpperCase()} ===\n${el.textContent}`;
    })
    .filter(Boolean);
  if (!parts.length) { showToast(t('noContent')); return; }
  const name = gv('fProductName') || 'kara3-content';
  const blob = new Blob([parts.join('\n\n')], { type: 'text/plain' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `${name.toLowerCase().replace(/\s+/g, '-')}-content.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(t('downloaded'));
}

function clearForm() {
  ['fProductName','fColor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['fProductType','fMaterial','fStone','fAudience','fTone','fPrice','fCampaign'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  ALL_OUTPUT_IDS.forEach(id => setEl(id, '—'));
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.style.display = '';
}

// ─── Presets ──────────────────────────────────────────────────────────────────

const PRESETS = {
  moissaniteRing: {
    fProductName: 'Lumière Ring',
    fProductType: 'Ring',
    fMaterial:    '18K Gold',
    fStone:       'Moissanite',
    fColor:       'Icy White',
    fAudience:    'Women 25–35',
    fTone:        'Luxurious & Elegant',
    fPrice:       'Mid Luxury',
    fCampaign:    'New Launch',
  },
  zultaniteNecklace: {
    fProductName: 'Soleil Pendant',
    fProductType: 'Necklace',
    fMaterial:    '14K Gold',
    fStone:       'Zultanite',
    fColor:       'Champagne',
    fAudience:    'Women 35–50',
    fTone:        'Timeless & Classic',
    fPrice:       'High Luxury',
    fCampaign:    'Brand Awareness',
  },
  silverBracelet: {
    fProductName: 'Éclat Bracelet',
    fProductType: 'Bracelet',
    fMaterial:    '925 Sterling Silver',
    fStone:       '',
    fColor:       'Polished Silver',
    fAudience:    'Minimalists',
    fTone:        'Minimalist & Clean',
    fPrice:       'Entry Luxury',
    fCampaign:    'Gift Season',
  },
  goldEarrings: {
    fProductName: 'Aurora Earrings',
    fProductType: 'Earrings',
    fMaterial:    'Rose Gold',
    fStone:       'Pearl',
    fColor:       'Blush Rose',
    fAudience:    'Brides / Bridal',
    fTone:        'Romantic & Poetic',
    fPrice:       'Mid Luxury',
    fCampaign:    'Bridal / Wedding',
  },
};

function applyPreset(key) {
  const preset = PRESETS[key];
  if (!preset) return;
  Object.entries(preset).forEach(([id, val]) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.value = val;
  });
}

// ─── Content Data ─────────────────────────────────────────────────────────────

const TONES = {
  'Luxurious & Elegant': {
    adj:    ['exquisite', 'opulent', 'refined', 'sophisticated', 'timeless', 'impeccable', 'magnificent', 'resplendent'],
    verbs:  ['adorns', 'elevates', 'graces', 'enchants', 'captivates', 'embodies', 'transcends'],
    nouns:  ['luxury', 'elegance', 'prestige', 'grandeur', 'splendour', 'distinction', 'excellence'],
    ctas:   ['Indulge in unparalleled luxury.', 'Reserve yours today.', 'Elevate every moment.', 'The pinnacle of fine jewellery.'],
    insta:  ['#FineJewelry #LuxuryJewelry #Kara3', '#LuxuryAccessories #JewelryLovers #Kara3'],
    story:  ['Crafted for those who know.', 'Where luxury meets intention.', 'A piece beyond compare.'],
  },
  'Romantic & Poetic': {
    adj:    ['enchanting', 'dreamy', 'ethereal', 'radiant', 'tender', 'celestial', 'luminous', 'moonlit'],
    verbs:  ['whispers', 'blooms', 'shimmers', 'glows', 'dances', 'blossoms', 'lingers'],
    nouns:  ['romance', 'poetry', 'devotion', 'magic', 'grace', 'wonder', 'longing'],
    ctas:   ['Tell your story.', 'A love made to last forever.', 'For the moments that matter most.', 'Written in light and gold.'],
    insta:  ['#LoveJewelry #RomanticGifts #Kara3', '#JewelryForHer #GiftOfLove #Kara3'],
    story:  ['Every love has a language.', 'Worn close to the heart.', 'A chapter in precious metal.'],
  },
  'Bold & Confident': {
    adj:    ['striking', 'powerful', 'daring', 'statement-making', 'fierce', 'iconic', 'unapologetic', 'commanding'],
    verbs:  ['commands', 'defines', 'asserts', 'dominates', 'inspires', 'transforms', 'declares'],
    nouns:  ['power', 'confidence', 'presence', 'attitude', 'statement', 'edge', 'authority'],
    ctas:   ['Own your moment.', 'Make a statement.', 'Be unforgettable.', 'Wear your power.'],
    insta:  ['#BoldJewelry #StatementPiece #Kara3', '#PowerJewelry #IconicStyle #Kara3'],
    story:  ['They will notice.', 'Wear it like armour.', 'Made for the unapologetic.'],
  },
  'Minimalist & Clean': {
    adj:    ['understated', 'sleek', 'pure', 'effortless', 'quiet', 'clean', 'considered', 'precise'],
    verbs:  ['simplifies', 'complements', 'refines', 'defines', 'balances', 'speaks', 'endures'],
    nouns:  ['simplicity', 'balance', 'purity', 'clarity', 'harmony', 'intention', 'restraint'],
    ctas:   ['Less is more.', 'Quietly extraordinary.', 'Where simplicity meets craft.', 'The art of restraint.'],
    insta:  ['#MinimalistJewelry #CleanDesign #Kara3', '#EssentialJewelry #WearEveryDay #Kara3'],
    story:  ['Stripped to what matters.', 'No excess. Only essence.', 'Designed for every day.'],
  },
  'Timeless & Classic': {
    adj:    ['classic', 'enduring', 'iconic', 'heritage', 'perennial', 'ageless', 'heirloom-quality', 'distinguished'],
    verbs:  ['endures', 'transcends', 'honours', 'preserves', 'celebrates', 'stands for', 'echoes'],
    nouns:  ['heritage', 'legacy', 'tradition', 'craftsmanship', 'timelessness', 'permanence', 'lineage'],
    ctas:   ['A piece for generations.', 'Crafted to last a lifetime.', 'Tradition reimagined.', 'Pass it forward.'],
    insta:  ['#TimelessJewelry #ClassicDesign #Kara3', '#HeritageJewelry #HeirloomQuality #Kara3'],
    story:  ['Some things never go out of style.', 'Built to outlast trends.', 'For generations to come.'],
  },
  'Warm & Gifting': {
    adj:    ['heartfelt', 'cherished', 'warmly curated', 'thoughtful', 'meaningful', 'tender', 'sincere'],
    verbs:  ['delights', 'warms', 'celebrates', 'honours', 'connects', 'touches', 'remembers'],
    nouns:  ['warmth', 'memory', 'celebration', 'connection', 'love', 'gratitude', 'joy'],
    ctas:   ['The perfect gift, beautifully made.', 'Give something that lasts.', 'A gift they\'ll never forget.', 'Celebrate the ones you love.'],
    insta:  ['#GiftJewelry #LuxuryGift #Kara3', '#GiftsForHer #JewelryGift #Kara3'],
    story:  ['A gift beyond words.', 'For someone who means everything.', 'Wrapped in love.'],
  },
};

const STONE_LINES = {
  Moissanite:       'set with a brilliant moissanite — rivalling diamond in fire and brilliance',
  Zultanite:        'featuring a rare zultanite that shifts from golden green to soft rose in changing light',
  Diamond:          'set with a brilliant diamond that catches every ray of light',
  Ruby:             'adorned with a deep red ruby, symbol of passion and power',
  Sapphire:         'featuring a velvety sapphire, evoking the depth of the night sky',
  Emerald:          'centred on a lush emerald, rich with natural beauty',
  Pearl:            'graced with a lustrous pearl, a tribute to the ocean\'s quiet wonder',
  Amethyst:         'set with a violet amethyst, serene and contemplative',
  Opal:             'adorned with a play-of-colour opal, alive with shifting hues',
  Turquoise:        'featuring a sky-blue turquoise, grounding and ancient',
  Moonstone:        'set with an iridescent moonstone, otherworldly and romantic',
  Topaz:            'featuring a warm topaz, radiant and uplifting',
};

const AUDIENCE_PHRASES = {
  'Women 25–35':       'the modern woman',
  'Women 35–50':       'the discerning woman',
  'Men 25–40':         'the contemporary man',
  'Couples / Gifts':   'those who cherish connection',
  'Brides / Bridal':   'the bride-to-be',
  'Luxury Shoppers':   'the connoisseur of fine luxury',
  'Minimalists':       'the lover of considered design',
  'Fashion-forward':   'the style-forward individual',
};

const TYPE_HASHTAGS = {
  Ring:      '#Ring #JewelryRing',
  Necklace:  '#Necklace #JewelryNecklace',
  Bracelet:  '#Bracelet #JewelryBracelet',
  Earrings:  '#Earrings #JewelryEarrings',
  Pendant:   '#Pendant #JewelryPendant',
  Anklet:    '#Anklet #JewelryAnklet',
  Brooch:    '#Brooch #JewelryBrooch',
  Cuff:      '#Cuff #CuffBracelet',
};

const PRICE_NOTES = {
  'Entry Luxury':  { tag: 'accessible luxury', guarantee: 'exceptional value without compromise' },
  'Mid Luxury':    { tag: 'elevated luxury',   guarantee: 'outstanding quality and lasting beauty' },
  'High Luxury':   { tag: 'fine luxury',       guarantee: 'uncompromising quality and prestige' },
  'Ultra Premium': { tag: 'ultra-premium',     guarantee: 'the absolute pinnacle of jewellery craft' },
};

const CAMPAIGN_ANGLES = {
  'New Launch':        { hook: 'Introducing for the first time', urgency: 'Be among the first to own it.' },
  'Brand Awareness':   { hook: 'Discover the world of Kara3', urgency: 'Explore the collection.' },
  'Sales / Conversion':{ hook: 'Limited availability', urgency: 'Secure yours before it\'s gone.' },
  'Gift Season':       { hook: 'The gift they\'ll treasure forever', urgency: 'Order in time for delivery.' },
  'Bridal / Wedding':  { hook: 'For your most precious day', urgency: 'Reserve your piece today.' },
  "Valentine's Day":   { hook: 'Tell them with something that lasts', urgency: 'Order by Valentine\'s Day.' },
  "Mother's Day":      { hook: 'For the woman who deserves everything', urgency: 'Celebrate her this Mother\'s Day.' },
  'Anniversary':       { hook: 'For the love that grows stronger', urgency: 'Make this anniversary unforgettable.' },
};

// ─── Generator ────────────────────────────────────────────────────────────────

function generateAll() {
  const btnLabel   = document.getElementById('btnLabel');
  const btnSpinner = document.getElementById('btnSpinner');
  if (btnLabel)   btnLabel.textContent = t('generating');
  if (btnSpinner) btnSpinner.hidden = false;

  setTimeout(() => {
    try {
      _runGeneration();
    } finally {
      if (btnLabel)   btnLabel.textContent = t('generate');
      if (btnSpinner) btnSpinner.hidden = true;
    }
  }, 60);
}

function _runGeneration() {
  // ── Inputs ──────────────────────────────────────────────────────────────────
  const name     = gv('fProductName') || 'Signature Piece';
  const type     = gv('fProductType') || 'Jewellery';
  const material = gv('fMaterial')    || 'fine metal';
  const stone    = gv('fStone')       || '';
  const color    = gv('fColor')       || '';
  const audience = gv('fAudience')    || '';
  const toneKey  = gv('fTone')        || 'Luxurious & Elegant';
  const priceKey = gv('fPrice')       || 'Mid Luxury';
  const campaign = gv('fCampaign')    || 'New Launch';

  const lang          = TONES[toneKey] || TONES['Luxurious & Elegant'];
  const audiencePhrase = AUDIENCE_PHRASES[audience] || 'the discerning individual';
  const stoneLine     = STONE_LINES[stone] || '';
  const colorNote     = color ? ` in a ${color} finish` : '';
  const typeHashtags  = TYPE_HASHTAGS[type] || '#Jewelry';
  const priceData     = PRICE_NOTES[priceKey] || PRICE_NOTES['Mid Luxury'];
  const campaignData  = CAMPAIGN_ANGLES[campaign] || CAMPAIGN_ANGLES['New Launch'];
  const stoneText     = stone ? ` with ${stone}` : '';
  const stoneDetail   = stoneLine ? `, ${stoneLine}` : '';

  const adj1 = pick(lang.adj);
  const adj2 = pick(lang.adj.filter(a => a !== adj1));
  const adj3 = pick(lang.adj.filter(a => a !== adj1 && a !== adj2));
  const verb = pick(lang.verbs);
  const noun = pick(lang.nouns);
  const cta  = pick(lang.ctas);

  // ── PRODUCT TAB ─────────────────────────────────────────────────────────────

  const productTitle = [
    `${name} — ${cap(adj1)} ${material} ${type}`,
    `The ${name} ${type} | Kara3`,
    `${name} ${type} in ${material}${stone ? ' & ' + stone : ''}`,
  ].join('\n');

  const luxuryNames = pickN([
    `${name} Édition`,
    `La ${name}`,
    `${name} Prestige`,
    `${name} Réserve`,
    `The ${name} Collection`,
    `${name} Atelier`,
    `Maison ${name}`,
  ], 4).join('\n');

  const positioning = [
    `Positioning: ${priceData.tag}`,
    `Tone: ${toneKey}`,
    `Target: ${audiencePhrase}`,
    `Campaign: ${campaign}`,
    `Promise: ${priceData.guarantee}.`,
  ].join('\n');

  const shortDesc = `An ${adj1} ${type.toLowerCase()} crafted from ${material}${stoneDetail}${colorNote}. `
    + `Designed for ${audiencePhrase}, the ${name} ${verb} with quiet ${noun}.`;

  const bullets = [
    `· Crafted from ${material}${stone ? ' with ' + stone : ''}`,
    `· ${cap(adj1)} design with meticulous hand-finishing`,
    `· Suitable for ${audiencePhrase}`,
    `· ${cap(priceData.tag)} — ${priceData.guarantee}`,
    `· Presented in a Kara3 signature gift box`,
  ].join('\n');

  const longDesc = [
    `Introducing the ${name} — a truly ${adj1} piece from Kara3's ${toneKey.toLowerCase()} collection.`,
    `\n\nHandcrafted from ${material}${stoneDetail}${colorNote}, this ${type.toLowerCase()} is an embodiment of ${noun} `,
    `and meticulous craftsmanship. Every curve, every detail has been considered to create a piece that ${verb} effortlessly.`,
    `\n\nPerfect for ${audiencePhrase}, the ${name} transitions seamlessly from intimate moments to grand occasions. `,
    `Whether gifted or chosen for yourself, it carries the promise of enduring beauty and the unmistakable signature of Kara3.`,
    `\n\n${cta}`,
  ].join('');

  const ctas = pickN([
    `Shop the ${name} →`,
    `Discover the ${name} at Kara3.`,
    `${cta}`,
    `Add to your collection today.`,
    `Own yours — shop now.`,
    `Gifting? The ${name} arrives in a Kara3 signature box.`,
  ], 4).join('\n');

  // ── AD COPY TAB ──────────────────────────────────────────────────────────────

  const metaPrimary = [
    `${campaignData.hook} — the ${name} by Kara3.`,
    `\n\nThis ${adj1} ${type.toLowerCase()} in ${material}${stoneDetail} is more than jewellery. It's a declaration of ${noun}.`,
    `\n\nDesigned for ${audiencePhrase} who value ${adj2} design and ${priceData.guarantee}.`,
    `\n\n${cta} ${campaignData.urgency}`,
  ].join('');

  const shortAd = `The ${name}. ${cap(adj1)}. ${cap(adj2)}. Unmistakable. Shop Kara3 now.`;

  const longAd = [
    `${campaignData.hook} — the ${name}.`,
    `\n\nCrafted from ${material}${stoneDetail}, the ${name} was designed for ${audiencePhrase} `,
    `who refuse to settle for anything less than ${adj1}.`,
    `\n\nWith its ${adj2} finish and ${priceData.tag} positioning, this ${type.toLowerCase()} ${verb} in every setting.`,
    `\n\n${cta} Limited availability — shop now at Kara3.`,
  ].join('');

  const hookAd = [
    `Wait — is that the ${name}?`,
    `\n\nThis ${adj1} ${type.toLowerCase()} from Kara3 has been turning heads for one reason: it's unlike anything else.`,
    `\n\n${material}${stone ? ', ' + stone : ''}, ${colorNote ? colorNote.trim() + ', ' : ''}crafted for ${audiencePhrase}.`,
    `\n\n${campaignData.urgency} Shop now.`,
  ].join('');

  const urgencyAd = [
    `⏳ Limited run. The ${name} is available now — but not for long.`,
    `\n\n${cap(adj1)} ${material}${stoneText}, crafted exclusively for ${audiencePhrase}.`,
    `\n\n${campaignData.urgency} Don't miss your chance.`,
  ].join('');

  const luxuryAd = [
    `Some pieces are simply different.`,
    `\n\nThe ${name} by Kara3 is one of them. ${cap(adj1)} ${material}${stoneDetail}${colorNote}. `,
    `A ${priceData.tag} piece that embodies ${noun} in its purest form.`,
    `\n\n${cta}`,
  ].join('');

  const giftAd = [
    `Looking for a gift that says everything words cannot?`,
    `\n\nThe ${name} — a ${adj1} ${type.toLowerCase()} in ${material}${stoneText} — arrives in a Kara3 signature gift box, `,
    `ready to delight ${audiencePhrase}.`,
    `\n\n${campaignData.urgency}`,
  ].join('');

  const trustAd = [
    `At Kara3, every piece is crafted to a single standard: yours.`,
    `\n\nThe ${name} — ${adj1} ${material}${stoneDetail} — offers ${priceData.guarantee}.`,
    `\n\nFree shipping. Signature gift packaging. 30-day returns. Shop with confidence.`,
  ].join('');

  const retargetAd = [
    `Still thinking about the ${name}?`,
    `\n\nThis ${adj1} ${type.toLowerCase()} was made for ${audiencePhrase} with an eye for ${noun}.`,
    `\n\nIt's still available — for now. ${campaignData.urgency}`,
  ].join('');

  const headlines = pickN([
    `The ${name} — ${cap(adj1)} ${material} ${type}`,
    `New from Kara3: The ${name}`,
    `${cap(adj1)} Jewellery for ${audiencePhrase}`,
    `${material}${stoneText} — Crafted for ${noun}`,
    `${cta} Shop Kara3.`,
    `The ${name}: ${cap(priceData.tag)} Jewellery`,
    `Fine ${material} ${type} | Kara3`,
  ], 5).join('\n');

  // ── SEO TAB ──────────────────────────────────────────────────────────────────

  const seoTitle = pick([
    `${name} ${material} ${type} | Kara3 Fine Jewellery`,
    `${cap(adj1)} ${material} ${type}${stone ? ' with ' + stone : ''} — Kara3`,
    `Buy ${name} ${type} | ${cap(priceData.tag)} ${material} | Kara3`,
  ]);

  const seoMeta = pick([
    `Shop the ${name}, an ${adj1} ${material} ${type}${stoneLine ? ' ' + stoneLine : ''} from Kara3. ${cta} Free shipping available.`,
    `Discover the ${name} — a ${adj1} ${type.toLowerCase()} in ${material}${stoneText}, crafted for ${audiencePhrase}. Explore Kara3's fine jewellery collection.`,
  ]);

  const seoKeywords = [
    `${name} ${type}`,
    `${material} ${type}`,
    stone ? `${stone} ${type}` : null,
    `${adj1} ${type}`,
    `Kara3 ${type}`,
    `luxury ${type} ${material}`,
    `fine jewellery ${type}`,
    `${type} for ${audience || 'women'}`,
    `${priceData.tag} jewellery`,
    `Kara3 fine jewellery`,
  ].filter(Boolean).join(', ');

  const productTags = [
    name, type, material, stone || null,
    `${toneKey} jewellery`, `Kara3`,
    `${priceData.tag}`, `${audience || 'luxury gift'}`,
    `fine jewellery`, `handcrafted`,
  ].filter(Boolean).join(', ');

  const collectionSeo = [
    `Explore Kara3's ${toneKey.toLowerCase()} collection — a curated selection of ${adj1} fine jewellery pieces `,
    `crafted for ${audiencePhrase}. Each piece in our ${material} collection ${verb} with ${noun}, `,
    `offering ${priceData.guarantee}. Discover the ${name} and the full Kara3 range at kara3.com.`,
  ].join('');

  const altText = [
    `1. ${name} ${material} ${type}${stoneText} — Kara3 fine jewellery on white background`,
    `2. Close-up of ${name} ${type} showing ${material} detail${stone ? ' and ' + stone : ''}`,
    `3. ${name} ${type} worn by model — ${adj1} ${material} jewellery by Kara3`,
  ].join('\n');

  // ── SOCIAL TAB ───────────────────────────────────────────────────────────────

  const igCaption = [
    `${pick(['✦', '◆', '—', '·'])} The ${name}. ${cap(adj1)}, ${adj2}, unmistakable.`,
    `\n\nCrafted from ${material}${stoneLine ? ', ' + stoneLine : ''}${colorNote}. `,
    `Made for ${audiencePhrase} who ${pick(['know their worth.', 'seek the extraordinary.', 'live beautifully.', 'wear their story.'])}`,
    `\n\n${cta}`,
    `\n\n${pick(lang.insta)} ${typeHashtags} #Kara3Jewellery #LuxuryJewellery`,
  ].join('');

  const igShort = `The ${name}. ${cap(adj1)} ${material}${stoneText}. Made for ${audiencePhrase}. ${cta} ${typeHashtags} #Kara3`;

  const storyText = [
    `SLIDE 1: "${pick(lang.story)}"`,
    `SLIDE 2: "The ${name} — ${adj1} ${material}${stoneText}."`,
    `SLIDE 3: "${cta} → Link in bio."`,
  ].join('\n');

  const reelCaption = [
    `POV: You just found your new favourite piece. 🖤`,
    `\n\nMeet the ${name} by Kara3 — ${adj1} ${material}${stoneDetail}${colorNote}.`,
    `\n\nDesigned for ${audiencePhrase}. Shop via link in bio.`,
    `\n\n${pick(lang.insta)} ${typeHashtags} #Kara3Reel #JewelleryReel`,
  ].join('');

  const tiktokHooks = [
    `"I can't stop wearing this ${type.toLowerCase()}…"`,
    `"The ${name} from Kara3 just changed everything."`,
    `"POV: Finding the most ${adj1} ${type.toLowerCase()} you've ever seen."`,
    `"Okay but WHY does the ${material}${stoneText} look THIS good?"`,
  ].join('\n');

  const ugcScript = [
    `HOOK (0–3s): Hold up the ${name} to camera. "You have to see this."`,
    `MIDDLE (3–15s): Show different angles. "This is the ${name} by Kara3. ${material}${stoneText}. `,
    `It arrived in the most beautiful box. The craftsmanship is just…"`,
    `CLOSE (15–30s): Wear the piece. "${cta} Link in bio — honestly, just go."`,
  ].join('\n');

  const influencerBrief = [
    `KARA3 × CREATOR BRIEF — ${name}`,
    `\nProduct: ${name} (${type}, ${material}${stoneText})`,
    `Audience: ${audiencePhrase}`,
    `Tone: ${toneKey} — ${adj1}, ${adj2}, ${noun}`,
    `\nKEY MESSAGES:`,
    `· ${cta}`,
    `· Crafted from ${material}${stoneDetail}`,
    `· ${priceData.guarantee}`,
    `\nDELIVERABLES: 1× Feed Post + 3× Stories + 1× Reel`,
    `CAPTION MUST INCLUDE: #Kara3 #Kara3Jewellery ${typeHashtags}`,
    `POSTING WINDOW: TBD — confirm with Kara3 team before publishing`,
  ].join('\n');

  const commentReplies = [
    `Q: "Where is this from?"`,
    `A: "This is the ${name} by Kara3! You can find it at kara3.com 🖤"`,
    `\nQ: "What material is it?"`,
    `A: "It's crafted from ${material}${stoneText} — exceptional quality."`,
    `\nQ: "Do you ship internationally?"`,
    `A: "Yes! Kara3 ships worldwide with signature gift packaging."`,
    `\nQ: "Is it good quality?"`,
    `A: "${cap(priceData.guarantee)} — Kara3 stands behind every piece."`,
  ].join('\n');

  // ── COLLECTION TAB ───────────────────────────────────────────────────────────

  const collectionNames = pickN([
    `The ${noun.charAt(0).toUpperCase() + noun.slice(1)} Collection`,
    `Kara3 ${cap(adj1)} Edit`,
    `Lumière Series`,
    `The ${material.split(' ').pop()} Archive`,
    `Kara3 ${toneKey.split(' ')[0]} Collection`,
    `Maison ${name}`,
    `The ${cap(adj2)} Line`,
  ], 4).join('\n');

  const campaignTheme = [
    `Theme: "${noun.charAt(0).toUpperCase() + noun.slice(1)} Reimagined"`,
    `Concept: ${cap(adj1)} ${material} pieces crafted for ${audiencePhrase} who value ${noun}.`,
    `Mood: ${toneKey}. ${cap(priceData.tag)}.`,
    `Campaign hook: "${campaignData.hook}."`,
  ].join('\n');

  const collectionDesc = [
    `The ${name} is part of Kara3's ${toneKey.toLowerCase()} series — a collection where ${adj1} design `,
    `meets the finest ${material}. Each piece ${verb} with ${noun}, crafted for ${audiencePhrase} `,
    `who seek ${priceData.tag} jewellery without compromise.`,
    `\n\nThe collection spans ${type}s and complementary pieces, all sharing the same commitment `,
    `to ${priceData.guarantee}. Explore the full range at Kara3.`,
  ].join('');

  const slogans = pickN([
    `Crafted in ${noun}.`,
    `Where ${noun} meets ${material}.`,
    `${cap(adj1)}. Always.`,
    `Jewellery that speaks without words.`,
    `Kara3 — Beyond the ordinary.`,
    `Made for ${audiencePhrase}.`,
  ], 4).join('\n');

  const taglines = pickN([
    `Wear your ${noun}.`,
    `The art of being ${adj1}.`,
    `${cap(material)}. ${cap(noun)}. Kara3.`,
    `For those who ${verb} differently.`,
    `${cap(adj1)}, by design.`,
    `Fine jewellery, honestly made.`,
  ], 4).join('\n');

  const launchAngle = [
    `Launch Frame: ${campaignData.hook}.`,
    `Hero message: "The ${name} is here — ${adj1} ${material}${stoneText}, crafted for ${audiencePhrase}."`,
    `Launch CTA: "${campaignData.urgency}"`,
    `Channels: Instagram feed, Stories, Meta ads, email.`,
  ].join('\n');

  const seasonalAngle = (() => {
    const seasonMap = {
      "Valentine's Day": `Gift her (or him) the ${name} this Valentine's Day. ${adj1} ${material}${stoneText} — a declaration of ${noun}. ${campaignData.urgency}`,
      "Mother's Day":    `Honour the woman who deserves everything. The ${name} — ${adj1} ${material}${stoneText} — is the gift she'll wear for a lifetime. ${campaignData.urgency}`,
      'Bridal / Wedding':`Something ${adj1} for the bride-to-be. The ${name} in ${material}${stoneText} — timeless, personal, unforgettable. ${campaignData.urgency}`,
      'Gift Season':     `The gift that speaks for itself. The ${name} — ${adj1} ${material}${stoneText} — wrapped in a Kara3 signature box. ${campaignData.urgency}`,
      'Anniversary':     `For the love that grows stronger every year. The ${name} — ${adj1} ${material}${stoneText}. ${campaignData.urgency}`,
    };
    return seasonMap[campaign] || `The ${name} — ${adj1} ${material}${stoneText}. Perfect for any occasion. ${campaignData.urgency}`;
  })();

  // ── PERSONA TAB ──────────────────────────────────────────────────────────────

  const buyerPersona = [
    `BUYER PERSONA — ${audience || 'Core Buyer'}`,
    `\nWho: ${cap(audiencePhrase)}`,
    `Tone resonance: ${toneKey}`,
    `Price sensitivity: ${priceKey || 'Mid Luxury'} — willing to invest for ${priceData.guarantee}.`,
    `Motivation: Seeks ${adj1} jewellery that embodies ${noun} and reflects their identity.`,
    `Shopping behaviour: Research-led. Values quality, craft, and brand story.`,
    `Platform: Instagram, Pinterest, Google Search.`,
  ].join('\n');

  const whyBuy = [
    `· They value ${noun} and ${priceData.tag} positioning`,
    `· The ${material}${stoneText} signals quality they can trust`,
    `· The ${adj1} design aligns with their personal style`,
    `· Kara3's brand story resonates with their values`,
    `· It makes the perfect gift for a meaningful occasion`,
  ].join('\n');

  const emotionalAngle = [
    `Core emotion: ${noun.charAt(0).toUpperCase() + noun.slice(1)}`,
    `Desire: To feel ${adj1} and ${adj2}`,
    `Fear: Buying something that won't last or won't impress`,
    `Resolution: The ${name} delivers ${priceData.guarantee} — a piece they'll cherish`,
    `Aspiration: To be seen as ${audiencePhrase} with impeccable taste`,
  ].join('\n');

  const objections = [
    `"Is it worth the price?"`,
    `→ The ${name} offers ${priceData.guarantee}. ${cap(adj1)} ${material}${stoneText}, crafted to last.`,
    `\n"Will it tarnish or fade?"`,
    `→ Crafted from high-grade ${material} with expert finishing — built for longevity.`,
    `\n"Is it the right gift?"`,
    `→ Designed for ${audiencePhrase}, it arrives in a Kara3 signature gift box, ready to impress.`,
    `\n"Can I return it if it's not right?"`,
    `→ Kara3 offers a 30-day hassle-free return policy.`,
  ].join('\n');

  const valueProp = [
    `KARA3 VALUE PROPOSITION — ${name}`,
    `\nFor: ${audiencePhrase}`,
    `Who wants: ${adj1} jewellery that embodies ${noun}`,
    `The ${name} is: a ${priceData.tag} ${type.toLowerCase()} in ${material}${stoneText}`,
    `That delivers: ${priceData.guarantee}`,
    `Unlike: mass-market alternatives`,
    `Kara3: combines expert craftsmanship with ${toneKey.toLowerCase()} design`,
  ].join('\n');

  // ── RENDER ───────────────────────────────────────────────────────────────────

  const outputs = {
    productTitle, luxuryNames, positioning, shortDesc, bullets, longDesc, ctas,
    metaPrimary, shortAd, longAd, hookAd, urgencyAd, luxuryAd, giftAd, trustAd, retargetAd, headlines,
    seoTitle, seoMeta, seoKeywords, productTags, collectionSeo, altText,
    igCaption, igShort, storyText, reelCaption, tiktokHooks, ugcScript, influencerBrief, commentReplies,
    collectionNames, campaignTheme, collectionDesc, slogans, taglines, launchAngle, seasonalAngle,
    buyerPersona, whyBuy, emotionalAngle, objections, valueProp,
  };

  Object.entries(outputs).forEach(([id, text]) => setEl(id, text));

  // SEO char counts
  renderCharCount('seoTitle', seoTitle, 60, 'seoTitleCount');
  renderCharCount('seoMeta',  seoMeta,  160, 'seoMetaCount');

  // Hide empty state, show first view
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.style.display = 'none';
  switchView('product');
}

function renderCharCount(id, text, ideal, countId) {
  const len = text.length;
  const el  = document.getElementById(countId);
  if (!el) return;
  el.textContent = `${len} chars${len > ideal ? ` (ideal ≤${ideal})` : ''}`;
  el.classList.toggle('warn', len > ideal);
}

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : str;
}

// ─── Init ─────────────────────────────────────────────────────────────────────

switchView('product');
