'use strict';

// ═══════════════════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════════════════

let currentLang = 'en';

const generated = { product: false, ads: false, brand: false };

// ═══════════════════════════════════════════════════════════════════════════
//  UI STRINGS (i18n)
// ═══════════════════════════════════════════════════════════════════════════

const UI = {
  en: {
    btnProduct:  'Generate Product Page',
    btnAds:      'Generate Ads & Social',
    btnBrand:    'Generate Brand & Collection',
    btnAll:      'Generate Everything',
    generating:  'Generating…',
    copied:      'Copied!',
    copiedAll:   'Copied!',
    noContent:   'Generate content first.',
    downloaded:  'Downloaded!',
    phProduct:   'Click Generate Product Page or Generate Everything to produce this content.',
    phAds:       'Click Generate Ads & Social or Generate Everything to produce this content.',
    phBrand:     'Click Generate Brand & Collection or Generate Everything to produce this content.',
  },
  tr: {
    btnProduct:  'Ürün Sayfası Oluştur',
    btnAds:      'Reklam & Sosyal Oluştur',
    btnBrand:    'Koleksiyon & Marka Oluştur',
    btnAll:      'Hepsini Oluştur',
    generating:  'Oluşturuluyor…',
    copied:      'Kopyalandı!',
    copiedAll:   'Kopyalandı!',
    noContent:   'Önce içerik oluşturun.',
    downloaded:  'İndirildi!',
    phProduct:   '"Ürün Sayfası Oluştur" veya "Hepsini Oluştur"a tıklayın.',
    phAds:       '"Reklam & Sosyal Oluştur" veya "Hepsini Oluştur"a tıklayın.',
    phBrand:     '"Koleksiyon & Marka Oluştur" veya "Hepsini Oluştur"a tıklayın.',
  },
};

function t(key) {
  return (UI[currentLang] || UI.en)[key] || key;
}

function setLanguage(lang) {
  currentLang = lang;
  // Update button labels
  const buttons = {
    btnGenProduct: 'btnProduct',
    btnGenAds:     'btnAds',
    btnGenBrand:   'btnBrand',
    btnGenAll:     'btnAll',
  };
  Object.entries(buttons).forEach(([elId, uiKey]) => {
    const el = document.getElementById(elId);
    if (el) el.textContent = t(uiKey);
  });
  // Update placeholders
  const placeholders = {
    'ph-product': 'phProduct',
    'ph-ads':     'phAds',
    'ph-brand':   'phBrand',
  };
  Object.entries(placeholders).forEach(([elId, uiKey]) => {
    const el = document.getElementById(elId);
    if (el) {
      const p = el.querySelector('p');
      if (p) p.textContent = t(uiKey);
    }
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
  if (!arr || !arr.length) return '';
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN(arr, n) {
  const copy = [...arr];
  const result = [];
  while (result.length < n && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    result.push(copy.splice(idx, 1)[0]);
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

let activeTab = 'product';

function switchTab(tab) {
  activeTab = tab;

  // Update nav button active state
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Show/hide tab views
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

function copyCard(id) {
  const el = document.getElementById(id);
  if (!el || !el.textContent.trim()) {
    showToast(t('noContent'));
    return;
  }
  navigator.clipboard.writeText(el.textContent.trim())
    .then(() => showToast(t('copied')))
    .catch(() => showToast('Copy failed — use Ctrl+C'));
}

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

function getGeneratedIds() {
  return Object.entries(generated)
    .filter(([, v]) => v)
    .flatMap(([k]) => OUTPUT_GROUPS[k]);
}

function copyAll() {
  const ids = getGeneratedIds();
  if (!ids.length) { showToast(t('noContent')); return; }
  const parts = ids.map(id => {
    const el = document.getElementById(id);
    if (!el || !el.textContent.trim()) return null;
    return `=== ${OUTPUT_LABELS[id] || id.toUpperCase()} ===\n${el.textContent.trim()}`;
  }).filter(Boolean);
  if (!parts.length) { showToast(t('noContent')); return; }
  navigator.clipboard.writeText(parts.join('\n\n'))
    .then(() => showToast(t('copiedAll')))
    .catch(() => showToast('Copy failed — use Ctrl+C'));
}

function downloadTxt() {
  const ids = getGeneratedIds();
  if (!ids.length) { showToast(t('noContent')); return; }
  const parts = ids.map(id => {
    const el = document.getElementById(id);
    if (!el || !el.textContent.trim()) return null;
    return `=== ${OUTPUT_LABELS[id] || id.toUpperCase()} ===\n${el.textContent.trim()}`;
  }).filter(Boolean);
  if (!parts.length) { showToast(t('noContent')); return; }

  const name = (gv('fProductName') || 'kara3').toLowerCase().replace(/\s+/g, '-');
  const blob = new Blob([parts.join('\n\n')], { type: 'text/plain; charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${name}-content.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(a.href);
  showToast(t('downloaded'));
}

function clearAll() {
  // Reset text inputs
  ['fProductName', 'fColor'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  // Reset selects
  ['fProductType', 'fMaterial', 'fStone', 'fAudience', 'fTone', 'fPrice', 'fCampaign'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.selectedIndex = 0;
  });
  // Clear all output text
  Object.values(OUTPUT_GROUPS).flat().forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  ['seoTitleCount', 'seoMetaCount'].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.textContent = ''; el.classList.remove('warn'); }
  });
  // Reset state
  generated.product = false;
  generated.ads = false;
  generated.brand = false;

  // Hide all tab views, show empty state
  document.querySelectorAll('.tab-view').forEach(el => {
    el.classList.remove('tab-active');
    el.setAttribute('aria-hidden', 'true');
  });
  // Show placeholders, hide grids in each tab
  ['product', 'ads', 'brand'].forEach(g => {
    const ph   = document.getElementById('ph-' + g);
    const grid = document.getElementById('grid-' + g);
    if (ph)   ph.classList.remove('hidden');
    if (grid) grid.classList.add('hidden');
  });
  // Show empty state
  const emptyState = document.getElementById('emptyState');
  if (emptyState) emptyState.classList.remove('hidden');
}

// ═══════════════════════════════════════════════════════════════════════════
//  PRESETS
// ═══════════════════════════════════════════════════════════════════════════

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

// ═══════════════════════════════════════════════════════════════════════════
//  CONTENT DATA — ENGLISH
// ═══════════════════════════════════════════════════════════════════════════

const DATA_EN = {
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
    'Women 25–35':     'the modern woman who moves between worlds — career and life — with equal ease',
    'Women 35–50':     'the discerning woman who has earned her eye for quality and refuses anything less',
    'Men 25–40':       'the contemporary man with a quiet appreciation for well-made, considered things',
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
    'Gift Season':        { hook: 'The gift they will treasure',    urgency: 'Order now — arrives gift-ready.' },
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
//  CONTENT DATA — TURKISH
// ═══════════════════════════════════════════════════════════════════════════

const DATA_TR = {
  tones: {
    'Luxurious & Elegant': {
      adj:   ['olağanüstü', 'zarif', 'muhteşem', 'sofistike', 'kusursuz', 'ihtişamlı', 'seçkin', 'görkemli'],
      verbs: ['süsler', 'yükseltir', 'büyüler', 'tamamlar', 'ifade eder', 'simgeler', 'taşır', 'hükmeder'],
      nouns: ['lüks', 'zarafet', 'prestij', 'ihtişam', 'ayrıcalık', 'mükemmellik', 'görkemlilik'],
      ctas:  ['Yerinizi hemen ayırtın.', 'Eşsiz lüksün tadını çıkarın.', 'Kuyumculuğun zirvesi.', 'Dünyanızı yükseltin.'],
      ig:    ['#İnceTakı #LüksTakı #Kara3', '#LüksAksesuarlar #TakıSeverleri #Kara3'],
    },
    'Romantic & Poetic': {
      adj:   ['büyüleyici', 'efsunlu', 'ışıltılı', 'semavi', 'narin', 'rüya gibi', 'ay ışığı gibi', 'görkemli'],
      verbs: ['fısıldar', 'çiçek açar', 'parlar', 'dans eder', 'süzülür', 'titreşir', 'ışıldar'],
      nouns: ['aşk', 'romantizm', 'büyü', 'şiir', 'zarafet', 'harika', 'özlem', 'şefkat'],
      ctas:  ['Sonsuza dek süren bir aşk.', 'Işık ve altınla yazılmış.', 'En önemli anlar için.', 'Hikayenizi güzelce anlatın.'],
      ig:    ['#AşkTakısı #RomantikHediye #Kara3', '#OnaHediye #AşkHediyesi #Kara3'],
    },
    'Bold & Confident': {
      adj:   ['çarpıcı', 'güçlü', 'cesur', 'ikonik', 'etkileyici', 'korkusuz', 'kararlı', 'özgün'],
      verbs: ['hükmeder', 'tanımlar', 'ilham verir', 'dönüştürür', 'ilan eder', 'öne çıkar', 'sahip olur'],
      nouns: ['güç', 'özgüven', 'varlık', 'ifade', 'karakter', 'kimlik', 'cesaret', 'tutum'],
      ctas:  ['Anına sahip ol.', 'Unutulmaz ol.', 'Gücünü taşı.', 'İzini bırak.'],
      ig:    ['#CesurTakı #İfadeTakısı #Kara3', '#İkonikStil #GüçTakısı #Kara3'],
    },
    'Minimalist & Clean': {
      adj:   ['sade', 'temiz', 'özenli', 'saf', 'sessiz', 'düşünceli', 'net', 'kasıtlı'],
      verbs: ['tamamlar', 'arındırır', 'kalıcıdır', 'dengeler', 'tanımlar', 'sessizce konuşur', 'zemin kurar'],
      nouns: ['sadelik', 'denge', 'saflık', 'uyum', 'özen', 'netlik', 'arınma', 'odak'],
      ctas:  ['Sessizce olağanüstü.', 'Az ama öz.', 'Özenin sanatı.', 'Kalıcı olacak şekilde tasarlandı.'],
      ig:    ['#MinimalistTakı #SadeTasarım #Kara3', '#HerGünTakı #ÖzenliTasarım #Kara3'],
    },
    'Timeless & Classic': {
      adj:   ['klasik', 'zamansız', 'köklü', 'ebedi', 'miras değerinde', 'kalıcı', 'seçkin', 'efsanevi'],
      verbs: ['kalıcıdır', 'nesillere taşınır', 'onurlandırır', 'yankılanır', 'kutlar', 'hayatta kalır', 'çığır açar'],
      nouns: ['miras', 'gelenek', 'ustalık', 'kalıcılık', 'köklülük', 'soy', 'zamansızlık', 'tarih'],
      ctas:  ['Nesillere geçen bir parça.', 'Ömür boyu dayanacak şekilde tasarlandı.', 'İlerideki nesillere bırakın.', 'Her şeyin ötesinde kalıcı.'],
      ig:    ['#ZamansızTakı #KlasikTasarım #Kara3', '#MirasKalitesi #KöklüTakı #Kara3'],
    },
    'Warm & Gifting': {
      adj:   ['içten', 'düşünceli', 'değerli', 'samimi', 'anlamlı', 'sıcak', 'özenle seçilmiş', 'kıymetli'],
      verbs: ['sevindirir', 'sıcaklık taşır', 'kutlar', 'bağlar', 'dokunur', 'hatırlatır', 'duygulandırır'],
      nouns: ['sıcaklık', 'bağ', 'anı', 'mutluluk', 'sevgi', 'şükran', 'kutlama', 'şefkat'],
      ctas:  ['Mükemmel hediye, zarif tasarım.', 'Asla unutulmayacak bir hediye.', 'Kalıcı bir şey ver.', 'En önemli kişileri kutlayın.'],
      ig:    ['#HediyeTakı #LüksHediye #Kara3', '#OnaHediye #TakıHediye #Kara3'],
    },
  },
  stones: {
    Moissanite: 'elmas parlaklığını aşan, olağanüstü ateş ve ışıltısıyla dikkat çeken parlak bir moisanit taş ile süslenmiş',
    Zultanite:  'değişen ışıkta altın yeşilinden gül pembesi tonlarına kayan, nadir bulunan bir zultanit taşı ile tasarlanmış',
    Diamond:    'her ışık açısında mükemmel parıltısıyla öne çıkan, yuvarlak kesim bir elmas ile süslenmiş',
    Ruby:       'tutku, güç ve sadakatin simgesi olan koyu kırmızı bir yakut ile yüceltilmiş',
    Sapphire:   'gece gökyüzünün derin huzurunu yansıtan kadifemsi bir safir ile donatılmış',
    Emerald:    'doğanın zenginliğini yoğun rengiyle taşıyan, görkemli bir zümrüt ile merkezlenmiş',
    Pearl:      "okyanusun sabırlı güzelliğini yansıtan, en üst kalitede parlak bir inci ile zarifleştirilmiş",
    Amethyst:   'derin moru ve sakinleştirici enerjisiyle öne çıkan bir ametist taşı ile tasarlanmış',
    Opal:       'her açıdan farklı renk oyunlarıyla büyüleyen, içsel ateşiyle canlı bir opal taşı ile süslenmiş',
    Turquoise:  'kadim medeniyetlerin taşı olan gökyüzü mavisi türkuaz ile donatılmış',
    Moonstone:  'her açıdan mavi ışıltısıyla büyüleyen, başka dünyalı ve efsunlu bir ay taşı ile süslenmiş',
    Topaz:      'bal ve kehribar sıcaklığıyla ışıldayan, derin sıcaklık taşıyan bir topaz ile yüceltilmiş',
  },
  audience: {
    'Women 25–35':     'iş ve sosyal hayatında eşit rahatlıkla hareket eden, modern kadın',
    'Women 35–50':     'kalite konusundaki gözünü geliştirmiş ve en azından razı olmayan, seçici kadın',
    'Men 25–40':       'özenli ve iyi yapılmış şeyleri sessiz bir takdirle değerlendiren, çağdaş erkek',
    'Couples / Gifts': 'doğru hediyenin sözcüklerin ifade edemeyeceği şeyleri taşıdığını anlayan çiftler',
    'Brides / Bridal': 'düğününün her detayının, arkasındaki sevgi kadar özenli olmasını isteyen gelin adayı',
    'Luxury Shoppers': 'malzeme kalitesi, köken ve işçilik konusunda taviz vermeyen lüks alışverişçi',
    'Minimalists':     'daha az, daha iyi anlayışıyla özenli tasarımı seven kişi',
    'Fashion-forward': 'takıyı süsleme değil, kimlik ifadesi olarak kullanan stil öncüsü',
  },
  price: {
    'Entry Luxury':  { tag: 'erişilebilir lüks', promise: 'erişilebilir fiyatta üstün güzellik' },
    'Mid Luxury':    { tag: 'yüksek lüks',       promise: 'üstün kalite ve kalıcı güzellik' },
    'High Luxury':   { tag: 'ince lüks',         promise: 'kusursuz malzeme kalitesi ve işçilik' },
    'Ultra Premium': { tag: 'ultra premium',     promise: 'kuyumculuğun, nadirliğin ve prestijin zirvesi' },
  },
  campaign: {
    'New Launch':         { hook: 'İlk kez tanıtıyoruz',                    urgency: 'İlk sahipler arasına katılın.' },
    'Brand Awareness':    { hook: "Kara3'ün dünyasını keşfedin",           urgency: 'Koleksiyonun tamamını inceleyin.' },
    'Sales / Conversion': { hook: 'Sınırlı süre için mevcut',              urgency: 'Tükenmeden yerinizi ayırtın.' },
    'Gift Season':        { hook: 'Hazır ambalajla özel hediye',           urgency: 'Hemen sipariş verin — hediye paketi dahil.' },
    'Bridal / Wedding':   { hook: 'En değerli gününüz için',               urgency: 'Yerinizi bugün ayırtın.' },
    "Valentine's Day":    { hook: 'Sevgilinize kalıcı bir şey söyleyin',    urgency: "Sevgililer Günü'nden önce sipariş verin." },
    "Mother's Day":       { hook: 'Her şeyi hak eden kadın için',          urgency: "Bu Anneler Günü'nde ona verin." },
    'Anniversary':        { hook: 'Her yıl büyüyen aşkınız için',         urgency: 'Bu yıldönümünü unutulmaz kılın.' },
  },
  typeHash: {
    Ring:     '#Yüzük #AltınYüzük',
    Necklace: '#Kolye #AltınKolye',
    Bracelet: '#Bilezik #İnceTakı',
    Earrings: '#Küpe #AltınKüpe',
    Pendant:  '#Kolye #Pendant',
    Cuff:     '#Kelepçe #TakıKelepçe',
    Anklet:   '#HalhalBilezik #İnceTakı',
    Brooch:   '#Broş #İnceTakı',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
//  BUILD GENERATION CONTEXT
// ═══════════════════════════════════════════════════════════════════════════

function getD() {
  return currentLang === 'tr' ? DATA_TR : DATA_EN;
}

function buildCtx() {
  const D = getD();
  const lang     = currentLang;

  const name     = gv('fProductName') || (lang === 'tr' ? 'İmza Parça' : 'Signature Piece');
  const type     = gv('fProductType') || (lang === 'tr' ? 'Takı' : 'Jewellery');
  const material = gv('fMaterial')    || (lang === 'tr' ? 'değerli metal' : 'fine metal');
  const stone    = gv('fStone')       || '';
  const color    = gv('fColor')       || '';
  const toneKey  = gv('fTone')        || 'Luxurious & Elegant';
  const priceKey = gv('fPrice')       || 'Mid Luxury';
  const campaign = gv('fCampaign')    || 'New Launch';
  const audKey   = gv('fAudience')    || '';

  const tone     = D.tones[toneKey]      || D.tones['Luxurious & Elegant'];
  const price    = D.price[priceKey]     || D.price['Mid Luxury'];
  const camp     = D.campaign[campaign]  || D.campaign['New Launch'];
  const aud      = D.audience[audKey]    || (lang === 'tr' ? 'seçici kişi' : 'the discerning individual');
  const stoneL   = D.stones[stone]       || '';
  const typeH    = D.typeHash[type]      || (lang === 'tr' ? '#Takı' : '#Jewellery');
  const typeL    = type.toLowerCase();

  const adj1  = pick(tone.adj);
  const adj2  = pick(tone.adj.filter(a => a !== adj1)) || pick(tone.adj);
  const adj3  = pick(tone.adj.filter(a => a !== adj1 && a !== adj2)) || pick(tone.adj);
  const verb  = pick(tone.verbs);
  const noun  = pick(tone.nouns);
  const cta   = pick(tone.ctas);
  const igTag = pick(tone.ig);

  // Build reusable fragments
  let stoneDetail, colorNote, stoneWith;
  if (lang === 'tr') {
    stoneDetail = stoneL ? `, ${stoneL}` : '';
    colorNote   = color  ? ` ${color} renginde` : '';
    stoneWith   = stone  ? ` ve ${stone}` : '';
  } else {
    stoneDetail = stoneL ? `, ${stoneL}` : '';
    colorNote   = color  ? ` in a ${color} finish` : '';
    stoneWith   = stone  ? ` with ${stone}` : '';
  }

  return {
    lang, name, type, typeL, material, stone, color,
    toneKey, priceKey, campaign, audKey,
    tone, price, camp, aud, stoneL, typeH,
    adj1, adj2, adj3, verb, noun, cta, igTag,
    stoneDetail, colorNote, stoneWith,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
//  GENERATORS
// ═══════════════════════════════════════════════════════════════════════════

function genProduct(ctx) {
  const { lang, name, type, typeL, material, stone, adj1, adj2, verb, noun, cta,
          aud, stoneDetail, colorNote, stoneWith, price, toneKey } = ctx;

  if (lang === 'tr') {
    const productTitle = [
      `${name} — ${cap(adj1)} ${material} ${type}`,
      `${name} | Kara3`,
      `${material}${stone ? ' ve ' + stone : ''} ${name}`,
    ].join('\n');

    const shortDesc = `${material}${stoneDetail}${colorNote} ile özenle üretilen ${name}, `
      + `${cap(aud)} için tasarlanmıştır. Her detayıyla ${noun} taşıyan bu ${typeL}, `
      + `zahmetsizce ${verb}.`;

    const bullets = [
      `· ${material}${stone ? ' ve ' + stone : ''} ile üretilmiştir`,
      `· ${cap(adj1)} tasarım, el işçiliğiyle tamamlanmıştır`,
      `· ${cap(price.tag)} — ${price.promise}`,
      `· ${cap(aud)} için idealdir`,
      `· Kara3 imzalı hediye kutusunda sunulur`,
    ].join('\n');

    const longDesc = [
      `${name}'yi tanıtıyoruz — Kara3'ün ${noun} koleksiyonundan gerçek anlamda ${adj1} bir parça.`,
      `\n\n${material}${stoneDetail}${colorNote} ile el yapımı olarak üretilen bu ${typeL}, `,
      `${noun} ve titiz işçiliğin kusursuz birleşimidir. Her eğri ve yüzey detayı, `,
      `parçanın her ortamda, her ışıkta ve her anda zahmetsizce ${verb} biçimde tasarlanmıştır.`,
      `\n\n${cap(aud)} için ideal olan ${name}, özel anlardan büyük günlere kesintisiz eşlik eder. `,
      `Hediye olarak veya kendiniz için seçin — kalıcı güzellik ve Kara3 imzası size ait.`,
      `\n\n${cta}`,
    ].join('');

    const seoTitle = pick([
      `${name} ${material} ${type} | Kara3 İnce Kuyumculuk`,
      `${cap(adj1)} ${material} ${type}${stone ? ' ve ' + stone : ''} — Kara3`,
      `${name} ${type} | ${cap(price.tag)} ${material} | Kara3`,
    ]);

    const seoMeta = pick([
      `${name}'yi keşfedin — ${material}${stoneL ? ', ' + stoneL : ''}${colorNote} ile üretilmiş ${adj1} bir ${typeL}. ${cta} Ücretsiz kargo mevcuttur.`,
      `Kara3'ten ${name}: ${cap(aud)} için tasarlanmış, ${material}${stone ? ' ve ' + stone : ''} ile üretilmiş ${adj1} bir ${typeL}. Koleksiyonu keşfedin.`,
    ]);

    return { productTitle, shortDesc, bullets, longDesc, seoTitle, seoMeta };
  }

  // English
  const productTitle = [
    `The ${name} — ${cap(adj1)} ${material} ${type}`,
    `${name} | Kara3 Fine Jewellery`,
    `${name} ${type} in ${material}${stone ? ' & ' + stone : ''}`,
  ].join('\n');

  const shortDesc = `An ${adj1} ${typeL} crafted from ${material}${stoneDetail}${colorNote}. `
    + `Made for ${aud}, the ${name} ${verb} with unmistakable ${noun} — `
    + `a piece that is immediately, entirely right.`;

  const bullets = [
    `· ${material}${stone ? ' with ' + stone : ''} — ${price.promise}`,
    `· ${cap(adj1)} design with meticulous hand-finishing at every point`,
    `· Made for ${aud}`,
    `· ${cap(price.tag)} — quality that does not settle`,
    `· Arrives in a Kara3 signature gift box`,
  ].join('\n');

  const longDesc = [
    `The ${name} is an ${adj1} piece from Kara3's ${toneKey.toLowerCase()} collection — one of those rare things that feels immediately right.`,
    `\n\nHandcrafted from ${material}${stoneDetail}${colorNote}, every curve, proportion, and surface `,
    `detail has been considered to create a ${typeL} that ${verb} in any setting, any light, any moment. `,
    `The result is a piece that carries ${noun} without effort — and ${adj2} from every angle.`,
    `\n\nMade for ${aud}, the ${name} moves between the intimate and the grand without hesitation. `,
    `Whether chosen as a personal marker or gifted to someone who deserves only the best, `,
    `it carries the quiet authority that is the signature of Kara3.`,
    `\n\n${cta}`,
  ].join('');

  const seoTitle = pick([
    `The ${name} — ${material} ${type} | Kara3 Fine Jewellery`,
    `${cap(adj1)} ${material} ${type}${stone ? ' with ' + stone : ''} — Kara3`,
    `${name} | ${cap(price.tag)} ${material} ${type} | Kara3`,
  ]);

  const seoMeta = pick([
    `Shop the ${name} — an ${adj1} ${material} ${typeL}${stoneL ? ', ' + stoneL : ''}. ${cta} Free worldwide shipping from Kara3.`,
    `The ${name} by Kara3: a ${price.tag} ${typeL} in ${material}${stone ? ' with ' + stone : ''}, made for ${aud}. Discover the collection.`,
  ]);

  return { productTitle, shortDesc, bullets, longDesc, seoTitle, seoMeta };
}

function genAds(ctx) {
  const { lang, name, type, typeL, material, stone, adj1, adj2, verb, noun, cta,
          aud, stoneDetail, colorNote, stoneWith, price, camp, tone, typeH, igTag } = ctx;

  if (lang === 'tr') {
    const metaAd = [
      `${camp.hook} — Kara3'ten ${name}.`,
      `\n\nBu ${adj1} ${typeL}, ${material}${stoneDetail} ile üretilmiş. Yalnızca bir takı değil — ${noun} beyanı.`,
      `\n\n${cap(aud)} için tasarlandı. ${cap(price.promise)}.`,
      `\n\n${cta} ${camp.urgency}`,
    ].join('');

    const shortAd = `${name}. ${cap(adj1)}. ${cap(adj2)}. Kara3'te şimdi alışveriş yapın.`;

    const igCaption = [
      `◆ ${name}. ${cap(adj1)}, ${adj2}, benzersiz.`,
      `\n\n${material}${stoneL ? ', ' + stoneL : ''}${colorNote} ile üretilmiştir.`,
      `\n\n${cap(aud)} için — ${pick(['kendi değerini bilenler.', 'olağanüstüyü arayanlar.', 'güzel yaşayanlar.', 'farkı anlayanlar.'])}`,
      `\n\n${cta}`,
      `\n\n${igTag} ${typeH} #Kara3Takı #LüksTakı`,
    ].join('');

    const tiktokHooks = [
      `"Bu ${typeL}'yı çıkaramıyorum…"`,
      `"Kara3'ün ${name}'i her şeyi değiştirdi."`,
      `"POV: Gördüğünüz en ${adj1} ${typeL}."`,
      `"${material}${stoneWith} bu kadar şık nasıl görünür?"`,
      `"${cta} — biyodaki link, ciddi konuşuyorum."`,
    ].join('\n');

    const ugcAngle = [
      `AÇILIŞ (0–3sn): ${name}'yi kameraya tut. "Bunu görmeniz lazım."`,
      `ORTA (3–15sn): Farklı açıları göster. "Bu Kara3'ten ${name}. ${material}${stoneWith}. Bu kadar güzel bir kutuda geldi. İşçilik gerçekten..."`,
      `KAPANIŞ (15–30sn): Takıyı tak. "${cta} Biyodaki link — gerçekten, sadece gidin."`,
    ].join('\n');

    return { metaAd, shortAd, igCaption, tiktokHooks, ugcAngle };
  }

  // English
  const metaAd = [
    `${camp.hook} — the ${name} by Kara3.`,
    `\n\nThis ${adj1} ${typeL} in ${material}${stoneDetail} is more than jewellery. It is a declaration of ${noun}.`,
    `\n\nDesigned for ${aud} who recognise ${adj2} craft and refuse anything less than ${price.promise}.`,
    `\n\n${cta} ${camp.urgency}`,
  ].join('');

  const shortAd = `The ${name}. ${cap(adj1)}. ${cap(adj2)}. Unmistakably Kara3. Shop now.`;

  const igCaption = [
    `◆ The ${name}. ${cap(adj1)}, ${adj2}, and entirely its own.`,
    `\n\nCrafted from ${material}${stoneL ? ', ' + stoneL : ''}${colorNote}. `,
    `Made for ${aud} who ${pick(['know exactly what they want.', 'refuse the ordinary.', 'wear their story.', 'understand the difference between good and exceptional.'])}`,
    `\n\n${cta}`,
    `\n\n${igTag} ${typeH} #Kara3Jewellery #FineJewellery`,
  ].join('');

  const tiktokHooks = [
    `"I haven't taken this ${typeL} off once — here's why."`,
    `"The ${name} from Kara3 is genuinely different. Let me show you."`,
    `"POV: holding the most ${adj1} ${typeL} you've ever touched."`,
    `"Why does ${material}${stoneWith} look THIS good?"`,
    `"${cta} Link in bio. Trust me on this one."`,
  ].join('\n');

  const ugcAngle = [
    `HOOK (0–3s): Hold up the ${name} to camera. "You need to see what just arrived."`,
    `MID (3–15s): Show close details. "This is the ${name} by Kara3. ${material}${stoneWith}. `
    + `The box alone — but then you hold it. The weight, the finish… honestly."`,
    `CLOSE (15–30s): Wear the piece. "${cta} Link in bio. I'm not exaggerating — just go."`,
  ].join('\n');

  return { metaAd, shortAd, igCaption, tiktokHooks, ugcAngle };
}

function genBrand(ctx) {
  const { lang, name, type, typeL, material, stone, adj1, adj2, noun, cta,
          camp, price, aud, stoneWith, toneKey, priceKey, audKey, campaign } = ctx;

  if (lang === 'tr') {
    const collectionNames = pickN([
      `${cap(noun)} Koleksiyonu`,
      `Kara3 ${cap(adj1)} Editörü`,
      `${material.split(' ').pop()} Arşivi`,
      `Kara3 ${toneKey.split(' ')[0]} Serisi`,
      `Maison ${name}`,
      `${cap(adj2)} Hat`,
    ], 4).join('\n');

    const taglines = pickN([
      `${cap(noun)}'i giy.`,
      `${cap(adj1)} olmak bir sanattır.`,
      `${cap(material)}. ${cap(noun)}. Kara3.`,
      `${cap(adj1)}, tasarımla.`,
      `İnce kuyumculuk, dürüstçe yapılmış.`,
      `${cap(aud)} için.`,
      `Farkı hissediyorsunuz.`,
    ], 4).join('\n');

    const launchAngle = [
      `Lansman çerçevesi: ${camp.hook}.`,
      `Ana mesaj: "${name} burada — ${adj1} ${material}${stoneWith}, ${aud} için."`,
      `Lansman harekete geçirici: "${camp.urgency}"`,
      `Kanallar: Instagram beslemesi, Hikayeler, Meta reklamlar, e-posta bülteni.`,
    ].join('\n');

    const buyerPersona = [
      `ALICI PERSONELİ — ${audKey || 'Çekirdek Alıcı'}`,
      `\nKim: ${cap(aud)}`,
      `Ton uyumu: ${toneKey}`,
      `Fiyat kademesi: ${priceKey || 'Yüksek Lüks'} — ${price.promise} için yatırım yapmaya hazır`,
      `Motivasyon: ${noun} taşıyan, kimliğini yansıtan ${adj1} takıları arar`,
      `Alışveriş davranışı: Araştırma odaklı — kaliteye, işçiliğe ve marka hikayesine değer verir`,
      `Keşif kanalları: Instagram, Pinterest, kelimeden kelimeye, Google Arama`,
    ].join('\n');

    const objections = [
      `"Fiyatına değer mi?"`,
      `→ ${name}, ${price.promise} sunar. ${cap(adj1)} ${material}${stoneWith}, nesillere dayanacak şekilde üretilmiş.`,
      `\n"Solmaz ya da kararmaz mı?"`,
      `→ Uzman işçilikle tamamlanan, yüksek kaliteli ${material} ile üretilmiştir — güzel yaşlanması için tasarlandı.`,
      `\n"Doğru hediye mi?"`,
      `→ ${cap(aud)} için tasarlandı, Kara3 imzalı hediye kutusunda gelir. Sunum dahil, etki garantili.`,
      `\n"Beğenmezsem iade edebilir miyim?"`,
      `→ Kara3, 30 günlük sorunsuz iade ve değişim politikası sunar.`,
    ].join('\n');

    return { collectionNames, taglines, launchAngle, buyerPersona, objections };
  }

  // English
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

  // Build launch angle, including seasonal note if relevant
  const seasonalMap = {
    "Valentine's Day": "A declaration of love, made in gold.",
    "Mother's Day":    "For the woman who deserves everything.",
    'Bridal / Wedding': "For the day that changes everything.",
    'Gift Season':     "The gift that speaks without words.",
    'Anniversary':     "For the love that deepens with time.",
  };
  const seasonalNote = seasonalMap[campaign];

  const launchAngle = [
    `Launch frame: ${camp.hook}.`,
    `Hero message: "The ${name} is here — ${adj1} ${material}${stoneWith}, made for ${aud}."`,
    `Launch CTA: "${camp.urgency}"`,
    `Channels: Instagram feed, Stories, Meta ads, email newsletter.`,
    seasonalNote ? `Seasonal hook: "${seasonalNote}"` : null,
  ].filter(Boolean).join('\n');

  const buyerPersona = [
    `BUYER PERSONA — ${audKey || 'Core Buyer'}`,
    `\nWho: ${cap(aud)}`,
    `Tone resonance: ${toneKey}`,
    `Price tier: ${priceKey || 'Mid Luxury'} — invests for ${price.promise}`,
    `Motivation: seeks ${adj1} jewellery that carries ${noun} and reflects identity with precision`,
    `Shopping behaviour: research-led — values material quality, craftsmanship, and brand story`,
    `Discovery: Instagram, Pinterest, word of mouth, Google Search`,
  ].join('\n');

  const objections = [
    `"Is it worth the price?"`,
    `→ The ${name} delivers ${price.promise}. ${cap(adj1)} ${material}${stoneWith} — crafted to last decades, not seasons.`,
    `\n"Will it tarnish or fade?"`,
    `→ Made from high-grade ${material} with professional finishing — designed to age gracefully.`,
    `\n"Is it the right gift?"`,
    `→ Made for ${aud}, it arrives in a Kara3 signature gift box — presentation included, impression guaranteed.`,
    `\n"What if it doesn't fit or suit?"`,
    `→ Kara3 offers a 30-day hassle-free return and exchange policy.`,
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
  cnt.textContent = `${len} chars${over ? ' — over limit (≤' + ideal + ')' : ''}`;
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
  const groups = group === 'all' ? ['product', 'ads', 'brand'] : [group];

  // Set button to "Generating…" state
  const btnMap = { product: 'btnGenProduct', ads: 'btnGenAds', brand: 'btnGenBrand', all: 'btnGenAll' };
  const activeBtn = document.getElementById(btnMap[group]);
  if (activeBtn) { activeBtn.textContent = t('generating'); activeBtn.disabled = true; }

  // Use a minimal timeout so the UI can repaint before heavy work
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

      // SEO char counts
      if (generated.product) {
        renderCharCount('seoTitle', 'seoTitleCount', 60);
        renderCharCount('seoMeta',  'seoMetaCount',  160);
      }

      // Hide empty state once we have any content
      const emptyState = document.getElementById('emptyState');
      if (emptyState) emptyState.classList.add('hidden');

      // Switch to the first generated tab
      switchTab(group === 'all' ? 'product' : group);

    } finally {
      if (activeBtn) {
        const labelKey = { product: 'btnProduct', ads: 'btnAds', brand: 'btnBrand', all: 'btnAll' }[group];
        activeBtn.textContent = t(labelKey);
        activeBtn.disabled = false;
      }
    }
  }, 30);
}

// ═══════════════════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════════════════

// Tab views start in neutral state (not hidden, not active — CSS decides via .tab-active)
// switchTab sets the correct one active. On first load, show product tab nav as active
// but don't reveal any tab view content (emptyState covers the content area).
// Nothing else to init — the HTML already has the right default classes.
