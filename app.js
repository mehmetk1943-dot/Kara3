'use strict';

// ═══════════════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════════════

let currentLang = 'en';
const generated = { product: false, ads: false, brand: false };
const GROUPS = ['product', 'ads', 'brand'];

// ═══════════════════════════════════════════════════════════════════════════
//  UI STRINGS — language affects interface only; generated content is always English
// ═══════════════════════════════════════════════════════════════════════════

const UI = {
  en: {
    // Header / brand
    brandSub:        'Commerce Engine',
    // Tab nav
    tabProduct:      'Product Page',
    tabAds:          'Ads & Social',
    tabBrand:        'Brand & Collection',
    // Form section
    sampleData:      'Sample Data',
    // Form labels
    labelName:       'Product Name',
    labelType:       'Type',
    labelMaterial:   'Material',
    labelStone:      'Gemstone',
    labelColor:      'Color / Finish',
    labelAudience:   'Audience',
    labelTone:       'Tone',
    labelPrice:      'Price Tier',
    labelCampaign:   'Campaign',
    // Generate buttons
    btnProduct:      'Generate Product Page',
    btnAds:          'Generate Ads & Social',
    btnBrand:        'Generate Brand & Collection',
    btnAll:          'Generate Everything',
    generating:      'Generating\u2026',
    // Utility buttons
    btnClear:        'Clear',
    btnCopyAll:      'Copy All',
    btnDownload:     'Download',
    // Per-card copy button
    btnCopy:         'Copy',
    // Empty state
    emptyTitle:      'Commerce Engine',
    emptyBody:       'Fill in the product brief and click a generate button to produce your content.',
    emptyTry:        'Try Sample Data \u2192',
    // Tab headings
    hdProduct:       'Product Page',
    hdProductSub:    'Title, descriptions & SEO',
    hdAds:           'Ads & Social',
    hdAdsSub:        'Meta ads, Instagram & TikTok',
    hdBrand:         'Brand & Collection',
    hdBrandSub:      'Collection concepts, persona & strategy',
    // Tab placeholders
    phProduct:       'Click Generate Product Page or Generate Everything to produce this content.',
    phAds:           'Click Generate Ads & Social or Generate Everything to produce this content.',
    phBrand:         'Click Generate Brand & Collection or Generate Everything to produce this content.',
    // Card headers
    cardProductTitle:    'Product Title',
    cardShortDesc:       'Short Description',
    cardBullets:         'Bullet Highlights',
    cardLongDesc:        'Long Description',
    cardSeoTitle:        'SEO Title',
    cardSeoMeta:         'Meta Description',
    cardMetaAd:          'Meta Ad Copy',
    cardShortAd:         'Short Ad Copy',
    cardIgCaption:       'Instagram Caption',
    cardTiktokHooks:     'TikTok Hooks',
    cardUgcAngle:        'UGC Angle',
    cardCollectionNames: 'Collection Names',
    cardTaglines:        'Taglines',
    cardLaunchAngle:     'Launch Angle',
    cardBuyerPersona:    'Buyer Persona',
    cardObjections:      'Objection Handling',
    // Toast / feedback
    copied:      'Copied!',
    copiedAll:   'Copied!',
    noContent:   'Generate content first.',
    downloaded:  'Downloaded!',
  },
  tr: {
    brandSub:        'Ticaret Motoru',
    tabProduct:      'Ürün Sayfası',
    tabAds:          'Reklam & Sosyal',
    tabBrand:        'Marka & Koleksiyon',
    sampleData:      'Örnek Veri',
    labelName:       'Ürün Adı',
    labelType:       'Tür',
    labelMaterial:   'Malzeme',
    labelStone:      'Değerli Taş',
    labelColor:      'Renk / Yüzey',
    labelAudience:   'Hedef Kitle',
    labelTone:       'Ton',
    labelPrice:      'Fiyat Seviyesi',
    labelCampaign:   'Kampanya',
    btnProduct:      'Ürün Sayfası Oluştur',
    btnAds:          'Reklam & Sosyal Oluştur',
    btnBrand:        'Marka & Koleksiyon Oluştur',
    btnAll:          'Hepsini Oluştur',
    generating:      'Oluşturuluyor\u2026',
    btnClear:        'Temizle',
    btnCopyAll:      'Hepsini Kopyala',
    btnDownload:     'İndir',
    btnCopy:         'Kopyala',
    emptyTitle:      'Ticaret Motoru',
    emptyBody:       'Ürün bilgilerini doldurun ve içerik oluşturmak için bir butona tıklayın.',
    emptyTry:        'Örnek Veriyi Dene \u2192',
    hdProduct:       'Ürün Sayfası',
    hdProductSub:    'Başlık, açıklamalar & SEO',
    hdAds:           'Reklam & Sosyal',
    hdAdsSub:        'Meta reklamlar, Instagram & TikTok',
    hdBrand:         'Marka & Koleksiyon',
    hdBrandSub:      'Koleksiyon fikirleri, persona & strateji',
    phProduct:       '"Ürün Sayfası Oluştur" veya "Hepsini Oluştur"a tıklayın.',
    phAds:           '"Reklam & Sosyal Oluştur" veya "Hepsini Oluştur"a tıklayın.',
    phBrand:         '"Marka & Koleksiyon Oluştur" veya "Hepsini Oluştur"a tıklayın.',
    cardProductTitle:    'Ürün Başlığı',
    cardShortDesc:       'Kısa Açıklama',
    cardBullets:         'Öne Çıkan Noktalar',
    cardLongDesc:        'Uzun Açıklama',
    cardSeoTitle:        'SEO Başlığı',
    cardSeoMeta:         'Meta Açıklaması',
    cardMetaAd:          'Meta Reklam Metni',
    cardShortAd:         'Kısa Reklam Metni',
    cardIgCaption:       'Instagram Başlığı',
    cardTiktokHooks:     'TikTok Kancaları',
    cardUgcAngle:        'UGC Açısı',
    cardCollectionNames: 'Koleksiyon Adları',
    cardTaglines:        'Sloganlar',
    cardLaunchAngle:     'Lansman Açısı',
    cardBuyerPersona:    'Alıcı Personası',
    cardObjections:      'İtiraz Yönetimi',
    copied:      'Kopyalandı!',
    copiedAll:   'Kopyalandı!',
    noContent:   'Önce içerik oluşturun.',
    downloaded:  'İndirildi!',
  },
};

function t(key) {
  return (UI[currentLang] || UI.en)[key] || UI.en[key] || key;
}

// ── Language update: touches only UI text, never generated content ──────────
function setLanguage(lang) {
  currentLang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const text = t(el.dataset.i18n);
    if (text) el.textContent = text;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  UTILITIES
// ═══════════════════════════════════════════════════════════════════════════

function gv(id) {
  const el = document.getElementById(id);
  return el ? el.value.trim() : '';
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  const result = [];
  while (result.length < n && copy.length > 0) {
    result.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return result;
}

function cap(str) {
  return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

// ═══════════════════════════════════════════════════════════════════════════
//  TOAST
// ═══════════════════════════════════════════════════════════════════════════

let toastTimer = null;

function showToast(msg) {
  const el = document.getElementById('toast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2300);
}

// ═══════════════════════════════════════════════════════════════════════════
//  TAB NAVIGATION
// ═══════════════════════════════════════════════════════════════════════════

function switchTab(tab) {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });
  document.querySelectorAll('.tab-view').forEach(view => {
    const isTarget = view.id === 'tab-' + tab;
    view.classList.toggle('tab-active', isTarget);
    view.setAttribute('aria-hidden', String(!isTarget));
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  FORM PANEL TOGGLE (mobile)
// ═══════════════════════════════════════════════════════════════════════════

function toggleForm() {
  const panel   = document.getElementById('formPanel');
  const overlay = document.getElementById('formOverlay');
  const btn     = document.getElementById('menuBtn');
  if (!panel) return;
  const isOpen = panel.classList.toggle('open');
  if (overlay) overlay.classList.toggle('visible', isOpen);
  if (btn)     btn.setAttribute('aria-expanded', String(isOpen));
}

// ═══════════════════════════════════════════════════════════════════════════
//  COPY & DOWNLOAD
// ═══════════════════════════════════════════════════════════════════════════

const OUTPUT_GROUPS = {
  product: ['productTitle', 'shortDesc', 'bullets', 'longDesc', 'seoTitle', 'seoMeta'],
  ads:     ['metaAd', 'shortAd', 'igCaption', 'tiktokHooks', 'ugcAngle'],
  brand:   ['collectionNames', 'taglines', 'launchAngle', 'buyerPersona', 'objections'],
};

const OUTPUT_LABELS = {
  productTitle:    'PRODUCT TITLE',
  shortDesc:       'SHORT DESCRIPTION',
  bullets:         'BULLET HIGHLIGHTS',
  longDesc:        'LONG DESCRIPTION',
  seoTitle:        'SEO TITLE',
  seoMeta:         'META DESCRIPTION',
  metaAd:          'META AD COPY',
  shortAd:         'SHORT AD COPY',
  igCaption:       'INSTAGRAM CAPTION',
  tiktokHooks:     'TIKTOK HOOKS',
  ugcAngle:        'UGC ANGLE',
  collectionNames: 'COLLECTION NAMES',
  taglines:        'TAGLINES',
  launchAngle:     'LAUNCH ANGLE',
  buyerPersona:    'BUYER PERSONA',
  objections:      'OBJECTION HANDLING',
};

function copyCard(id) {
  const el = document.getElementById(id);
  if (!el || !el.textContent.trim()) {
    showToast(t('noContent'));
    return;
  }
  navigator.clipboard.writeText(el.textContent.trim())
    .then(() => showToast(t('copied')))
    .catch(() => showToast('Copy failed \u2014 use Ctrl+C'));
}

// Shared helper: build formatted text blocks for all generated output IDs
function buildTextBlocks() {
  const ids = GROUPS
    .filter(g => generated[g])
    .flatMap(g => OUTPUT_GROUPS[g]);
  return ids.map(id => {
    const el = document.getElementById(id);
    const text = el && el.textContent.trim();
    return text ? `=== ${OUTPUT_LABELS[id]} ===\n${text}` : null;
  }).filter(Boolean);
}

function copyAll() {
  const blocks = buildTextBlocks();
  if (!blocks.length) { showToast(t('noContent')); return; }
  navigator.clipboard.writeText(blocks.join('\n\n'))
    .then(() => showToast(t('copiedAll')))
    .catch(() => showToast('Copy failed \u2014 use Ctrl+C'));
}

function downloadTxt() {
  const blocks = buildTextBlocks();
  if (!blocks.length) { showToast(t('noContent')); return; }
  const name = (gv('fProductName') || 'kara3').toLowerCase().replace(/\s+/g, '-');
  const blob = new Blob([blocks.join('\n\n')], { type: 'text/plain; charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-content.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(t('downloaded'));
}

function clearAll() {
  ['fProductName', 'fColor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  ['fProductType', 'fMaterial', 'fStone', 'fAudience', 'fTone', 'fPrice', 'fCampaign'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  GROUPS.flatMap(g => OUTPUT_GROUPS[g]).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['seoTitleCount', 'seoMetaCount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('warn'); }
  });

  generated.product = false;
  generated.ads     = false;
  generated.brand   = false;

  document.querySelectorAll('.tab-view').forEach(el => {
    el.classList.remove('tab-active');
    el.setAttribute('aria-hidden', 'true');
  });
  GROUPS.forEach(g => {
    const ph   = document.getElementById('ph-' + g);
    const grid = document.getElementById('grid-' + g);
    if (ph)   ph.classList.remove('hidden');
    if (grid) grid.classList.add('hidden');
  });
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════
//  PRESETS
// ═══════════════════════════════════════════════════════════════════════════

const PRESETS = {
  moissaniteRing: {
    fProductName: 'Lumi\u00e8re Ring',
    fProductType: 'Ring',
    fMaterial:    '18K Gold',
    fStone:       'Moissanite',
    fColor:       'Icy White',
    fAudience:    'Women 25\u201335',
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
    fAudience:    'Women 35\u201350',
    fTone:        'Timeless & Classic',
    fPrice:       'High Luxury',
    fCampaign:    'Brand Awareness',
  },
  silverBracelet: {
    fProductName: '\u00c9clat Bracelet',
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
    if (el) el.value = val;
  });
}

// ═══════════════════════════════════════════════════════════════════════════
//  CONTENT DATA — always English; language selector only affects UI strings
// ═══════════════════════════════════════════════════════════════════════════

const DATA = {
  tones: {
    'Luxurious & Elegant': {
      adj:   ['exquisite', 'opulent', 'refined', 'sophisticated', 'impeccable', 'resplendent', 'magnificent', 'sumptuous'],
      verbs: ['adorns', 'elevates', 'graces', 'enchants', 'captivates', 'embodies', 'transcends', 'commands'],
      nouns: ['luxury', 'elegance', 'prestige', 'grandeur', 'splendour', 'distinction', 'excellence'],
      ctas:  ['Reserve yours today.', 'Indulge in something truly exceptional.', 'The pinnacle of fine jewellery.', 'Elevate your world.'],
      ig:    ['#FineJewellery #LuxuryJewellery #Kara3', '#LuxuryAccessories #JewelleryLovers #Kara3'],
    },
    'Romantic & Poetic': {
      adj:   ['enchanting', 'ethereal', 'radiant', 'celestial', 'luminous', 'tender', 'dreamlike', 'moonlit'],
      verbs: ['whispers', 'blooms', 'shimmers', 'glows', 'dances', 'lingers', 'blossoms', 'stirs'],
      nouns: ['romance', 'devotion', 'magic', 'poetry', 'grace', 'wonder', 'longing', 'tenderness'],
      ctas:  ['A love made to last.', 'Written in light and gold.', 'For the moments that stay with you.', 'Tell your story beautifully.'],
      ig:    ['#LoveJewellery #RomanticGifts #Kara3', '#JewelleryForHer #GiftOfLove #Kara3'],
    },
    'Bold & Confident': {
      adj:   ['striking', 'commanding', 'daring', 'fierce', 'iconic', 'unapologetic', 'powerful', 'audacious'],
      verbs: ['commands', 'defines', 'asserts', 'inspires', 'transforms', 'declares', 'dominates', 'owns'],
      nouns: ['power', 'confidence', 'presence', 'statement', 'authority', 'edge', 'character', 'attitude'],
      ctas:  ['Own your moment.', 'Be unforgettable.', 'Wear your power.', 'Make the statement.'],
      ig:    ['#BoldJewellery #StatementPiece #Kara3', '#IconicStyle #PowerJewellery #Kara3'],
    },
    'Minimalist & Clean': {
      adj:   ['understated', 'sleek', 'precise', 'effortless', 'considered', 'pure', 'quiet', 'intentional'],
      verbs: ['refines', 'complements', 'endures', 'defines', 'balances', 'speaks', 'simplifies', 'grounds'],
      nouns: ['simplicity', 'clarity', 'balance', 'harmony', 'intention', 'restraint', 'purity', 'focus'],
      ctas:  ['Quietly extraordinary.', 'Less is more.', 'The art of restraint.', 'Designed to endure.'],
      ig:    ['#MinimalistJewellery #CleanDesign #Kara3', '#EssentialJewellery #WearEveryDay #Kara3'],
    },
    'Timeless & Classic': {
      adj:   ['classic', 'enduring', 'heritage', 'ageless', 'heirloom-quality', 'perennial', 'distinguished', 'storied'],
      verbs: ['endures', 'transcends', 'honours', 'preserves', 'echoes', 'stands the test', 'celebrates', 'outlasts'],
      nouns: ['heritage', 'legacy', 'tradition', 'craftsmanship', 'permanence', 'lineage', 'timelessness', 'history'],
      ctas:  ['A piece for generations.', 'Crafted to last a lifetime.', 'Pass it forward.', 'Built to outlast everything.'],
      ig:    ['#TimelessJewellery #ClassicDesign #Kara3', '#HeirloomQuality #HeritageJewellery #Kara3'],
    },
    'Warm & Gifting': {
      adj:   ['heartfelt', 'thoughtful', 'cherished', 'sincere', 'meaningful', 'tender', 'warmly crafted', 'precious'],
      verbs: ['delights', 'warms', 'celebrates', 'honours', 'connects', 'touches', 'remembers', 'moves'],
      nouns: ['warmth', 'connection', 'memory', 'joy', 'love', 'gratitude', 'celebration', 'tenderness'],
      ctas:  ["The perfect gift, beautifully made.", "A gift they'll never forget.", 'Give something that lasts.', 'Celebrate the ones who matter most.'],
      ig:    ['#GiftJewellery #LuxuryGift #Kara3', '#GiftsForHer #JewelleryGift #Kara3'],
    },
  },
  stones: {
    Moissanite: 'set with a brilliant moissanite — diamond-rivalling fire and refractive brilliance, without compromise',
    Zultanite:  'featuring a rare colour-shift zultanite that moves from golden green to blush rose in changing light',
    Diamond:    'set with a round brilliant diamond, returning every ray of light with unmatched intensity',
    Ruby:       'adorned with a deep pigeon-blood ruby — the stone of passion, vitality, and enduring devotion',
    Sapphire:   'set with a velvety blue sapphire, evoking the still depth of the night sky',
    Emerald:    'centred on a rich emerald whose saturated colour honours the complexity of nature',
    Pearl:      "graced with a AAA-grade lustrous pearl — a quiet tribute to the ocean's most patient beauty",
    Amethyst:   'set with a deep violet amethyst, serene and endlessly contemplative',
    Opal:       'adorned with a play-of-colour opal, alive with a shifting internal fire that changes with every angle',
    Turquoise:  "featuring a robin's-egg turquoise, carrying the weight of ancient civilisations and open skies",
    Moonstone:  'set with a glowing blue-flash moonstone, ethereal and otherworldly in any light',
    Topaz:      'featuring a warm imperial topaz, radiant with honeyed warmth and golden depth',
  },
  audience: {
    'Women 25\u201335':     'the modern woman who moves between worlds — career and life — with equal ease',
    'Women 35\u201350':     'the discerning woman who has earned her eye for quality and refuses anything less',
    'Men 25\u201340':       'the contemporary man with a quiet appreciation for well-made, considered things',
    'Couples / Gifts': 'those who understand that the right gift carries everything words struggle to say',
    'Brides / Bridal': 'the bride who wants every detail of her day to be as intentional as the love behind it',
    'Luxury Shoppers': 'the connoisseur for whom material quality, provenance, and finish are non-negotiable',
    'Minimalists':     'the lover of considered design — someone who builds a wardrobe of fewer, better things',
    'Fashion-forward': 'the style-forward individual who wears jewellery as identity, not decoration',
  },
  price: {
    'Entry Luxury':  { tag: 'accessible luxury', promise: 'outstanding beauty at an attainable price point' },
    'Mid Luxury':    { tag: 'elevated luxury',   promise: 'exceptional quality and beauty built to last' },
    'High Luxury':   { tag: 'fine luxury',       promise: 'uncompromising material quality and finish' },
    'Ultra Premium': { tag: 'ultra-premium',     promise: 'the pinnacle of jewellery craft, rarity, and prestige' },
  },
  campaign: {
    'New Launch':         { hook: 'Introducing, for the first time', urgency: 'Be among the first to own it.' },
    'Brand Awareness':    { hook: 'Discover the world of Kara3',    urgency: 'Explore the full collection.' },
    'Sales / Conversion': { hook: 'Available for a limited time',   urgency: 'Secure yours before it sells out.' },
    'Gift Season':        { hook: 'The gift they will treasure',    urgency: 'Order now \u2014 arrives gift-ready.' },
    'Bridal / Wedding':   { hook: 'For your most precious day',     urgency: 'Reserve your piece today.' },
    "Valentine's Day":    { hook: 'Tell them with something that lasts', urgency: "Order before Valentine's Day." },
    "Mother's Day":       { hook: 'For the woman who deserves everything', urgency: "Celebrate her this Mother's Day." },
    'Anniversary':        { hook: 'For the love that grows stronger each year', urgency: 'Make this anniversary unforgettable.' },
  },
  typeHash: {
    Ring:     '#Ring #FineRing',
    Necklace: '#Necklace #GoldNecklace',
    Bracelet: '#Bracelet #FineJewellery',
    Earrings: '#Earrings #GoldEarrings',
    Pendant:  '#Pendant #GoldPendant',
    Cuff:     '#CuffBracelet #StatementCuff',
    Anklet:   '#Anklet #FineJewellery',
    Brooch:   '#Brooch #FineJewellery',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  BUILD GENERATION CONTEXT (always English)
// ═══════════════════════════════════════════════════════════════════════════

function buildCtx() {
  const name     = gv('fProductName') || 'Signature Piece';
  const type     = gv('fProductType') || 'Jewellery';
  const material = gv('fMaterial')    || 'fine metal';
  const stone    = gv('fStone')       || '';
  const color    = gv('fColor')       || '';
  const toneKey  = gv('fTone')        || 'Luxurious & Elegant';
  const priceKey = gv('fPrice')       || 'Mid Luxury';
  const campaign = gv('fCampaign')    || 'New Launch';
  const audKey   = gv('fAudience')    || '';

  const tone  = DATA.tones[toneKey]      || DATA.tones['Luxurious & Elegant'];
  const price = DATA.price[priceKey]     || DATA.price['Mid Luxury'];
  const camp  = DATA.campaign[campaign]  || DATA.campaign['New Launch'];
  const aud   = DATA.audience[audKey]    || 'the discerning individual';
  const stoneL = DATA.stones[stone]      || '';
  const typeH  = DATA.typeHash[type]     || '#Jewellery';
  const typeL  = type.toLowerCase();

  const adj1  = pick(tone.adj);
  const adj2  = pick(tone.adj.filter(a => a !== adj1)) || pick(tone.adj);
  const verb  = pick(tone.verbs);
  const noun  = pick(tone.nouns);
  const cta   = pick(tone.ctas);
  const igTag = pick(tone.ig);

  const stoneDetail = stoneL ? `, ${stoneL}` : '';
  const colorNote   = color  ? ` in a ${color} finish` : '';
  const stoneWith   = stone  ? ` with ${stone}` : '';

  return {
    name, type, typeL, material, stone, color,
    toneKey, priceKey, campaign, audKey,
    tone, price, camp, aud, stoneL, typeH,
    adj1, adj2, verb, noun, cta, igTag,
    stoneDetail, colorNote, stoneWith,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  GENERATORS — English only
// ═══════════════════════════════════════════════════════════════════════════

function genProduct(ctx) {
  const { name, typeL, material, stone, adj1, adj2, verb, noun, cta,
          aud, stoneDetail, colorNote, stoneWith, price, toneKey } = ctx;

  const productTitle = [
    `The ${name} \u2014 ${cap(adj1)} ${material} ${ctx.type}`,
    `${name} | Kara3 Fine Jewellery`,
    `${name} ${ctx.type} in ${material}${stone ? ' & ' + stone : ''}`,
  ].join('\n');

  const shortDesc = `An ${adj1} ${typeL} crafted from ${material}${stoneDetail}${colorNote}. `
    + `Made for ${aud}, the ${name} ${verb} with unmistakable ${noun} \u2014 `
    + `a piece that is immediately, entirely right.`;

  const bullets = [
    `\u00b7 ${material}${stone ? ' with ' + stone : ''} \u2014 ${price.promise}`,
    `\u00b7 ${cap(adj1)} design with meticulous hand-finishing at every point`,
    `\u00b7 Made for ${aud}`,
    `\u00b7 ${cap(price.tag)} \u2014 quality that does not settle`,
    `\u00b7 Arrives in a Kara3 signature gift box`,
  ].join('\n');

  const longDesc = [
    `The ${name} is an ${adj1} piece from Kara3\u2019s ${toneKey.toLowerCase()} collection \u2014 one of those rare things that feels immediately right.`,
    `\n\nHandcrafted from ${material}${stoneDetail}${colorNote}, every curve, proportion, and surface `,
    `detail has been considered to create a ${typeL} that ${verb} in any setting, any light, any moment. `,
    `The result is a piece that carries ${noun} without effort \u2014 and remains ${adj2} from every angle.`,
    `\n\nMade for ${aud}, the ${name} moves between the intimate and the grand without hesitation. `,
    `Whether chosen as a personal marker or gifted to someone who deserves only the best, `,
    `it carries the quiet authority that is the signature of Kara3.`,
    `\n\n${cta}`,
  ].join('');

  const seoTitle = pick([
    `The ${name} \u2014 ${material} ${ctx.type} | Kara3 Fine Jewellery`,
    `${cap(adj1)} ${material} ${ctx.type}${stone ? ' with ' + stone : ''} \u2014 Kara3`,
    `${name} | ${cap(price.tag)} ${material} ${ctx.type} | Kara3`,
  ]);

  const seoMeta = pick([
    `Shop the ${name} \u2014 an ${adj1} ${material} ${typeL}${ctx.stoneL ? ', ' + ctx.stoneL : ''}. ${cta} Free worldwide shipping from Kara3.`,
    `The ${name} by Kara3: a ${price.tag} ${typeL} in ${material}${stone ? ' with ' + stone : ''}, made for ${aud}. Discover the collection.`,
  ]);

  return { productTitle, shortDesc, bullets, longDesc, seoTitle, seoMeta };
}

function genAds(ctx) {
  const { name, typeL, material, stone, adj1, adj2, verb, noun, cta,
          aud, stoneDetail, stoneWith, price, camp, tone, typeH, igTag } = ctx;

  const metaAd = [
    `${camp.hook} \u2014 the ${name} by Kara3.`,
    `\n\nThis ${adj1} ${typeL} in ${material}${stoneDetail} is more than jewellery. It is a declaration of ${noun}.`,
    `\n\nDesigned for ${aud} who recognise ${adj2} craft and refuse anything less than ${price.promise}.`,
    `\n\n${cta} ${camp.urgency}`,
  ].join('');

  const shortAd = `The ${name}. ${cap(adj1)}. ${cap(adj2)}. Unmistakably Kara3. Shop now.`;

  const igCaption = [
    `\u25c6 The ${name}. ${cap(adj1)}, ${adj2}, and entirely its own.`,
    `\n\nCrafted from ${material}${ctx.stoneL ? ', ' + ctx.stoneL : ''}${ctx.colorNote}. `,
    `Made for ${aud} who ${pick(['know exactly what they want.', 'refuse the ordinary.', 'wear their story.', 'understand the difference between good and exceptional.'])}`,
    `\n\n${cta}`,
    `\n\n${igTag} ${typeH} #Kara3Jewellery #FineJewellery`,
  ].join('');

  const tiktokHooks = [
    `\u201cI haven\u2019t taken this ${typeL} off once \u2014 here\u2019s why.\u201d`,
    `\u201cThe ${name} from Kara3 is genuinely different. Let me show you.\u201d`,
    `\u201cPOV: holding the most ${adj1} ${typeL} you\u2019ve ever touched.\u201d`,
    `\u201cWhy does ${material}${stoneWith} look THIS good?\u201d`,
    `\u201c${cta} Link in bio. Trust me on this one.\u201d`,
  ].join('\n');

  const ugcAngle = [
    `HOOK (0\u20133s): Hold up the ${name} to camera. \u201cYou need to see what just arrived.\u201d`,
    `MID (3\u201315s): Show close details. \u201cThis is the ${name} by Kara3. ${material}${stoneWith}. `
    + `The box alone \u2014 but then you hold it. The weight, the finish\u2026 honestly.\u201d`,
    `CLOSE (15\u201330s): Wear the piece. \u201c${cta} Link in bio. I\u2019m not exaggerating \u2014 just go.\u201d`,
  ].join('\n');

  return { metaAd, shortAd, igCaption, tiktokHooks, ugcAngle };
}

function genBrand(ctx) {
  const { name, material, stone, adj1, adj2, noun, cta,
          camp, price, aud, stoneWith, toneKey, priceKey, audKey, campaign } = ctx;

  const collectionNames = pickN([
    `The ${cap(noun)} Collection`,
    `Kara3 ${cap(adj1)} Edit`,
    `The ${material.split(' ').pop()} Archive`,
    `Kara3 ${toneKey.split(' ')[0]} Series`,
    `Maison ${name}`,
    `The ${cap(adj2)} Line`,
    `Kara3 ${cap(adj1)} Objects`,
  ], 4).join('\n');

  const taglines = pickN([
    `Wear your ${noun}.`,
    `The art of being ${adj1}.`,
    `${cap(material)}. ${cap(noun)}. Kara3.`,
    `${cap(adj1)}, by design.`,
    `Fine jewellery, honestly made.`,
    `Made for ${aud}.`,
    `You will feel the difference.`,
    `${cap(noun)}, without compromise.`,
  ], 4).join('\n');

  const seasonalMap = {
    "Valentine's Day": 'A declaration of love, made in gold.',
    "Mother's Day":    'For the woman who deserves everything.',
    'Bridal / Wedding': 'For the day that changes everything.',
    'Gift Season':     'The gift that speaks without words.',
    'Anniversary':     'For the love that deepens with time.',
  };
  const seasonalNote = seasonalMap[campaign];

  const launchAngle = [
    `Launch frame: ${camp.hook}.`,
    `Hero message: "The ${name} is here \u2014 ${adj1} ${material}${stoneWith}, made for ${aud}."`,
    `Launch CTA: "${camp.urgency}"`,
    `Channels: Instagram feed, Stories, Meta ads, email newsletter.`,
    seasonalNote ? `Seasonal hook: "${seasonalNote}"` : null,
  ].filter(Boolean).join('\n');

  const buyerPersona = [
    `BUYER PERSONA \u2014 ${audKey || 'Core Buyer'}`,
    `\nWho: ${cap(aud)}`,
    `Tone resonance: ${toneKey}`,
    `Price tier: ${priceKey || 'Mid Luxury'} \u2014 invests for ${price.promise}`,
    `Motivation: seeks ${adj1} jewellery that carries ${noun} and reflects identity with precision`,
    `Shopping behaviour: research-led \u2014 values material quality, craftsmanship, and brand story`,
    `Discovery: Instagram, Pinterest, word of mouth, Google Search`,
  ].join('\n');

  const objections = [
    `\u201cIs it worth the price?\u201d`,
    `\u2192 The ${name} delivers ${price.promise}. ${cap(adj1)} ${material}${stoneWith} \u2014 crafted to last decades, not seasons.`,
    `\n\u201cWill it tarnish or fade?\u201d`,
    `\u2192 Made from high-grade ${material} with professional finishing \u2014 designed to age gracefully.`,
    `\n\u201cIs it the right gift?\u201d`,
    `\u2192 Made for ${aud}, it arrives in a Kara3 signature gift box \u2014 presentation included, impression guaranteed.`,
    `\n\u201cWhat if it doesn\u2019t fit or suit?\u201d`,
    `\u2192 Kara3 offers a 30-day hassle-free return and exchange policy.`,
  ].join('\n');

  return { collectionNames, taglines, launchAngle, buyerPersona, objections };
}

// ═══════════════════════════════════════════════════════════════════════════
//  RENDER
// ═══════════════════════════════════════════════════════════════════════════

function setOutput(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function renderCharCount(preId, countId, ideal) {
  const pre = document.getElementById(preId);
  const cnt = document.getElementById(countId);
  if (!pre || !cnt) return;
  const len = pre.textContent.length;
  if (!len) { cnt.textContent = ''; cnt.classList.remove('warn'); return; }
  const over = len > ideal;
  cnt.textContent = `${len} chars${over ? ' \u2014 over limit (\u2264' + ideal + ')' : ''}`;
  cnt.classList.toggle('warn', over);
}

function revealGroup(g) {
  const ph   = document.getElementById('ph-' + g);
  const grid = document.getElementById('grid-' + g);
  if (ph)   ph.classList.add('hidden');
  if (grid) grid.classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════
//  MAIN GENERATE ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════

function generate(group) {
  const ctx    = buildCtx();
  const groups = group === 'all' ? GROUPS : [group];

  // Show "Generating…" label and disable the active button
  const btnIdMap = { product: 'btnGenProduct', ads: 'btnGenAds', brand: 'btnGenBrand', all: 'btnGenAll' };
  const activeBtn = document.getElementById(btnIdMap[group]);
  if (activeBtn) { activeBtn.textContent = t('generating'); activeBtn.disabled = true; }

  // Use setTimeout(0) so the button label repaint fires before generation work
  setTimeout(() => {
    try {
      groups.forEach(g => {
        let outputs = {};
        if (g === 'product') outputs = genProduct(ctx);
        if (g === 'ads')     outputs = genAds(ctx);
        if (g === 'brand')   outputs = genBrand(ctx);
        Object.entries(outputs).forEach(([id, text]) => setOutput(id, text));
        generated[g] = true;
        revealGroup(g);
      });

      if (generated.product) {
        renderCharCount('seoTitle', 'seoTitleCount', 60);
        renderCharCount('seoMeta',  'seoMetaCount',  160);
      }

      const emptyState = document.getElementById('emptyState');
      if (emptyState) emptyState.classList.add('hidden');

      switchTab(group === 'all' ? 'product' : group);
    } finally {
      if (activeBtn) {
        const labelKey = { product: 'btnProduct', ads: 'btnAds', brand: 'btnBrand', all: 'btnAll' }[group];
        activeBtn.textContent = t(labelKey);
        activeBtn.disabled = false;
      }
    }
  }, 0);
}
