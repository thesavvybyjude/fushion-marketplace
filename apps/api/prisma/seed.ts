import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Helpers ──────────────────────────────────────────────
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function roundTo(n: number, decimals = 2): number {
  return Math.round(n * 10 ** decimals) / 10 ** decimals;
}

function choose<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return roundTo(Math.random() * (max - min) + min);
}

function fmtPrice(n: number): string {
  return roundTo(n).toFixed(2);
}

// ─── Country / location data ──────────────────────────────
const NIGERIAN_BANKS = [
  'Access Bank', 'GTBank', 'First Bank', 'Zenith Bank', 'UBA', 'Fidelity Bank',
  'Polaris Bank', 'Stanbic IBTC', 'Ecobank', 'Union Bank', 'Wema Bank', 'Opay',
  'PalmPay', 'Moniepoint', 'Kuda Bank',
];

const SURNAMES = [
  'Okafor', 'Abubakar', 'Adebayo', 'Okon', 'Musa', 'Nwachukwu', 'Ogunlade',
  'Eze', 'Bello', 'Adeleke', 'Yusuf', 'Okeke', 'Sulaiman', 'Olawale',
  'Ibrahim', 'Nwosu', 'Ogundipe', 'Danjuma', 'Akinlade', 'Chukwudi',
  'Mohammed', 'Egbuna', 'Ogunbiyi', 'Lawal', 'Nnamdi',
];

const FEMALE_NAMES = [
  'Chioma', 'Aisha', 'Folake', 'Nkechi', 'Zainab', 'Chinwe', 'Bose', 'Yetunde',
  'Aminat', 'Chiamaka', 'Rahmat', 'Olabisi', 'Ngozi', 'Hauwa', 'Temilade',
  'Ezinne', 'Titilayo', 'Mariam', 'Kehinde', 'Adaeze',
];

const MALE_NAMES = [
  'Chinedu', 'Ibrahim', 'Segun', 'Emeka', 'Abdullahi', 'Chibuzor', 'Tunde',
  'Nnamdi', 'Hassan', 'Oluwaseun', 'Chidi', 'Saheed', 'Ayodeji', 'Ebuka',
  'Suleiman', 'Obinna', 'Kunle', 'Chukwudi', 'Usman', 'Femi',
];

// ─── Vendor Data ──────────────────────────────────────────
interface VendorSeed {
  index: number;
  storeName: string;
  storeSlug: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  state: string;
  city: string;
  categorySlugs: string[];
  desc: string;
}

const VENDOR_DATA: VendorSeed[] = [
  { index: 0, storeName: 'TechHub Nigeria', storeSlug: 'techhub-nigeria', state: 'Lagos', city: 'Ikeja', categorySlugs: ['phones-tablets', 'electronics', 'computing'], desc: 'Lagos premier tech store for phones, laptops & gadgets.' },
  { index: 1, storeName: 'Capital Electronics', storeSlug: 'capital-electronics', state: 'Abuja FCT', city: 'Wuse', categorySlugs: ['phones-tablets', 'electronics', 'computing'], desc: 'Abuja trusted source for electronics and computing.' },
  { index: 2, storeName: 'PH Gadgets Store', storeSlug: 'ph-gadgets-store', state: 'Rivers', city: 'Port Harcourt', categorySlugs: ['phones-tablets', 'electronics'], desc: 'Port Harcourt best deals on phones and gadgets.' },
  { index: 3, storeName: 'Bodija Mall', storeSlug: 'bodija-mall', state: 'Oyo', city: 'Ibadan', categorySlugs: ['fashion-men', 'fashion-women', 'home-living'], desc: 'Ibadan largest mall for fashion & home needs.' },
  { index: 4, storeName: 'Kano City Mart', storeSlug: 'kano-city-mart', state: 'Kano', city: 'Kano', categorySlugs: ['food-groceries', 'home-living'], desc: 'Kano one-stop shop for groceries and home items.' },
  { index: 5, storeName: 'Enugu Urban Store', storeSlug: 'enugu-urban-store', state: 'Enugu', city: 'Enugu', categorySlugs: ['fashion-men', 'fashion-women', 'health-beauty'], desc: 'Enugu fashion and beauty destination.' },
  { index: 6, storeName: 'Kaduna Tech', storeSlug: 'kaduna-tech', state: 'Kaduna', city: 'Kaduna', categorySlugs: ['computing', 'electronics'], desc: 'Kaduna trusted computer and electronics dealer.' },
  { index: 7, storeName: 'Benin Bazaar', storeSlug: 'benin-bazaar', state: 'Edo', city: 'Benin City', categorySlugs: ['home-living', 'fashion-women', 'baby-kids'], desc: 'Benin City home, fashion & baby store.' },
  { index: 8, storeName: 'Onitsha Market', storeSlug: 'onitsha-market', state: 'Anambra', city: 'Onitsha', categorySlugs: ['food-groceries', 'home-living'], desc: 'Onitsha leading grocery and home essentials market.' },
  { index: 9, storeName: 'Calabar Curios', storeSlug: 'calabar-curios', state: 'Cross River', city: 'Calabar', categorySlugs: ['health-beauty', 'fashion-women'], desc: 'Calabar beauty and fashion boutique.' },
  { index: 10, storeName: 'Jos Plateau Mall', storeSlug: 'jos-plateau-mall', state: 'Plateau', city: 'Jos', categorySlugs: ['electronics', 'computing', 'phones-tablets'], desc: 'Jos electronics and computing hub.' },
  { index: 11, storeName: 'Ilorin Mart', storeSlug: 'ilorin-mart', state: 'Kwara', city: 'Ilorin', categorySlugs: ['food-groceries', 'home-living'], desc: 'Ilorin grocery and home essentials store.' },
  { index: 12, storeName: 'Abeokuta Stores', storeSlug: 'abeokuta-stores', state: 'Ogun', city: 'Abeokuta', categorySlugs: ['fashion-men', 'fashion-women', 'baby-kids'], desc: 'Abeokuta fashion and kids store.' },
  { index: 13, storeName: 'Owerri Hub', storeSlug: 'owerri-hub', state: 'Imo', city: 'Owerri', categorySlugs: ['phones-tablets', 'electronics', 'computing'], desc: 'Owerri gadgets and electronics store.' },
  { index: 14, storeName: 'Uyo Lifestyle', storeSlug: 'uyo-lifestyle', state: 'Akwa Ibom', city: 'Uyo', categorySlugs: ['health-beauty', 'fashion-women', 'fashion-men'], desc: 'Uyo lifestyle brand for fashion and beauty.' },
  { index: 15, storeName: 'Akure Deals', storeSlug: 'akure-deals', state: 'Ondo', city: 'Akure', categorySlugs: ['home-living', 'baby-kids'], desc: 'Akure home and baby supplies store.' },
  { index: 16, storeName: 'Warri Express', storeSlug: 'warri-express', state: 'Delta', city: 'Warri', categorySlugs: ['food-groceries', 'health-beauty'], desc: 'Warri grocery and beauty essentials.' },
  { index: 17, storeName: 'Osun Central', storeSlug: 'osun-central', state: 'Osun', city: 'Osogbo', categorySlugs: ['fashion-men', 'fashion-women'], desc: 'Osogbo fashion central.' },
  { index: 18, storeName: 'Minna Traders', storeSlug: 'minna-traders', state: 'Niger', city: 'Minna', categorySlugs: ['food-groceries', 'home-living'], desc: 'Minna grocery and home supplies.' },
  { index: 19, storeName: 'Bauchi Bazaar', storeSlug: 'bauchi-bazaar', state: 'Bauchi', city: 'Bauchi', categorySlugs: ['phones-tablets', 'electronics', 'computing'], desc: 'Bauchi electronics and phone store.' },
];

for (let i = 0; i < VENDOR_DATA.length; i++) {
  const g = i % 2 === 0 ? 'M' : 'F';
  const names = g === 'M' ? MALE_NAMES : FEMALE_NAMES;
  VENDOR_DATA[i].firstName = names[i % names.length];
  VENDOR_DATA[i].lastName = SURNAMES[i % SURNAMES.length];
  VENDOR_DATA[i].phone = `+23480${String(10000000 + i * 12345).slice(0, 8)}`;
}
// ─── Category definitions ─────────────────────────────────
interface CatDef {
  slug: string;
  name: string;
  children: { slug: string; name: string; desc: string }[];
}

const CATEGORIES: CatDef[] = [
  {
    slug: 'phones-tablets', name: 'Phones & Tablets',
    children: [
      { slug: 'smartphones', name: 'Smartphones', desc: 'Latest smartphones from top brands' },
      { slug: 'feature-phones', name: 'Feature Phones', desc: 'Reliable basic phones' },
      { slug: 'tablets', name: 'Tablets', desc: 'Tablets for work and play' },
      { slug: 'phone-accessories', name: 'Phone Accessories', desc: 'Cases, chargers, screen protectors' },
      { slug: 'tablet-accessories', name: 'Tablet Accessories', desc: 'Keyboards, cases, stylus pens' },
    ],
  },
  {
    slug: 'electronics', name: 'Electronics',
    children: [
      { slug: 'tvs-home-theatre', name: 'TVs & Home Theatre', desc: 'LED TVs, sound bars, home theatre systems' },
      { slug: 'audio-speakers', name: 'Audio & Speakers', desc: 'Headphones, bluetooth speakers, earphones' },
      { slug: 'gaming', name: 'Gaming', desc: 'Consoles, controllers, games' },
      { slug: 'cameras', name: 'Cameras', desc: 'DSLR, mirrorless, action cameras' },
      { slug: 'wearables', name: 'Wearables', desc: 'Smartwatches, fitness trackers' },
    ],
  },
  {
    slug: 'computing', name: 'Computing',
    children: [
      { slug: 'laptops', name: 'Laptops', desc: 'Notebooks and ultrabooks' },
      { slug: 'desktops-monitors', name: 'Desktops & Monitors', desc: 'Desktop PCs and monitors' },
      { slug: 'printers-scanners', name: 'Printers & Scanners', desc: 'Printers, scanners and multifunction devices' },
      { slug: 'computer-accessories', name: 'Computer Accessories', desc: 'Keyboards, mice, webcams, storage' },
      { slug: 'networking', name: 'Networking', desc: 'Routers, switches, modems' },
    ],
  },
  {
    slug: 'fashion-men', name: "Men's Fashion",
    children: [
      { slug: 'mens-clothing', name: "Men's Clothing", desc: 'Shirts, trousers, native wears' },
      { slug: 'mens-shoes', name: "Men's Shoes", desc: 'Sneakers, loafers, sandals' },
      { slug: 'mens-accessories', name: "Men's Accessories", desc: 'Watches, belts, caps' },
      { slug: 'mens-bags', name: "Men's Bags", desc: 'Backpacks, duffels, briefcases' },
    ],
  },
  {
    slug: 'fashion-women', name: "Women's Fashion",
    children: [
      { slug: 'womens-clothing', name: "Women's Clothing", desc: 'Dresses, skirts, blouses, native wears' },
      { slug: 'womens-shoes', name: "Women's Shoes", desc: 'Heels, flats, sneakers, sandals' },
      { slug: 'womens-accessories', name: "Women's Accessories", desc: 'Jewelry, scarves, hair accessories' },
      { slug: 'womens-bags', name: "Women's Bags", desc: 'Handbags, totes, clutches' },
    ],
  },
  {
    slug: 'health-beauty', name: 'Health & Beauty',
    children: [
      { slug: 'skincare', name: 'Skincare', desc: 'Facial care, body lotion, sunscreen' },
      { slug: 'hair-care', name: 'Hair Care', desc: 'Shampoo, conditioners, relaxers, wigs' },
      { slug: 'makeup', name: 'Makeup', desc: 'Foundation, lipstick, eyeshadow' },
      { slug: 'fragrance', name: 'Fragrance', desc: 'Perfumes and body sprays' },
      { slug: 'personal-care', name: 'Personal Care', desc: 'Oral care, deodorants, sanitary products' },
    ],
  },
  {
    slug: 'home-living', name: 'Home & Living',
    children: [
      { slug: 'furniture', name: 'Furniture', desc: 'Beds, sofas, chairs, tables' },
      { slug: 'kitchen-dining', name: 'Kitchen & Dining', desc: 'Cookware, utensils, dinner sets' },
      { slug: 'bedding-bath', name: 'Bedding & Bath', desc: 'Bed sheets, towels, duvets' },
      { slug: 'home-decor', name: 'Home Decor', desc: 'Cushions, curtains, wall art' },
      { slug: 'small-appliances', name: 'Small Appliances', desc: 'Blenders, irons, fans' },
    ],
  },
  {
    slug: 'baby-kids', name: 'Baby & Kids',
    children: [
      { slug: 'baby-clothing', name: 'Baby Clothing', desc: 'Onesies, baby sets, swaddles' },
      { slug: 'baby-gear', name: 'Baby Gear', desc: 'Strollers, car seats, baby carriers' },
      { slug: 'toys', name: 'Toys', desc: 'Educational toys, action figures, dolls' },
      { slug: 'kids-fashion', name: "Kids' Fashion", desc: 'Children clothing and shoes' },
      { slug: 'diapers-wipes', name: 'Diapers & Wipes', desc: 'Disposable and cloth diapers, baby wipes' },
    ],
  },
  {
    slug: 'food-groceries', name: 'Food & Groceries',
    children: [
      { slug: 'beverages', name: 'Beverages', desc: 'Soft drinks, juices, bottled water' },
      { slug: 'rice-grains', name: 'Rice & Grains', desc: 'Local and imported rice, beans, cereals' },
      { slug: 'oil-spices', name: 'Cooking Oil & Spices', desc: 'Vegetable oil, seasoning, spices' },
      { slug: 'snacks-confectionery', name: 'Snacks & Confectionery', desc: 'Biscuits, cakes, sweets, chocolate' },
      { slug: 'breakfast-cereals', name: 'Cereals & Breakfast', desc: 'Oats, cereal flakes, noodles' },
    ],
  },
];

// ─── Product Template Engine ──────────────────────────────
interface ProdTpl {
  name: string;
  price: number;
  compareAt?: number;
  tags: string[];
  featured?: boolean;
  variants?: boolean;
  desc?: string;
}

interface SubcatTpls {
  subcatSlug: string;
  templates: ProdTpl[];
}

const PRODUCT_TEMPLATES: SubcatTpls[] = [];

// ── Smartphones ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'smartphones',
  templates: [
    { name: 'Samsung Galaxy S24 Ultra 5G {{storage_gb}}GB', price: 1450000, compareAt: 1650000, tags: ['samsung', 'android', '5g', 'premium'], featured: true, variants: true },
    { name: 'Samsung Galaxy S24 {{storage_gb}}GB', price: 950000, compareAt: 1100000, tags: ['samsung', 'android', '5g'], variants: true },
    { name: 'Samsung Galaxy A55 5G {{storage_gb}}GB', price: 380000, compareAt: 420000, tags: ['samsung', 'android', 'midrange'], variants: true },
    { name: 'Samsung Galaxy A25 {{storage_gb}}GB', price: 220000, tags: ['samsung', 'android', 'budget'], variants: true },
    { name: 'iPhone 16 Pro Max {{storage_gb}}GB', price: 2100000, compareAt: 2350000, tags: ['apple', 'ios', 'premium'], featured: true, variants: true },
    { name: 'iPhone 16 Pro {{storage_gb}}GB', price: 1750000, compareAt: 1950000, tags: ['apple', 'ios', 'premium'], variants: true },
    { name: 'iPhone 15 {{storage_gb}}GB', price: 1100000, compareAt: 1250000, tags: ['apple', 'ios'], variants: true },
    { name: 'Tecno Camon 30 Premier {{storage_gb}}GB', price: 420000, compareAt: 480000, tags: ['tecno', 'android', 'camera'], featured: true, variants: true },
    { name: 'Tecno Camon 30 {{storage_gb}}GB', price: 280000, compareAt: 320000, tags: ['tecno', 'android', 'camera'], variants: true },
    { name: 'Tecno Spark 20 Pro {{storage_gb}}GB', price: 165000, tags: ['tecno', 'android', 'budget'], variants: true },
    { name: 'Infinix Note 40 Pro {{storage_gb}}GB', price: 320000, compareAt: 360000, tags: ['infinix', 'android', 'midrange'], variants: true },
    { name: 'Infinix Hot 40 {{storage_gb}}GB', price: 145000, tags: ['infinix', 'android', 'budget'], variants: true },
    { name: 'Samsung Galaxy Z Fold 6 {{storage_gb}}GB', price: 2450000, compareAt: 2700000, tags: ['samsung', 'android', 'foldable', 'premium'], featured: true, variants: true },
    { name: 'Samsung Galaxy Z Flip 6 {{storage_gb}}GB', price: 1350000, compareAt: 1500000, tags: ['samsung', 'android', 'foldable'], variants: true },
    { name: 'Xiaomi Redmi Note 14 Pro {{storage_gb}}GB', price: 350000, compareAt: 400000, tags: ['xiaomi', 'android', 'midrange'], variants: true },
    { name: 'Google Pixel 9 {{storage_gb}}GB', price: 980000, compareAt: 1100000, tags: ['google', 'android', 'premium'], variants: true },
  ],
});

// ── Feature Phones ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'feature-phones',
  templates: [
    { name: 'Nokia 3310 (2024 Edition)', price: 22000, tags: ['nokia', 'feature-phone', 'basic'] },
    { name: 'Nokia 105 Dual SIM', price: 12000, tags: ['nokia', 'feature-phone', 'basic'] },
    { name: 'Nokia 8210 4G', price: 35000, tags: ['nokia', '4g', 'feature-phone'] },
    { name: 'Tecno T470', price: 8500, tags: ['tecno', 'feature-phone', 'basic'] },
    { name: 'Infinix Hot 30i', price: 95000, tags: ['infinix', 'feature-phone', 'budget'] },
    { name: 'Nokia 2660 Flip', price: 45000, tags: ['nokia', 'flip', 'feature-phone'] },
    { name: 'Nokia 6300 4G', price: 48000, tags: ['nokia', '4g', 'feature-phone', 'classic'] },
    { name: 'Itel P36 Pro', price: 28000, tags: ['itel', 'feature-phone', 'basic'] },
    { name: 'Gionee F9', price: 25000, tags: ['gionee', 'feature-phone'] },
    { name: 'Nokia 150 2023', price: 15000, tags: ['nokia', 'feature-phone', 'basic'] },
  ],
});

// ── Tablets ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'tablets',
  templates: [
    { name: 'Samsung Galaxy Tab S9 FE {{storage_gb}}GB WiFi', price: 520000, compareAt: 580000, tags: ['samsung', 'android', 'tablet'], variants: true },
    { name: 'Samsung Galaxy Tab A9+ {{storage_gb}}GB', price: 280000, compareAt: 320000, tags: ['samsung', 'android', 'tablet'], variants: true },
    { name: 'iPad 10th Gen {{storage_gb}}GB', price: 580000, compareAt: 650000, tags: ['apple', 'ipad', 'tablet'], featured: true, variants: true },
    { name: 'iPad Air M2 {{storage_gb}}GB', price: 920000, compareAt: 1050000, tags: ['apple', 'ipad', 'tablet', 'premium'], variants: true },
    { name: 'iPad Pro M4 {{storage_gb}}GB', price: 1650000, compareAt: 1850000, tags: ['apple', 'ipad', 'pro', 'premium'], featured: true, variants: true },
    { name: 'Tecno Padmini 2 {{storage_gb}}GB', price: 120000, tags: ['tecno', 'android', 'tablet', 'budget'], variants: true },
    { name: 'Infinix XPad {{storage_gb}}GB', price: 135000, compareAt: 155000, tags: ['infinix', 'android', 'tablet'], variants: true },
    { name: 'Samsung Galaxy Tab S9 Ultra {{storage_gb}}GB', price: 1450000, compareAt: 1600000, tags: ['samsung', 'android', 'tablet', 'premium'], variants: true },
    { name: 'Amazon Fire HD 10 {{storage_gb}}GB', price: 180000, tags: ['amazon', 'fire', 'tablet'], variants: true },
    { name: 'Huawei MatePad 11.5 {{storage_gb}}GB', price: 420000, tags: ['huawei', 'android', 'tablet'], variants: true },
  ],
});

// ── Phone Accessories ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'phone-accessories',
  templates: [
    { name: 'Samsung Original 45W Fast Charger', price: 35000, tags: ['samsung', 'charger', 'original'] },
    { name: 'Apple 20W USB-C Power Adapter', price: 25000, tags: ['apple', 'charger', 'original'] },
    { name: 'Anker Power Bank 20000mAh', price: 45000, compareAt: 55000, tags: ['anker', 'powerbank', 'portable'], featured: true },
    { name: 'Xiaomi Mi Power Bank 10000mAh', price: 18000, tags: ['xiaomi', 'powerbank'], featured: true },
    { name: 'Spigen iPhone 16 Pro Max Case', price: 15000, tags: ['spigen', 'case', 'iphone'] },
    { name: 'Samsung Silicone Case S24 Ultra', price: 12000, tags: ['samsung', 'case', 'silicone'] },
    { name: 'Tempered Glass Screen Protector 2-Pack', price: 3500, tags: ['screen-protector', 'tempered-glass'] },
    { name: 'Baseus 3-in-1 USB-C Cable 1.2m', price: 6000, tags: ['baseus', 'cable', 'usb-c'] },
    { name: 'PopSockets Phone Grip', price: 5000, tags: ['popsocket', 'grip', 'accessory'] },
    { name: 'Phone Ring Holder Stand', price: 2500, tags: ['ring-holder', 'stand'] },
    { name: 'Anker USB-C Hub 7-in-1', price: 35000, tags: ['anker', 'hub', 'usb-c'] },
    { name: 'Magnetic Phone Car Mount', price: 8000, tags: ['car-mount', 'magnetic'] },
    { name: 'Wireless Charger Stand Fast Charge', price: 15000, tags: ['wireless', 'charger', 'stand'] },
  ],
});

// ── Tablet Accessories ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'tablet-accessories',
  templates: [
    { name: 'Samsung Galaxy Tab S9 Keyboard Case', price: 45000, tags: ['samsung', 'keyboard', 'case'] },
    { name: 'iPad Magic Keyboard', price: 85000, tags: ['apple', 'keyboard', 'ipad'], featured: true },
    { name: 'iPad Folio Case', price: 18000, tags: ['apple', 'folio', 'case'] },
    { name: 'Apple Pencil (USB-C)', price: 65000, tags: ['apple', 'pencil', 'stylus'] },
    { name: 'Samsung S Pen Replacement', price: 28000, tags: ['samsung', 'spen', 'stylus'] },
    { name: 'Tablet Stand Adjustable', price: 12000, tags: ['stand', 'adjustable'] },
    { name: 'PaperLike Screen Protector iPad', price: 10000, tags: ['paperlike', 'screen-protector', 'ipad'] },
    { name: 'Logitech Crayon Stylus', price: 35000, tags: ['logitech', 'stylus', 'ipad'] },
    { name: 'iPad Screen Protector Tempered Glass', price: 8000, tags: ['screen-protector', 'ipad'] },
    { name: 'Tab S9 Silicone Cover', price: 10000, tags: ['cover', 'silicone', 'samsung'] },
  ],
});

// ── TVs & Home Theatre ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'tvs-home-theatre',
  templates: [
    { name: 'Samsung 4K Smart TV {{size_inch}}" LED', price: 280000, tags: ['samsung', 'tv', '4k', 'smart'], variants: true },
    { name: 'Samsung QLED 4K {{size_inch}}" Smart TV', price: 420000, tags: ['samsung', 'qled', '4k', 'smart', 'premium'], variants: true },
    { name: 'LG 4K Smart TV {{size_inch}}" UHD', price: 260000, tags: ['lg', 'tv', '4k', 'smart'], variants: true },
    { name: 'LG OLED {{size_inch}}" Smart TV', price: 850000, tags: ['lg', 'oled', '4k', 'premium'], variants: true },
    { name: 'Hisense Smart TV {{size_inch}}" 4K', price: 190000, tags: ['hisense', 'tv', '4k', 'smart'], variants: true },
    { name: 'Sony Bravia 4K {{size_inch}}" Smart TV', price: 380000, tags: ['sony', 'bravia', '4k', 'smart'], variants: true },
    { name: 'Samsung Soundbar Q800C', price: 180000, compareAt: 220000, tags: ['samsung', 'soundbar', 'audio'], featured: true },
    { name: 'LG Soundbar S75Q', price: 150000, tags: ['lg', 'soundbar', 'audio'] },
    { name: 'Sony HT-S400 Soundbar', price: 120000, tags: ['sony', 'soundbar', 'audio'] },
    { name: 'JBL Bar 2.1 Deep Bass', price: 165000, tags: ['jbl', 'soundbar', 'audio'] },
    { name: 'Amazon Fire TV Stick 4K Max', price: 55000, tags: ['amazon', 'fire-tv', 'streaming'] },
    { name: 'Chromecast with Google TV 4K', price: 45000, tags: ['google', 'chromecast', 'streaming'] },
    { name: 'Hisense FHD LED TV {{size_inch}}"', price: 130000, tags: ['hisense', 'tv', 'fhd', 'budget'], variants: true },
  ],
});

// ── Audio & Speakers ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'audio-speakers',
  templates: [
    { name: 'JBL Flip 6 Bluetooth Speaker', price: 75000, compareAt: 90000, tags: ['jbl', 'speaker', 'bluetooth'], featured: true },
    { name: 'JBL Charge 5 Bluetooth Speaker', price: 110000, compareAt: 130000, tags: ['jbl', 'speaker', 'bluetooth'], featured: true },
    { name: 'JBL Tune 520BT Headphones', price: 45000, tags: ['jbl', 'headphones', 'bluetooth'] },
    { name: 'Sony WH-1000XM5 Noise Cancelling', price: 210000, compareAt: 250000, tags: ['sony', 'headphones', 'noise-cancelling', 'premium'], featured: true },
    { name: 'Sony WF-1000XM5 Earbuds', price: 185000, tags: ['sony', 'earbuds', 'noise-cancelling', 'premium'] },
    { name: 'Apple AirPods Pro 2', price: 160000, compareAt: 185000, tags: ['apple', 'airpods', 'earbuds', 'premium'], featured: true },
    { name: 'Apple AirPods 3', price: 105000, tags: ['apple', 'airpods', 'earbuds'] },
    { name: 'Samsung Galaxy Buds3 Pro', price: 120000, compareAt: 140000, tags: ['samsung', 'buds', 'earbuds'] },
    { name: 'Anker Soundcore R50i Earbuds', price: 15000, tags: ['anker', 'soundcore', 'earbuds', 'budget'] },
    { name: 'Oraimo Boost Pro Speaker', price: 18000, tags: ['oraimo', 'speaker', 'bluetooth', 'budget'] },
    { name: 'Baseus Bowie E17 Earbuds', price: 12000, tags: ['baseus', 'earbuds', 'bluetooth'] },
    { name: 'JBL PartyBox 310', price: 350000, tags: ['jbl', 'partybox', 'speaker', 'party'] },
    { name: 'Logitech G733 Wireless Gaming Headset', price: 85000, tags: ['logitech', 'gaming', 'headset'] },
  ],
});

// ── Gaming ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'gaming',
  templates: [
    { name: 'PlayStation 5 Slim Disc Edition', price: 650000, compareAt: 720000, tags: ['sony', 'ps5', 'console', 'gaming'], featured: true },
    { name: 'PlayStation 5 Digital Edition', price: 550000, tags: ['sony', 'ps5', 'console', 'gaming'] },
    { name: 'Xbox Series X 1TB', price: 600000, compareAt: 680000, tags: ['microsoft', 'xbox', 'console', 'gaming'] },
    { name: 'Xbox Series S 512GB', price: 380000, tags: ['microsoft', 'xbox', 'console', 'gaming'] },
    { name: 'Nintendo Switch OLED', price: 350000, tags: ['nintendo', 'switch', 'console', 'gaming'] },
    { name: 'DualSense Wireless Controller', price: 55000, tags: ['sony', 'ps5', 'controller'] },
    { name: 'Xbox Wireless Controller', price: 45000, tags: ['microsoft', 'xbox', 'controller'] },
    { name: 'PS5 Pulse 3D Headset', price: 85000, tags: ['sony', 'ps5', 'headset'] },
    { name: 'Logitech G Pro X Superlight Mouse', price: 65000, tags: ['logitech', 'mouse', 'gaming'], featured: true },
    { name: 'Razer Kraken V3 Pro Headset', price: 55000, tags: ['razer', 'headset', 'gaming'] },
    { name: 'SteelSeries Apex Pro Keyboard', price: 95000, tags: ['steelseries', 'keyboard', 'gaming'] },
    { name: 'Gaming Chair Ergonomic', price: 180000, tags: ['gaming-chair', 'ergonomic'] },
  ],
});

// ── Cameras ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'cameras',
  templates: [
    { name: 'Canon EOS R50 Mirrorless Camera', price: 520000, compareAt: 580000, tags: ['canon', 'mirrorless', 'camera'] },
    { name: 'Canon EOS 2000D DSLR', price: 280000, tags: ['canon', 'dslr', 'camera'] },
    { name: 'Nikon D5600 DSLR', price: 350000, tags: ['nikon', 'dslr', 'camera'] },
    { name: 'Sony Alpha A7 IV Mirrorless', price: 1250000, compareAt: 1400000, tags: ['sony', 'mirrorless', 'alpha', 'premium'], featured: true },
    { name: 'GoPro Hero 12 Black', price: 280000, compareAt: 320000, tags: ['gopro', 'action-camera'] },
    { name: 'DJI Osmo Action 4', price: 260000, tags: ['dji', 'action-camera'] },
    { name: 'Instax Mini 12 Instant Camera', price: 55000, tags: ['instax', 'polaroid', 'instant'], featured: true },
    { name: 'Canon EF 50mm f/1.8 Lens', price: 85000, tags: ['canon', 'lens', 'prime'] },
    { name: 'Tripod Stand 70" Professional', price: 25000, tags: ['tripod', 'stand', 'accessory'] },
    { name: 'Camera Bag DSLR Backpack', price: 35000, tags: ['bag', 'camera', 'backpack'] },
  ],
});

// ── Wearables ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'wearables',
  templates: [
    { name: 'Apple Watch Series 9 GPS 45mm', price: 480000, compareAt: 550000, tags: ['apple', 'watch', 'smartwatch', 'premium'] },
    { name: 'Apple Watch Ultra 2 49mm', price: 850000, tags: ['apple', 'watch', 'ultra', 'premium'], featured: true },
    { name: 'Samsung Galaxy Watch 6 44mm', price: 280000, compareAt: 320000, tags: ['samsung', 'watch', 'smartwatch'] },
    { name: 'Samsung Galaxy Fit 3', price: 65000, tags: ['samsung', 'fitness', 'band'] },
    { name: 'Xiaomi Smart Band 8 Pro', price: 35000, tags: ['xiaomi', 'fitness', 'band'], featured: true },
    { name: 'Amazfit GTR 4', price: 120000, tags: ['amazfit', 'smartwatch'] },
    { name: 'Huawei Watch GT 4', price: 150000, tags: ['huawei', 'watch', 'smartwatch'] },
    { name: 'Fitbit Versa 4', price: 160000, tags: ['fitbit', 'smartwatch', 'fitness'] },
    { name: 'Oraimo Smart Watch 2', price: 25000, tags: ['oraimo', 'smartwatch', 'budget'] },
    { name: 'Garmin Forerunner 265', price: 320000, tags: ['garmin', 'running', 'gps'] },
  ],
});

// ── Laptops ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'laptops',
  templates: [
    { name: 'Apple MacBook Air M3 {{ram_gb}}GB/{{storage_gb}}GB', price: 950000, compareAt: 1100000, tags: ['apple', 'macbook', 'laptop', 'premium'], featured: true, variants: true },
    { name: 'Apple MacBook Pro 14" M3 Pro {{ram_gb}}GB/{{storage_gb}}GB', price: 1650000, compareAt: 1850000, tags: ['apple', 'macbook', 'pro', 'premium'], featured: true, variants: true },
    { name: 'Apple MacBook Air M2 {{ram_gb}}GB/{{storage_gb}}GB', price: 780000, tags: ['apple', 'macbook', 'laptop'], variants: true },
    { name: 'Dell XPS 15 {{ram_gb}}GB/{{storage_gb}}GB', price: 850000, compareAt: 950000, tags: ['dell', 'xps', 'laptop', 'premium'], variants: true },
    { name: 'Dell Inspiron 15 {{ram_gb}}GB/{{storage_gb}}GB', price: 380000, tags: ['dell', 'inspiron', 'laptop'], variants: true },
    { name: 'HP Spectre x360 {{ram_gb}}GB/{{storage_gb}}GB', price: 720000, tags: ['hp', 'spectre', 'laptop', 'premium'], variants: true },
    { name: 'HP Pavilion 15 {{ram_gb}}GB/{{storage_gb}}GB', price: 350000, tags: ['hp', 'pavilion', 'laptop'], variants: true },
    { name: 'Lenovo ThinkPad X1 Carbon {{ram_gb}}GB/{{storage_gb}}GB', price: 950000, tags: ['lenovo', 'thinkpad', 'business', 'premium'], variants: true },
    { name: 'Lenovo IdeaPad Slim 5 {{ram_gb}}GB/{{storage_gb}}GB', price: 320000, tags: ['lenovo', 'ideapad', 'laptop'], variants: true },
    { name: 'ASUS ROG Zephyrus G16 {{ram_gb}}GB/{{storage_gb}}GB RTX 4070', price: 1250000, tags: ['asus', 'rog', 'gaming', 'laptop'], variants: true },
    { name: 'ASUS TUF Gaming F15 {{ram_gb}}GB/{{storage_gb}}GB', price: 480000, tags: ['asus', 'tuf', 'gaming', 'laptop'], variants: true },
    { name: 'Acer Aspire 5 {{ram_gb}}GB/{{storage_gb}}GB', price: 280000, tags: ['acer', 'aspire', 'laptop', 'budget'], variants: true },
    { name: 'Microsoft Surface Laptop 5 {{ram_gb}}GB/{{storage_gb}}GB', price: 850000, tags: ['microsoft', 'surface', 'laptop', 'premium'], variants: true },
    { name: 'Samsung Galaxy Book 3 Pro {{ram_gb}}GB/{{storage_gb}}GB', price: 680000, tags: ['samsung', 'galaxy-book', 'laptop'], variants: true },
    { name: 'HP ProBook 450 {{ram_gb}}GB/{{storage_gb}}GB', price: 320000, tags: ['hp', 'probook', 'business', 'laptop'], variants: true },
  ],
});

// ── Desktops & Monitors ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'desktops-monitors',
  templates: [
    { name: 'Apple iMac 24" M3 {{ram_gb}}GB/{{storage_gb}}GB', price: 1200000, tags: ['apple', 'imac', 'desktop', 'premium'], variants: true },
    { name: 'Apple Mac Mini M3 {{ram_gb}}GB/{{storage_gb}}GB', price: 620000, tags: ['apple', 'mac-mini', 'desktop'], variants: true },
    { name: 'HP All-in-One 24" {{ram_gb}}GB/{{storage_gb}}GB', price: 350000, tags: ['hp', 'all-in-one', 'desktop'], variants: true },
    { name: 'Dell OptiPlex Desktop {{ram_gb}}GB/{{storage_gb}}GB', price: 250000, tags: ['dell', 'optiplex', 'desktop', 'business'], variants: true },
    { name: 'Custom Gaming PC RTX 4060 {{ram_gb}}GB/{{storage_gb}}GB', price: 580000, tags: ['gaming', 'desktop', 'custom'], variants: true },
    { name: 'Samsung 27" 4K IPS Monitor', price: 180000, tags: ['samsung', 'monitor', '4k'] },
    { name: 'Dell UltraSharp 27" 4K Monitor', price: 320000, tags: ['dell', 'ultrasharp', 'monitor', '4k', 'premium'] },
    { name: 'LG 32" UltraGear Gaming Monitor 165Hz', price: 280000, tags: ['lg', 'ultragear', 'gaming', 'monitor'], featured: true },
    { name: 'HP 22" HD Monitor', price: 85000, tags: ['hp', 'monitor', 'hd'] },
    { name: 'Dell 24" FHD Monitor', price: 120000, tags: ['dell', 'monitor', 'fhd'] },
  ],
});

// ── Printers & Scanners ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'printers-scanners',
  templates: [
    { name: 'HP LaserJet Pro M404dn', price: 280000, tags: ['hp', 'laserjet', 'printer', 'business'] },
    { name: 'HP DeskJet 4158e All-in-One', price: 85000, tags: ['hp', 'deskjet', 'printer'], featured: true },
    { name: 'Canon PIXMA G3470 MegaTank', price: 95000, tags: ['canon', 'pixma', 'printer'] },
    { name: 'Canon LBP226dw Laser Printer', price: 210000, tags: ['canon', 'laser', 'printer'] },
    { name: 'Brother DCP-T720DW All-in-One', price: 120000, tags: ['brother', 'printer'] },
    { name: 'Epson EcoTank L3210', price: 90000, tags: ['epson', 'ecotank', 'printer'] },
    { name: 'HP Scanner ScanJet Pro 2000', price: 120000, tags: ['hp', 'scanner'] },
    { name: 'Canon CanoScan LiDE 400', price: 65000, tags: ['canon', 'scanner'] },
    { name: 'HP 67XL Black Ink Cartridge 2-Pack', price: 18000, tags: ['hp', 'ink', 'cartridge'] },
    { name: 'Canon PG-545XL Black Ink Cartridge', price: 12000, tags: ['canon', 'ink', 'cartridge'] },
  ],
});

// ── Computer Accessories ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'computer-accessories',
  templates: [
    { name: 'Logitech MX Master 3S Mouse', price: 55000, tags: ['logitech', 'mouse', 'wireless', 'premium'] },
    { name: 'Logitech M190 Wireless Mouse', price: 10000, tags: ['logitech', 'mouse', 'wireless'] },
    { name: 'Apple Magic Keyboard US', price: 65000, tags: ['apple', 'keyboard', 'wireless'] },
    { name: 'Logitech K380 Bluetooth Keyboard', price: 22000, tags: ['logitech', 'keyboard', 'bluetooth'] },
    { name: 'Logitech C920 HD Webcam', price: 45000, tags: ['logitech', 'webcam', 'hd'] },
    { name: 'Anker 4K Webcam', price: 55000, tags: ['anker', 'webcam', '4k'] },
    { name: 'Samsung T7 Portable SSD 1TB', price: 95000, compareAt: 110000, tags: ['samsung', 'ssd', 'portable', 'storage'], featured: true },
    { name: 'Sandisk Ultra Flash Drive 128GB', price: 12000, tags: ['sandisk', 'flash-drive', 'storage'] },
    { name: 'Seagate Backup Plus Slim 2TB External HDD', price: 55000, tags: ['seagate', 'hdd', 'external', 'storage'] },
    { name: 'Apple USB-C to Lightning Cable 1m', price: 15000, tags: ['apple', 'cable', 'usb-c'] },
    { name: 'Belkin USB-C Hub 7-in-1', price: 35000, tags: ['belkin', 'hub', 'usb-c'] },
    { name: 'Logitech Z150 Multimedia Speakers', price: 12000, tags: ['logitech', 'speakers', 'desktop'] },
    { name: 'Ergonomic Laptop Stand Adjustable', price: 18000, tags: ['stand', 'ergonomic', 'laptop'] },
    { name: 'MacBook USB-C Charger 67W', price: 42000, tags: ['apple', 'charger', 'macbook'] },
  ],
});

// ── Networking ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'networking',
  templates: [
    { name: 'TP-Link Archer AX73 AX5400 Router', price: 85000, tags: ['tp-link', 'router', 'wifi6', 'gaming'] },
    { name: 'TP-Link Archer C80 AC1900 Router', price: 38000, tags: ['tp-link', 'router', 'ac1900'] },
    { name: 'MikroTik hAP AC2 Router', price: 55000, tags: ['mikrotik', 'router', 'business'] },
    { name: 'Ubiquiti UniFi 6 Lite Access Point', price: 65000, tags: ['ubiquiti', 'unifi', 'ap', 'wifi6'] },
    { name: 'TP-Link 24-Port Gigabit Switch', price: 45000, tags: ['tp-link', 'switch', 'gigabit'] },
    { name: 'NETGEAR 5-Port Gigabit Switch', price: 15000, tags: ['netgear', 'switch', 'gigabit'] },
    { name: 'TP-Link TL-MR3420 4G LTE Router', price: 35000, tags: ['tp-link', '4g', 'router'] },
    { name: 'Cat6 Ethernet Cable 10m', price: 4500, tags: ['cable', 'ethernet', 'cat6'] },
    { name: 'TP-Link Powerline AV1000', price: 28000, tags: ['tp-link', 'powerline'] },
    { name: 'UPS APC Back-UPS 650VA', price: 65000, tags: ['apc', 'ups', 'power'] },
  ],
});

// ─── FASHION MEN ──────────────────────────────────────────
// ── Men''s Clothing ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'mens-clothing',
  templates: [
    { name: 'Classic African Print Agbada {{size}}', price: 45000, compareAt: 55000, tags: ['native', 'agbada', 'african-print', 'premium'], featured: true, variants: true },
    { name: 'Premium Kaftan {{size}}', price: 25000, tags: ['kaftan', 'native', 'traditional'], variants: true },
    { name: 'Senator Wear {{size}}', price: 18000, tags: ['senator', 'native', 'traditional'], variants: true },
    { name: 'Ankara Print Shirt {{size}}', price: 12000, tags: ['ankara', 'shirt', 'african-print'], variants: true },
    { name: 'Plain Oxford Shirt {{size}}', price: 8500, tags: ['oxford', 'shirt', 'formal'], variants: true },
    { name: 'Slim Fit Chinos {{size}}', price: 12000, tags: ['chinos', 'trousers', 'casual'], variants: true },
    { name: 'Straight Leg Jeans {{size}}', price: 10000, tags: ['jeans', 'denim', 'casual'], variants: true },
    { name: 'Tailored Suit Jacket {{size}}', price: 55000, tags: ['suit', 'jacket', 'formal'], variants: true },
    { name: 'Casual Polo Shirt {{size}}', price: 6000, tags: ['polo', 'casual', 'shirt'], variants: true },
    { name: 'Nike Dri-FIT T-Shirt {{size}}', price: 15000, tags: ['nike', 't-shirt', 'sportswear'], variants: true },
    { name: 'Leather Jacket {{size}}', price: 65000, compareAt: 80000, tags: ['leather', 'jacket', 'premium'], variants: true },
    { name: 'Hoodie Sweatshirt Unisex {{size}}', price: 15000, tags: ['hoodie', 'sweatshirt', 'casual'], variants: true },
    { name: 'Dashiki African Print {{size}}', price: 8000, tags: ['dashiki', 'african-print', 'traditional'], variants: true },
    { name: 'Denim Jacket {{size}}', price: 25000, tags: ['denim', 'jacket', 'casual'], variants: true },
    { name: 'Joggers Cotton {{size}}', price: 8000, tags: ['joggers', 'sweatpants', 'casual'], variants: true },
  ],
});

// ── Men''s Shoes ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'mens-shoes',
  templates: [
    { name: 'Nike Air Force 1 {{size}}', price: 55000, compareAt: 65000, tags: ['nike', 'sneakers', 'af1'], featured: true, variants: true },
    { name: 'Adidas Ultraboost 23 {{size}}', price: 65000, tags: ['adidas', 'running', 'sneakers'], variants: true },
    { name: 'Nike Air Max 90 {{size}}', price: 62000, tags: ['nike', 'air-max', 'sneakers'], variants: true },
    { name: 'Leather Loafers {{size}}', price: 35000, tags: ['loafers', 'formal', 'leather'], variants: true },
    { name: 'Brown Leather Oxford Shoes {{size}}', price: 45000, compareAt: 55000, tags: ['oxford', 'formal', 'leather'], variants: true },
    { name: 'Slide Sandals {{size}}', price: 5000, tags: ['sandals', 'slide', 'casual'], variants: true },
    { name: 'Nike Air Jordan 1 Mid {{size}}', price: 85000, tags: ['nike', 'jordan', 'sneakers', 'premium'], variants: true },
    { name: 'New Balance 574 {{size}}', price: 45000, tags: ['new-balance', 'sneakers'], variants: true },
    { name: 'Canvas Sneakers {{size}}', price: 8000, tags: ['canvas', 'sneakers', 'casual'], variants: true },
    { name: 'Aso Ebi Slippers {{size}}', price: 7000, tags: ['aso-ebi', 'slippers', 'traditional'], variants: true },
    { name: 'Puma RS-X {{size}}', price: 35000, tags: ['puma', 'sneakers'], variants: true },
    { name: 'Timberland Waterproof Boots {{size}}', price: 85000, tags: ['timberland', 'boots', 'premium'], variants: true },
    { name: 'Crocs Classic Clogs {{size}}', price: 12000, tags: ['crocs', 'clogs', 'casual'], variants: true },
  ],
});

// ── Men''s Accessories ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'mens-accessories',
  templates: [
    { name: 'Fossil Gen 6 Smartwatch', price: 85000, tags: ['fossil', 'watch', 'smartwatch'] },
    { name: 'Casio G-Shock GA-2100', price: 45000, tags: ['casio', 'g-shock', 'watch'], featured: true },
    { name: 'Casio Edifice EFR-S107D', price: 55000, tags: ['casio', 'edifice', 'watch'] },
    { name: 'Seiko 5 Sports Automatic', price: 120000, tags: ['seiko', 'automatic', 'watch', 'premium'] },
    { name: 'Timex Expedition Chrono', price: 35000, tags: ['timex', 'watch', 'outdoor'] },
    { name: 'Leather Belt', price: 8000, tags: ['belt', 'leather', 'accessory'] },
    { name: 'Baseball Cap', price: 5000, tags: ['cap', 'hat', 'accessory'] },
    { name: 'Aviator Sunglasses Polarized', price: 12000, tags: ['sunglasses', 'aviator', 'accessory'] },
    { name: 'Tie and Hanky Set', price: 5000, tags: ['tie', 'hanky', 'formal'] },
    { name: 'Leather Wallet RFID Blocking', price: 8000, tags: ['wallet', 'leather', 'accessory'] },
    { name: 'Dog Chain Necklace Silver', price: 3000, tags: ['necklace', 'silver', 'accessory'] },
    { name: 'Prayer Beads Tasbih', price: 2500, tags: ['prayer', 'tasbih', 'islamic'] },
  ],
});

// ── Men''s Bags ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'mens-bags',
  templates: [
    { name: 'Nike Backpack Elite', price: 25000, tags: ['nike', 'backpack', 'bag'], featured: true },
    { name: 'Adidas Power Backpack', price: 22000, tags: ['adidas', 'backpack', 'bag'] },
    { name: 'Leather Briefcase Laptop Bag', price: 45000, compareAt: 55000, tags: ['briefcase', 'leather', 'business'] },
    { name: 'Travel Duffle Bag 50L', price: 28000, tags: ['duffle', 'travel', 'bag'] },
    { name: 'Messenger Bag Canvas', price: 15000, tags: ['messenger', 'canvas', 'bag'] },
    { name: 'Laptop Backpack USB Charging', price: 18000, tags: ['laptop', 'backpack', 'usb'] },
    { name: 'Gym Bag Sports Duffel', price: 12000, tags: ['gym', 'duffel', 'sports'] },
    { name: 'Draw String Backpack', price: 3500, tags: ['drawstring', 'backpack', 'casual'] },
    { name: 'Waist Pouch Fanny Pack', price: 5000, tags: ['fanny-pack', 'waist', 'pouch'] },
    { name: 'Travel Backpack 40L Carry-on', price: 22000, tags: ['travel', 'backpack', 'carry-on'] },
  ],
});

// ─── FASHION WOMEN ────────────────────────────────────────
// ── Women''s Clothing ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'womens-clothing',
  templates: [
    { name: 'Ankara Maxi Dress {{size}}', price: 18000, tags: ['ankara', 'dress', 'african-print', 'women'], variants: true },
    { name: 'Bubu Gown {{size}}', price: 15000, tags: ['bubu', 'gown', 'native', 'women'], featured: true, variants: true },
    { name: 'Wrap Skirt {{size}}', price: 8000, tags: ['skirt', 'wrap', 'women'], variants: true },
    { name: 'Bodycon Dress {{size}}', price: 12000, tags: ['bodycon', 'dress', 'women'], variants: true },
    { name: 'Blouse Top {{size}}', price: 7000, tags: ['blouse', 'top', 'women'], variants: true },
    { name: 'Flowy Palazzo Pants {{size}}', price: 10000, tags: ['palazzo', 'pants', 'women'], variants: true },
    { name: 'Denim Jeans Skinny {{size}}', price: 10000, tags: ['jeans', 'skinny', 'women'], variants: true },
    { name: 'Lace Tops {{size}}', price: 6000, tags: ['lace', 'top', 'women'], variants: true },
    { name: 'Crop Top {{size}}', price: 5000, tags: ['crop-top', 'women'], variants: true },
    { name: 'Kaftan Dress {{size}}', price: 14000, tags: ['kaftan', 'dress', 'native'], variants: true },
    { name: 'Jean Jacket {{size}}', price: 20000, tags: ['jacket', 'denim', 'women'], variants: true },
    { name: 'Blazer Female {{size}}', price: 28000, tags: ['blazer', 'formal', 'women'], variants: true },
    { name: 'T-shirt and Leggings Set {{size}}', price: 8000, tags: ['set', 'leggings', 'casual', 'women'], variants: true },
    { name: 'Aso Ebi Lace Material (6 Yards)', price: 35000, tags: ['aso-ebi', 'lace', 'material', 'premium'], featured: true },
    { name: 'Work Pantsuit {{size}}', price: 35000, tags: ['pantsuit', 'formal', 'women'], variants: true },
  ],
});

// ── Women''s Shoes ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'womens-shoes',
  templates: [
    { name: 'Stiletto Heels {{size}}', price: 15000, tags: ['heels', 'stiletto', 'women'], variants: true },
    { name: 'Block Heel Sandals {{size}}', price: 12000, tags: ['sandals', 'heel', 'women'], variants: true },
    { name: 'Nike Air Force 1 Women {{size}}', price: 55000, tags: ['nike', 'af1', 'sneakers', 'women'], variants: true },
    { name: 'Flat Ballet Shoes {{size}}', price: 6000, tags: ['ballet', 'flats', 'women'], variants: true },
    { name: 'Wedding Heels White {{size}}', price: 25000, tags: ['wedding', 'heels', 'women'], variants: true },
    { name: 'Ankara Canvas Slip-ons {{size}}', price: 7500, tags: ['ankara', 'slip-ons', 'women'], featured: true, variants: true },
    { name: 'Slide Sandals {{size}}', price: 4000, tags: ['sandals', 'slide', 'women'], variants: true },
    { name: 'Platform Sneakers {{size}}', price: 15000, tags: ['platform', 'sneakers', 'women'], variants: true },
    { name: 'Comfort Wedges {{size}}', price: 12000, tags: ['wedges', 'comfort', 'women'], variants: true },
    { name: 'Party Pumps {{size}}', price: 10000, tags: ['pumps', 'party', 'women'], variants: true },
    { name: 'Cowboy Boots {{size}}', price: 25000, tags: ['boots', 'cowboy', 'women'], variants: true },
    { name: 'Espadrilles {{size}}', price: 8000, tags: ['espadrilles', 'women'], variants: true },
  ],
});

// ── Women''s Accessories ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'womens-accessories',
  templates: [
    { name: 'Gold Plated Hoop Earrings', price: 3500, tags: ['earrings', 'gold', 'jewelry'] },
    { name: 'Pearl Necklace Set', price: 8000, tags: ['pearl', 'necklace', 'jewelry'] },
    { name: 'Silver Chain Bracelet', price: 3000, tags: ['bracelet', 'silver', 'jewelry'] },
    { name: 'Hair Bonnet Satin', price: 2500, tags: ['bonnet', 'satin', 'hair'] },
    { name: 'Headwrap Turban (Gele)', price: 3000, tags: ['gele', 'headwrap', 'traditional'] },
    { name: 'Gold Watch Women', price: 15000, tags: ['watch', 'gold', 'women'] },
    { name: 'Sunglasses Cat Eye', price: 5000, tags: ['sunglasses', 'cat-eye', 'women'] },
    { name: 'Fashion Scarf Silk', price: 4000, tags: ['scarf', 'silk', 'accessory'] },
    { name: 'Leather Belt', price: 6000, tags: ['belt', 'leather', 'women'] },
    { name: 'Anklet Silver Chain', price: 2000, tags: ['anklet', 'silver', 'jewelry'] },
    { name: 'Nose Pin Silver', price: 1000, tags: ['nose-pin', 'silver', 'jewelry'] },
    { name: 'Hair Clip Pearl', price: 1500, tags: ['hair-clip', 'pearl', 'accessory'] },
  ],
});

// ── Women''s Bags ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'womens-bags',
  templates: [
    { name: 'Designer Handbag', price: 25000, compareAt: 35000, tags: ['handbag', 'designer', 'women'], featured: true },
    { name: 'Tote Bag Large Capacity', price: 15000, tags: ['tote', 'bag', 'women'] },
    { name: 'Crossbody Bag', price: 10000, tags: ['crossbody', 'bag', 'women'] },
    { name: 'Clutch Bag Evening', price: 8000, tags: ['clutch', 'evening', 'bag'] },
    { name: 'Beaded Clutch Bag African Print', price: 12000, tags: ['beaded', 'clutch', 'african'], featured: true },
    { name: 'Backpack Women Fashion', price: 12000, tags: ['backpack', 'fashion', 'women'] },
    { name: 'Shoulder Bag', price: 12000, tags: ['shoulder', 'bag', 'women'] },
    { name: 'Wicker Basket Bag', price: 6500, tags: ['wicker', 'basket', 'bag'] },
    { name: 'Kids Diaper Bag Multi-pocket', price: 10000, tags: ['diaper', 'bag', 'baby'] },
    { name: 'Makeup Train Case', price: 8000, tags: ['makeup', 'train-case', 'cosmetic'] },
  ],
});

// ─── HEALTH & BEAUTY ──────────────────────────────────────
// ── Skincare ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'skincare',
  templates: [
    { name: 'Nivea Body Lotion 400ml', price: 4500, tags: ['nivea', 'body-lotion', 'skincare'] },
    { name: 'Cetaphil Gentle Skin Cleanser 500ml', price: 12000, tags: ['cetaphil', 'cleanser', 'skincare'] },
    { name: 'Fair & White Whitening Cream 200ml', price: 6500, tags: ['fair-white', 'whitening', 'skincare'] },
    { name: 'CeraVe Moisturising Cream 454g', price: 15000, tags: ['cerave', 'moisturizer', 'skincare'], featured: true },
    { name: 'Neutrogena Hydro Boost Gel 50ml', price: 12000, tags: ['neutrogena', 'hydro-boost', 'skincare'] },
    { name: 'Simple Kind to Skin Facial Wash 150ml', price: 5000, tags: ['simple', 'facial-wash', 'skincare'] },
    { name: 'The Ordinary Niacinamide 10% 30ml', price: 8000, tags: ['the-ordinary', 'niacinamide', 'serum'] },
    { name: "L'Oreal Revitalift Vitamin C Serum 30ml", price: 15000, tags: ['loreal', 'revitalift', 'serum'] },
    { name: 'Nivea Sun Protect SPF 50 200ml', price: 6000, tags: ['nivea', 'sunscreen', 'spf'] },
    { name: 'Vitamin C Brightening Face Mask', price: 3500, tags: ['face-mask', 'vitamin-c', 'skincare'] },
    { name: 'Black Soap Original 500g', price: 2500, tags: ['black-soap', 'natural', 'skincare'] },
    { name: 'Shea Butter Raw 1kg', price: 3500, tags: ['shea-butter', 'natural', 'skincare'] },
  ],
});

// ── Hair Care ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'hair-care',
  templates: [
    { name: 'Hair Relaxer Kit No-Lye', price: 4500, tags: ['relaxer', 'hair', 'chemical'] },
    { name: 'Cantu Shea Butter Leave-In Conditioner 400ml', price: 6500, tags: ['cantu', 'conditioner', 'hair'] },
    { name: 'ORS Olive Oil Hair Lotion 350ml', price: 3500, tags: ['ors', 'hair-lotion', 'hair'] },
    { name: 'Mielle Rosemary Mint Oil 118ml', price: 12000, tags: ['mielle', 'oil', 'hair'], featured: true },
    { name: 'Dark and Lovely Shampoo 350ml', price: 3500, tags: ['dark-lovely', 'shampoo', 'hair'] },
    { name: 'Shampoo Anti-Dandruff Head & Shoulders 400ml', price: 5000, tags: ['head-shoulders', 'shampoo', 'dandruff'] },
    { name: 'Human Hair Bundle Brazilian 12"', price: 18000, tags: ['hair-bundle', 'brazilian', 'weave'] },
    { name: 'Lace Wig Frontal HD 6x4', price: 25000, tags: ['wig', 'lace', 'frontal'], featured: true },
    { name: 'Edge Control Gel Strong Hold', price: 1500, tags: ['edge-control', 'gel', 'hair'] },
    { name: 'Hair Growth Oil Castor & Rosemary', price: 3000, tags: ['hair-growth', 'oil', 'natural'] },
    { name: 'Scrunchies Hair Ties Set 12pcs', price: 1000, tags: ['scrunchies', 'hair-ties', 'accessory'] },
    { name: 'Wide Tooth Comb Detangling', price: 1500, tags: ['comb', 'detangling', 'hair'] },
  ],
});

// ── Makeup ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'makeup',
  templates: [
    { name: 'Maybelline Fit Me Foundation 30ml', price: 6000, tags: ['maybelline', 'foundation', 'makeup'] },
    { name: 'MAC Matte Lipstick', price: 12000, tags: ['mac', 'lipstick', 'makeup'] },
    { name: 'NARS Radiant Creamy Concealer', price: 15000, tags: ['nars', 'concealer', 'makeup'] },
    { name: 'NYX Professional Makeup Eyeshadow Palette', price: 10000, tags: ['nyx', 'eyeshadow', 'makeup'], featured: true },
    { name: 'Fenty Beauty Pro Filter Foundation', price: 25000, tags: ['fenty', 'foundation', 'makeup'] },
    { name: 'Brow Pencil Waterproof', price: 2500, tags: ['brow-pencil', 'makeup'] },
    { name: 'Mascara Volume & Curl', price: 3500, tags: ['mascara', 'makeup'] },
    { name: 'Setting Spray Matte Finish 120ml', price: 5000, tags: ['setting-spray', 'makeup'] },
    { name: 'Liquid Eyeliner Waterproof', price: 3000, tags: ['eyeliner', 'makeup'] },
    { name: 'Highlighter Palette Glow', price: 4500, tags: ['highlighter', 'makeup'] },
    { name: 'Makeup Brush Set 12pcs', price: 8000, tags: ['brush-set', 'makeup'], featured: true },
    { name: 'Lip Gloss Shiny Finish', price: 2000, tags: ['lip-gloss', 'makeup'] },
  ],
});

// ── Fragrance ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'fragrance',
  templates: [
    { name: 'Armaf Club De Nuit Intense 100ml', price: 25000, tags: ['armaf', 'perfume', 'men'], featured: true },
    { name: 'Lataffa Oud 100ml', price: 18000, tags: ['lataffa', 'oud', 'perfume'] },
    { name: 'Tom Ford Black Orchid 100ml', price: 85000, tags: ['tom-ford', 'perfume', 'luxury'] },
    { name: 'Dior Sauvage 100ml', price: 75000, tags: ['dior', 'sauvage', 'perfume', 'men'] },
    { name: 'Chanel No 5 Eau de Parfum 100ml', price: 95000, tags: ['chanel', 'perfume', 'women', 'luxury'] },
    { name: 'Nina Ricci Nina 80ml', price: 45000, tags: ['nina-ricci', 'perfume', 'women'] },
    { name: 'Body Spray Lynx Africa 150ml', price: 3500, tags: ['lynx', 'body-spray', 'men'] },
    { name: 'Body Spray Impressions 200ml', price: 2500, tags: ['impressions', 'body-spray', 'women'] },
    { name: 'Musk Perfume Oil Roll-on', price: 1500, tags: ['musk', 'perfume-oil', 'roll-on'] },
    { name: 'Amber Oud Attar 10ml', price: 3000, tags: ['oud', 'attar', 'oil'] },
  ],
});

// ── Personal Care ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'personal-care',
  templates: [
    { name: 'Oral-B Pro 1000 Electric Toothbrush', price: 15000, tags: ['oral-b', 'toothbrush', 'electric'] },
    { name: 'Colgate Total Advanced 100g', price: 800, tags: ['colgate', 'toothpaste', 'oral'] },
    { name: 'Gillette Fusion5 Razor 8-pack', price: 12000, tags: ['gillette', 'razor', 'shaving'] },
    { name: 'Nivea Men Deodorant 150ml', price: 2500, tags: ['nivea', 'deodorant', 'men'] },
    { name: 'Sure Women Deodorant 150ml', price: 2500, tags: ['sure', 'deodorant', 'women'] },
    { name: 'Always Ultra Sanitary Pads 28pk', price: 2500, tags: ['always', 'sanitary', 'women'] },
    { name: 'Cottonelle Toilet Paper 12-roll', price: 4500, tags: ['cottonelle', 'toilet-paper', 'bath'] },
    { name: 'Kleenex Facial Tissues 6-box', price: 3500, tags: ['kleenex', 'tissue', 'facial'] },
    { name: 'Hand Sanitizer Antibacterial 500ml', price: 2500, tags: ['sanitizer', 'antibacterial'] },
    { name: 'Dettol Antiseptic Liquid 500ml', price: 3000, tags: ['dettol', 'antiseptic'] },
    { name: 'Vaseline Petroleum Jelly 400ml', price: 3000, tags: ['vaseline', 'petroleum-jelly', 'skincare'] },
    { name: 'Nivea Men Cream 150ml', price: 2500, tags: ['nivea', 'men', 'cream'] },
  ],
});

// ─── HOME & LIVING ────────────────────────────────────────
// ── Furniture ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'furniture',
  templates: [
    { name: 'Queen Size Bed Frame Upholstered', price: 180000, compareAt: 220000, tags: ['bed', 'frame', 'upholstered', 'bedroom'] },
    { name: 'King Size Bed Frame Wooden', price: 250000, tags: ['bed', 'frame', 'wooden', 'bedroom'] },
    { name: '3-Seater Sofa Velvet', price: 280000, compareAt: 350000, tags: ['sofa', 'velvet', 'living-room'], featured: true },
    { name: '2-Seater Sofa Leather', price: 220000, tags: ['sofa', 'leather', 'living-room'] },
    { name: 'Dining Table 6-Seater Glass', price: 150000, tags: ['dining-table', '6-seater', 'dining'] },
    { name: 'Dining Chair Set of 4', price: 85000, tags: ['dining-chair', 'set', 'dining'] },
    { name: 'Wardrobe 5-Door Sliding', price: 200000, tags: ['wardrobe', 'sliding', 'bedroom'] },
    { name: 'Bookshelf 4-Tier Wood', price: 65000, tags: ['bookshelf', 'wood', 'office'] },
    { name: 'Office Chair Ergonomic Mesh', price: 75000, tags: ['office-chair', 'ergonomic', 'office'] },
    { name: 'Nightstand Bedside Table', price: 35000, tags: ['nightstand', 'bedside', 'bedroom'] },
    { name: 'TV Stand Media Unit 60"', price: 85000, tags: ['tv-stand', 'media-unit', 'living-room'] },
    { name: 'Rug Carpet Shaggy 6x9ft', price: 45000, tags: ['rug', 'carpet', 'shaggy', 'living-room'] },
    { name: 'Shoe Rack 3-Tier', price: 18000, tags: ['shoe-rack', 'storage', 'entry'] },
    { name: 'Hanging Closet Organizer', price: 8000, tags: ['closet', 'organizer', 'storage'] },
  ],
});

// ── Kitchen & Dining ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'kitchen-dining',
  templates: [
    { name: 'Non-Stick Cookware Set 12pcs', price: 45000, compareAt: 55000, tags: ['cookware', 'non-stick', 'set'], featured: true },
    { name: 'Stainless Steel Pot Set 5pcs', price: 35000, tags: ['pot', 'stainless', 'set'] },
    { name: 'Pressure Cooker 6L', price: 18000, tags: ['pressure-cooker', '6l'] },
    { name: 'Rice Cooker 1.8L', price: 15000, tags: ['rice-cooker', 'kitchen'] },
    { name: 'Cutlery Set 24-Piece', price: 12000, tags: ['cutlery', 'set', 'dining'] },
    { name: 'Dinner Set Porcelain 12-Piece', price: 25000, tags: ['dinner-set', 'porcelain', 'dining'] },
    { name: 'Glass Tumbler Set 6pcs', price: 5000, tags: ['tumbler', 'glass', 'set'] },
    { name: 'Chef Knife Set 5pcs', price: 15000, tags: ['knife', 'chef', 'set'] },
    { name: 'Cutting Board Set Bamboo 3pcs', price: 8000, tags: ['cutting-board', 'bamboo', 'kitchen'] },
    { name: 'Mixing Bowl Set Stainless 3pcs', price: 6000, tags: ['mixing-bowl', 'stainless'] },
    { name: 'Coffee Maker Drip 12-Cup', price: 25000, tags: ['coffee-maker', 'kitchen'] },
    { name: 'Water Dispenser Electric Hot/Cold', price: 35000, tags: ['water-dispenser', 'kitchen'] },
    { name: 'Food Container Set Plastic 10pcs', price: 6000, tags: ['food-container', 'storage'] },
    { name: 'Mortar and Pestle Granite', price: 5000, tags: ['mortar', 'pestle', 'traditional'] },
  ],
});

// ── Bedding & Bath ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'bedding-bath',
  templates: [
    { name: 'Bed Sheet Set Queen Size 4-Piece', price: 15000, tags: ['bed-sheet', 'queen', 'set'], featured: true },
    { name: 'Duvet Cover King Size', price: 18000, tags: ['duvet', 'cover', 'king'] },
    { name: 'Memory Foam Pillow Queen', price: 8000, tags: ['pillow', 'memory-foam', 'sleep'] },
    { name: 'Bath Towel Set 3-Pieces Egyptian Cotton', price: 12000, tags: ['towel', 'bath', 'cotton'], featured: true },
    { name: 'Hand Towel Set 4-Pieces', price: 5000, tags: ['hand-towel', 'set'] },
    { name: 'Bath Rug Mat Non-Slip', price: 5000, tags: ['bath-rug', 'non-slip'] },
    { name: 'Throw Blanket Soft Fleece', price: 8000, tags: ['blanket', 'fleece', 'throw'] },
    { name: 'Weighted Blanket 7kg', price: 35000, tags: ['weighted-blanket', 'sleep'] },
    { name: 'Mosquito Net King Size', price: 4000, tags: ['mosquito-net', 'bed'] },
    { name: 'Mattress Protector Waterproof Queen', price: 10000, tags: ['mattress-protector', 'waterproof'] },
    { name: 'Fitted Bed Skirt Queen', price: 5000, tags: ['bed-skirt', 'queen'] },
  ],
});

// ── Home Decor ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'home-decor',
  templates: [
    { name: 'Scented Candle Set 3-Pack Vanilla', price: 6000, tags: ['candle', 'scented', 'decor'] },
    { name: 'Wall Art Canvas Abstract 60x40cm', price: 8500, tags: ['wall-art', 'canvas', 'abstract'] },
    { name: 'Artificial Monstera Plant 120cm', price: 12000, tags: ['artificial', 'plant', 'decor'] },
    { name: 'Curtain Set 2-Panels Velvet', price: 18000, tags: ['curtains', 'velvet', 'window'] },
    { name: 'Decorative Cushion Cover Set 4', price: 8000, tags: ['cushion', 'cover', 'decor'] },
    { name: 'Photo Frame Collage 12-Openings', price: 5000, tags: ['photo-frame', 'collage'] },
    { name: 'Table Lamp USB LED', price: 8000, tags: ['lamp', 'table', 'led'] },
    { name: 'Wall Clock Modern Silent', price: 7000, tags: ['clock', 'wall', 'silent'] },
    { name: 'Fairy String Lights 10m', price: 3500, tags: ['fairy-lights', 'string', 'decor'] },
    { name: 'African Mask Wall Decor Wood', price: 5000, tags: ['mask', 'wall-decor', 'african'] },
    { name: 'Decorative Vase Ceramic 30cm', price: 6000, tags: ['vase', 'ceramic', 'decor'] },
  ],
});

// ── Small Appliances ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'small-appliances',
  templates: [
    { name: 'Nestle Nescafe Dolce Gusto Coffee Machine', price: 45000, tags: ['nescafe', 'coffee', 'machine'] },
    { name: 'Binatone Electric Kettle 1.7L', price: 8000, tags: ['binatone', 'kettle', 'kitchen'] },
    { name: 'Binatone Blender 2L', price: 12000, tags: ['binatone', 'blender', 'kitchen'] },
    { name: 'Philips Airfryer XXL 5.5L', price: 85000, compareAt: 100000, tags: ['philips', 'airfryer', 'kitchen'], featured: true },
    { name: 'Scanfrost Electric Iron Steam', price: 8000, tags: ['scanfrost', 'iron', 'laundry'] },
    { name: 'LG Microwave 25L', price: 45000, tags: ['lg', 'microwave', 'kitchen'] },
    { name: 'Samsung Refrigerator 200L', price: 180000, tags: ['samsung', 'fridge', 'kitchen'] },
    { name: 'Samsung Washing Machine 7kg Front Load', price: 250000, tags: ['samsung', 'washing-machine', 'laundry'] },
    { name: 'Nexus Ceiling Fan 56"', price: 18000, tags: ['nexus', 'fan', 'ceiling'] },
    { name: 'Standing Fan Oscillating 18"', price: 12000, tags: ['fan', 'standing', 'cooling'] },
    { name: 'Binatone Toaster 2-Slice', price: 9000, tags: ['binatone', 'toaster', 'kitchen'] },
    { name: 'Vacuum Cleaner Handheld', price: 25000, tags: ['vacuum', 'cleaner', 'home'] },
    { name: 'Sewing Machine Portable', price: 55000, tags: ['sewing-machine', 'portable'] },
    { name: 'Generator Inverter 1000W Pure Sine', price: 120000, tags: ['generator', 'inverter', 'power'] },
  ],
});

// ─── BABY & KIDS ──────────────────────────────────────────
// ── Baby Clothing ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'baby-clothing',
  templates: [
    { name: 'Baby Onesie Bodysuit Cotton {{size}}', price: 3000, tags: ['onesie', 'bodysuit', 'baby'], variants: true },
    { name: 'Baby Romper Set Short Sleeve {{size}}', price: 5000, tags: ['romper', 'baby', 'set'], variants: true },
    { name: 'Baby Swaddle Wrap 3-Pack', price: 6000, tags: ['swaddle', 'wrap', 'baby'] },
    { name: 'Baby Hat and Mittens Set', price: 3500, tags: ['hat', 'mittens', 'baby'] },
    { name: 'Baby Socks Set 6-Pairs', price: 2500, tags: ['socks', 'baby', 'set'] },
    { name: 'Baby Sleepsuit Footed {{size}}', price: 4000, tags: ['sleepsuit', 'footed', 'baby'], variants: true },
    { name: 'Baby Bib Set 5-Pack', price: 3000, tags: ['bib', 'baby', 'set'] },
    { name: 'Baby Dress {{size}}', price: 5000, tags: ['dress', 'baby', 'girl'], variants: true },
    { name: 'Baby T-Shirt Set 3-Pack {{size}}', price: 4000, tags: ['t-shirt', 'baby', 'set'], variants: true },
    { name: 'Baby Traditional Outfit {{size}}', price: 8000, tags: ['traditional', 'native', 'baby'], variants: true },
  ],
});

// ── Baby Gear ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'baby-gear',
  templates: [
    { name: 'Baby Stroller Lightweight Foldable', price: 85000, compareAt: 100000, tags: ['stroller', 'baby', 'travel'], featured: true },
    { name: 'Baby Carrier Front Pack Ergonomic', price: 25000, tags: ['carrier', 'baby', 'ergonomic'] },
    { name: 'Car Seat Group 0+ Infant', price: 65000, tags: ['car-seat', 'infant', 'safety'] },
    { name: 'Baby Playpen Foldable', price: 35000, tags: ['playpen', 'baby', 'safety'] },
    { name: 'Baby Bouncer Vibrating Chair', price: 22000, tags: ['bouncer', 'baby', 'chair'] },
    { name: 'Baby Crib Cot Convertible', price: 120000, tags: ['crib', 'cot', 'baby', 'furniture'] },
    { name: 'Baby Bottle Warmer', price: 12000, tags: ['bottle-warmer', 'baby'] },
    { name: 'Changing Table with Storage', price: 55000, tags: ['changing-table', 'baby', 'furniture'] },
    { name: 'Baby High Chair Wooden', price: 45000, tags: ['high-chair', 'baby', 'feeding'] },
    { name: 'Baby Swing Automatic', price: 38000, tags: ['swing', 'baby'] },
  ],
});

// ── Toys ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'toys',
  templates: [
    { name: 'LEGO Classic Bricks Set 11030', price: 25000, tags: ['lego', 'building', 'educational'], featured: true },
    { name: 'Barbie Dreamhouse Dollhouse', price: 35000, tags: ['barbie', 'dollhouse', 'doll'] },
    { name: 'Hot Wheels 20-Car Pack', price: 8000, tags: ['hot-wheels', 'cars', 'toy'] },
    { name: 'Educational Abacus Counting Toy', price: 3500, tags: ['abacus', 'educational', 'counting'] },
    { name: "Rubik's Cube 3x3 Speed", price: 3000, tags: ['rubiks', 'cube', 'puzzle'] },
    { name: 'Nerf Gun Blaster Elite 2.0', price: 15000, tags: ['nerf', 'gun', 'blaster'] },
    { name: 'Plush Teddy Bear 50cm', price: 7000, tags: ['teddy-bear', 'plush', 'stuffed'] },
    { name: 'Kids Drum Set Musical', price: 12000, tags: ['drum', 'musical', 'toy'] },
    { name: 'Remote Control Car 4WD', price: 8000, tags: ['rc-car', 'remote-control'] },
    { name: 'Puzzle 1000-Piece Landscape', price: 5000, tags: ['puzzle', '1000-piece'] },
    { name: 'Toy Kitchen Set Play 25pcs', price: 10000, tags: ['kitchen', 'play', 'toy'] },
    { name: 'Building Blocks 200-Piece', price: 5000, tags: ['building-blocks', 'educational'] },
    { name: 'Train Set Electric with Track', price: 12000, tags: ['train', 'electric', 'track'] },
    { name: 'Watercolor Paint Set 24 Colors', price: 3000, tags: ['watercolor', 'paint', 'art'] },
  ],
});

// ── Kids'' Fashion ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'kids-fashion',
  templates: [
    { name: 'Kids Casual T-Shirt {{size}}', price: 4000, tags: ['t-shirt', 'kids', 'casual'], variants: true },
    { name: 'Kids Jeans {{size}}', price: 6000, tags: ['jeans', 'kids', 'denim'], variants: true },
    { name: 'Kids Sneakers {{size}}', price: 8000, tags: ['sneakers', 'kids', 'shoes'], variants: true },
    { name: 'Kids School Shirt {{size}}', price: 3500, tags: ['school', 'shirt', 'kids'], variants: true },
    { name: 'Kids Native Wear Agbada {{size}}', price: 12000, tags: ['native', 'agbada', 'kids'], featured: true, variants: true },
    { name: 'Girls Floral Dress {{size}}', price: 7000, tags: ['dress', 'floral', 'girls'], variants: true },
    { name: 'Kids Shorts Set 2-Pack {{size}}', price: 5000, tags: ['shorts', 'set', 'kids'], variants: true },
    { name: 'Girls Tutu Skirt {{size}}', price: 5000, tags: ['tutu', 'skirt', 'girls'], variants: true },
    { name: 'Kids Pajama Set {{size}}', price: 6000, tags: ['pajama', 'sleepwear', 'kids'], variants: true },
    { name: 'Kids Sandals {{size}}', price: 5000, tags: ['sandals', 'kids'], variants: true },
    { name: 'School Backpack Kids', price: 8000, tags: ['backpack', 'kids', 'school'] },
    { name: 'Boys Polo Shirt {{size}}', price: 4500, tags: ['polo', 'boys', 'shirt'], variants: true },
  ],
});

// ── Diapers & Wipes ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'diapers-wipes',
  templates: [
    { name: 'Pampers Premium Diapers Size XS 80pk', price: 12000, tags: ['pampers', 'diapers', 'newborn'] },
    { name: 'Pampers Active Baby Diapers Size M 68pk', price: 11000, tags: ['pampers', 'diapers', 'size-m'] },
    { name: 'Huggies Pure Diapers Size L 56pk', price: 11500, tags: ['huggies', 'diapers', 'size-l'] },
    { name: 'Baby Wipes Fragrance Free 80pk 12-Pack', price: 15000, tags: ['baby-wipes', 'fragrance-free'] },
    { name: 'Pampers Baby Wipes 48pk 6-Pack', price: 8000, tags: ['pampers', 'wipes'] },
    { name: 'Cloth Diapers Reusable Set 5-Pack', price: 12000, tags: ['cloth-diapers', 'reusable'] },
    { name: 'Nappy Rash Cream Zinc Oxide 100g', price: 3500, tags: ['nappy-rash', 'cream'] },
    { name: 'Diaper Changing Pad Waterproof', price: 4000, tags: ['changing-pad', 'waterproof'] },
    { name: 'Pampers Premium Care Size XL 48pk', price: 13000, tags: ['pampers', 'diapers', 'size-xl'] },
    { name: 'Diaper Genie Pail Refill 3-Pack', price: 8000, tags: ['diaper-pail', 'refill'] },
  ],
});

// ─── FOOD & GROCERIES ────────────────────────────────────
// ── Beverages ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'beverages',
  templates: [
    { name: 'Coca-Cola 35cl Can', price: 200, tags: ['coca-cola', 'soft-drink', 'carbonated'] },
    { name: 'Coca-Cola 50cl PET', price: 300, tags: ['coca-cola', 'soft-drink'] },
    { name: 'Fanta Orange 35cl Can', price: 200, tags: ['fanta', 'soft-drink'] },
    { name: 'Sprite 35cl Can', price: 200, tags: ['sprite', 'soft-drink'] },
    { name: 'Maltina 65cl Non-Alcoholic', price: 500, tags: ['maltina', 'malt', 'drink'] },
    { name: 'Amstel Malta 65cl', price: 500, tags: ['amstel', 'malta', 'drink'] },
    { name: 'Chi Exotic Pure Juice 1L', price: 1200, tags: ['chi', 'juice', 'exotic'] },
    { name: 'Hollandia Yoghurt 1L', price: 1500, tags: ['hollandia', 'yoghurt', 'drink'] },
    { name: 'Eva Natural Spring Water 75cl', price: 300, tags: ['eva', 'water', 'spring'] },
    { name: 'Nestle Pure Life Water 1.5L', price: 350, tags: ['nestle', 'water', 'pure-life'] },
    { name: 'Ribena Blackcurrant 1L', price: 1500, tags: ['ribena', 'juice', 'blackcurrant'] },
    { name: 'Zobo Drink Natural 75cl', price: 500, tags: ['zobo', 'local', 'drink'] },
    { name: 'Energy Drink Predator 250ml', price: 400, tags: ['predator', 'energy-drink'] },
    { name: 'Fearless Energy Drink 350ml', price: 500, tags: ['fearless', 'energy-drink'] },
  ],
});

// ── Rice & Grains ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'rice-grains',
  templates: [
    { name: 'Mama Gold Rice 50kg', price: 52000, tags: ['mama-gold', 'rice', 'staple'] },
    { name: 'Mama Gold Rice 10kg', price: 11500, tags: ['mama-gold', 'rice'] },
    { name: 'Royal Stallion Rice 50kg', price: 55000, tags: ['royal-stallion', 'rice', 'premium'] },
    { name: 'Royal Stallion Rice 10kg', price: 12000, tags: ['royal-stallion', 'rice'] },
    { name: 'Caprice Rice 50kg', price: 50000, tags: ['caprice', 'rice'] },
    { name: 'Rice Ofe Nigeria 10kg', price: 10000, tags: ['rice', 'local'] },
    { name: 'Beans Oloyin 10kg', price: 15000, tags: ['beans', 'oloyin', 'legumes'] },
    { name: 'Honey Beans 5kg', price: 8000, tags: ['beans', 'honey', 'legumes'] },
    { name: 'Garri Ijebu 5kg', price: 5000, tags: ['garri', 'ijebu', 'cassava'] },
    { name: 'Garri White 10kg', price: 8000, tags: ['garri', 'white', 'cassava'] },
    { name: 'Semolina Flour 5kg', price: 6000, tags: ['semolina', 'flour', 'swallow'] },
    { name: 'Wheat Flour Golden Penny 5kg', price: 4500, tags: ['wheat', 'flour', 'golden-penny'] },
    { name: 'Yam Flour (Elubo) 2kg', price: 3500, tags: ['yam-flour', 'elubo', 'swallow'] },
    { name: 'Corn Flour 5kg', price: 3500, tags: ['corn-flour', 'maize'] },
  ],
});

// ── Cooking Oil & Spices ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'oil-spices',
  templates: [
    { name: 'Kings Vegetable Oil 5L', price: 8500, tags: ['kings', 'vegetable-oil', 'cooking'] },
    { name: 'Devon Kings Vegetable Oil 5L', price: 9000, tags: ['devon-kings', 'vegetable-oil'] },
    { name: 'Power Oil Golden 5L', price: 8500, tags: ['power-oil', 'vegetable-oil'] },
    { name: 'Mamador Vegetable Oil 5L', price: 9500, tags: ['mamador', 'vegetable-oil'] },
    { name: 'Gino Tomato Paste 400g', price: 1500, tags: ['gino', 'tomato-paste'] },
    { name: 'Peeled Tomatoes De Rica 400g', price: 1200, tags: ['de-rica', 'tomato', 'canned'] },
    { name: 'Knorr Seasoning Cubes 100g', price: 400, tags: ['knorr', 'seasoning', 'stock'] },
    { name: 'Maggi Crayfish 200g', price: 500, tags: ['maggi', 'crayfish', 'seasoning'] },
    { name: 'Maggi Star Cubes 120g', price: 300, tags: ['maggi', 'star', 'seasoning'] },
    { name: 'Curry Powder 100g', price: 500, tags: ['curry', 'powder', 'spice'] },
    { name: 'Dried Pepper Mix 500g', price: 1500, tags: ['pepper', 'dried', 'spice'] },
    { name: 'Onion Powder 200g', price: 800, tags: ['onion', 'powder', 'spice'] },
    { name: 'Salt Table Iodised 1kg', price: 300, tags: ['salt', 'iodised'] },
    { name: 'Groundnut Oil Pure 5L', price: 10000, tags: ['groundnut-oil', 'pure'] },
  ],
});

// ── Snacks & Confectionery ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'snacks-confectionery',
  templates: [
    { name: 'Indomie Instant Noodles Chicken 70g Carton 40pk', price: 7200, tags: ['indomie', 'noodles', 'instant'] },
    { name: 'Indomie Instant Noodles Chicken 70g (Single)', price: 200, tags: ['indomie', 'noodles', 'single'] },
    { name: 'McVities Digestive Biscuits 400g', price: 2500, tags: ['mcvities', 'biscuits', 'digestive'] },
    { name: 'Cabin Biscuits 200g', price: 500, tags: ['cabin', 'biscuits'] },
    { name: 'Milk Chocolate Cadbury Dairy Milk 100g', price: 1500, tags: ['cadbury', 'chocolate', 'dairy-milk'] },
    { name: 'Plantain Chips (Kpekere) 200g', price: 1000, tags: ['plantain-chips', 'kpekere', 'snack'] },
    { name: 'Groundnut Roasted 500g', price: 1200, tags: ['groundnut', 'roasted', 'snack'] },
    { name: 'Cashew Nuts 500g', price: 3000, tags: ['cashew', 'nuts', 'snack'] },
    { name: 'Puff Puff Mix 500g', price: 1000, tags: ['puff-puff', 'mix', 'snack'] },
    { name: 'Cake Vanilla Loaf 500g', price: 2500, tags: ['cake', 'vanilla', 'loaf'] },
    { name: 'Gala Sausage Roll 60g', price: 300, tags: ['gala', 'sausage', 'roll'] },
    { name: 'Pringles Original 165g', price: 3500, tags: ['pringles', 'chips', 'imported'] },
  ],
});

// ── Cereals & Breakfast ──
PRODUCT_TEMPLATES.push({
  subcatSlug: 'breakfast-cereals',
  templates: [
    { name: 'Golden Morn Cereal 500g', price: 2500, tags: ['golden-morn', 'cereal', 'breakfast'] },
    { name: 'Golden Morn Cereal 1kg', price: 4500, tags: ['golden-morn', 'cereal'] },
    { name: 'Nestle Milo 500g', price: 4500, tags: ['nestle', 'milo', 'chocolate'] },
    { name: 'Nestle Milo 1kg', price: 8000, tags: ['nestle', 'milo'], featured: true },
    { name: 'Oats Quaker 500g', price: 3000, tags: ['quaker', 'oats', 'breakfast'] },
    { name: 'Oats Quaker 1kg', price: 5000, tags: ['quaker', 'oats'] },
    { name: "Corn Flakes Kellogg's 500g", price: 3500, tags: ['kelloggs', 'corn-flakes', 'cereal'] },
    { name: 'Honey Pure Natural 500g', price: 6000, tags: ['honey', 'natural', 'breakfast'] },
    { name: 'Peanut Butter Smooth 500g', price: 3500, tags: ['peanut-butter', 'breakfast'] },
    { name: 'Chocolate Spread Nutella 350g', price: 4500, tags: ['nutella', 'chocolate', 'spread'] },
    { name: 'Tea Lipton Yellow Label 100pk', price: 3500, tags: ['lipton', 'tea', 'breakfast'] },
    { name: 'Coffee Nescafe 3-in-1 50pk', price: 4500, tags: ['nescafe', 'coffee', 'instant'] },
  ],
});

// ─── Variant Data ─────────────────────────────────────────
const VARIANTS: Record<string, Record<string, string[]>> = {
  phone: { storage_gb: ['64', '128', '256'] },
  phone256: { storage_gb: ['128', '256', '512'] },
  premium: { storage_gb: ['256', '512', '1024'] },
  laptop: { ram_gb: ['8', '16', '32'], storage_gb: ['256', '512', '1024'] },
  tv: { size_inch: ['32', '43', '50', '55', '65'] },
  clothing: { size: ['S', 'M', 'L', 'XL', '2XL'] },
  shoes: { size: ['39', '40', '41', '42', '43', '44'] },
  wshoes: { size: ['36', '37', '38', '39', '40', '41'] },
  baby: { size: ['Newborn', '0-3M', '3-6M', '6-12M', '12-18M'] },
  kids: { size: ['2-3Y', '3-4Y', '4-5Y', '5-6Y', '6-8Y'] },
};

function getVariantKey(name: string): string | null {
  if (!name.includes('{{')) return null;
  if (name.includes('ram_gb') && name.includes('storage_gb')) return 'laptop';
  if (name.includes('storage_gb')) {
    if (name.includes('Ultra') || name.includes('Pro Max') || name.includes('Z Fold') || name.includes('Pro M4')) return 'premium';
    if (name.includes('A55') || name.includes('Note 40') || name.includes('Camon 30 Premier') || name.includes('iPad Air') || name.includes('Tab S9 FE') || name.includes('Tab A9')) return 'phone256';
    if (name.includes('iPhone 15') || name.includes('Camon 30') || name.includes('Padmini') || name.includes('XPad') || name.includes('Fire HD') || name.includes('MatePad') || name.includes('Tab S9 Ultra') || name.includes('Galaxy Book')) return 'phone256';
    return 'phone';
  }
  if (name.includes('size_inch')) return 'tv';
  if (name.includes('baby-size')) return 'baby';
  if (name.includes('kids-size')) return 'kids';
  if (name.includes('womens-shoe') || name.includes('womens-shoes')) return 'wshoes';
  if (name.includes('{{size}}')) {
    if (name.match(/(sneakers|shoes|boots|loafers|sandals|heels|slippers|clogs|sneaker|force|jordan|ultraboost|timberland|crocs|pumps|wedges|ballet|espadrilles|oxford)\b/i)) return 'shoes';
    return 'clothing';
  }
  return null;
}

function expandName(name: string, vars: Record<string, string>): string {
  let r = name;
  for (const [k, v] of Object.entries(vars)) {
    r = r.replace(new RegExp(`\\{\\{\\s*${k}\\s*\\}\\}`, 'g'), v);
  }
  return r;
}

function calcPrice(base: number, vars: Record<string, string>): number {
  let p = base;
  if (vars.storage_gb) {
    const s = parseInt(vars.storage_gb);
    if (s >= 1000) p = Math.round(base * 1.35);
    else if (s >= 512) p = Math.round(base * 1.15);
    else if (s >= 256) p = Math.round(base * 1.05);
  }
  if (vars.ram_gb) {
    const r = parseInt(vars.ram_gb);
    if (r >= 32) p = Math.round(base * 1.25);
    else if (r >= 16) p = Math.round(base * 1.10);
  }
  if (vars.size_inch) {
    const inches = parseInt(vars.size_inch);
    p = Math.round(base * (0.4 + inches / 55));
  }
  return p;
}

function genVariantProduct(
  tpl: ProdTpl,
  vars: Record<string, string>,
  catId: string,
  vendorId: string,
  idx: number,
) {
  const name = expandName(tpl.name, vars);
  const price = calcPrice(tpl.price, vars);
  const slug = `${slugify(name)}-${idx}`;
  return {
    vendorId,
    categoryId: catId,
    name,
    slug,
    description: `${name} - ${tpl.tags.slice(0, 3).join(", ")}. Quality assured.`,
    basePrice: fmtPrice(price),
    compareAtPrice: tpl.compareAt ? fmtPrice(Math.round(tpl.compareAt * (price / tpl.price))) : undefined,
    status: 'ACTIVE' as const,
    isFeatured: tpl.featured || false,
    avgRating: randomBetween(3.0, 5.0),
    reviewCount: randInt(0, 120),
    totalSold: randInt(1, 800),
    tags: tpl.tags,
  };
}

function cartesian(arrays: string[][]): string[][] {
  if (arrays.length === 0) return [[]];
  const [first, ...rest] = arrays;
  const restP = cartesian(rest);
  const result: string[][] = [];
  for (const f of first) {
    for (const r of restP) {
      result.push([f, ...r]);
    }
  }
  return result;
}

function genSingleProduct(
  tpl: ProdTpl,
  catId: string,
  vendorId: string,
  idx: number,
) {
  const slug = `${slugify(tpl.name)}-${idx}`;
  return {
    vendorId,
    categoryId: catId,
    name: tpl.name,
    slug,
    description: `${tpl.name} - ${tpl.tags.slice(0, 3).join(", ")}. Available now on Fushion.`,
    basePrice: fmtPrice(tpl.price),
    compareAtPrice: tpl.compareAt ? fmtPrice(tpl.compareAt) : undefined,
    status: 'ACTIVE' as const,
    isFeatured: tpl.featured || false,
    avgRating: randomBetween(3.0, 5.0),
    reviewCount: randInt(0, 80),
    totalSold: randInt(1, 500),
    tags: tpl.tags,
  };
}

// ══════════════════════════════════════════════════════════
//  SEED FUNCTION
// ══════════════════════════════════════════════════════════
async function main() {
  console.log('Fushion Marketplace Seed');
  console.log('========================');

  const hash = await bcrypt.hash('Admin@Fushion2026', 10);

  // ── Clean ──
  console.log('Cleaning existing data...');
  await prisma.review.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.address.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.vendorCategory.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.category.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleanup done.');

  // ── 1. Users ──
  console.log('Creating users...');
  await prisma.user.create({
    data: {
      email: 'admin@fushion.dev',
      passwordHash: hash,
      firstName: 'Fushion',
      lastName: 'Admin',
      phone: '+2348000000000',
      role: 'ADMIN',
      emailVerified: true,
    },
  });

  await prisma.user.create({
    data: {
      email: 'buyer@fushion.dev',
      passwordHash: await bcrypt.hash('Buyer@Test2026', 10),
      firstName: 'Test',
      lastName: 'Buyer',
      phone: '+2348000000001',
      role: 'BUYER',
      emailVerified: true,
    },
  });

  console.log('Users created.');

  // ── 2. Categories ──
  console.log('Creating categories...');
  const catMap = new Map<string, string>();

  for (const parent of CATEGORIES) {
    const pc = await prisma.category.create({
      data: { name: parent.name, slug: parent.slug, description: parent.name + ' category', sortOrder: 0 },
    });
    catMap.set(parent.slug, pc.id);

    for (let i = 0; i < parent.children.length; i++) {
      const ch = parent.children[i];
      const cc = await prisma.category.create({
        data: {
          name: ch.name,
          slug: ch.slug,
          description: ch.desc,
          parentId: pc.id,
          sortOrder: (i + 1) * 10,
        },
      });
      catMap.set(ch.slug, cc.id);
    }
  }
  console.log(catMap.size + ' categories created.');

  // ── 3. Vendors ──
  console.log('Creating vendors...');
  const vendorIds: string[] = [];
  const catVendorMap = new Map<string, string[]>();

  for (const vd of VENDOR_DATA) {
    const bank = choose(NIGERIAN_BANKS);
    const vUser = await prisma.user.create({
      data: {
        email: `vendor${vd.index}@fushion.dev`,
        passwordHash: hash,
        firstName: vd.firstName || 'Vendor',
        lastName: vd.lastName || 'User',
        phone: vd.phone || '+2348000000000',
        role: 'VENDOR',
        emailVerified: true,
      },
    });
    const vendor = await prisma.vendor.create({
      data: {
        userId: vUser.id,
        storeName: vd.storeName,
        storeSlug: vd.storeSlug,
        description: vd.desc,
        phone: vd.phone,
        whatsapp: vd.phone,
        status: 'ACTIVE',
        commissionRate: 0.10,
        bankName: bank,
        bankAccountNumber: String(1000000000 + vd.index * 1234567).slice(0, 10),
        bankAccountName: vd.firstName + ' ' + vd.lastName,
        bankCode: '000',
        avgRating: randomBetween(3.5, 5.0),
        totalSales: randInt(10, 5000),
      },
    });
    vendorIds.push(vendor.id);

    for (const cs of vd.categorySlugs) {
      if (!catVendorMap.has(cs)) catVendorMap.set(cs, []);
      catVendorMap.get(cs)!.push(vendor.id);
    }
  }
  console.log(vendorIds.length + ' vendors created.');

  // ── 4. Vendor Categories ──
  console.log('Assigning vendor categories...');
  let vcCount = 0;
  for (const cd of CATEGORIES) {
    const vendors = catVendorMap.get(cd.slug) || [];
    for (const ch of cd.children) {
      const chId = catMap.get(ch.slug);
      if (!chId) continue;
      for (const vid of vendors) {
        await prisma.vendorCategory.upsert({
          where: { vendorId_categoryId: { vendorId: vid, categoryId: chId } },
          update: {},
          create: { vendorId: vid, categoryId: chId },
        });
        vcCount++;
      }
    }
  }
  console.log(vcCount + ' vendor-category links created.');

  // ── 5. Products ──
  console.log('Generating products...');

  let totalProducts = 0;
  const BATCH_SIZE = 100;

  for (const sc of PRODUCT_TEMPLATES) {
    const catId = catMap.get(sc.subcatSlug);
    if (!catId) {
      console.warn('  No category for: ' + sc.subcatSlug);
      continue;
    }

    // Find parent category slug to get vendors
    const parentCat = CATEGORIES.find(c => c.children.some(ch => ch.slug === sc.subcatSlug));
    const availVendors = parentCat ? (catVendorMap.get(parentCat.slug) || vendorIds) : vendorIds;

    for (const tpl of sc.templates) {
      const vkey = getVariantKey(tpl.name);

      if (vkey && VARIANTS[vkey]) {
        const varDef = VARIANTS[vkey];
        const keys = Object.keys(varDef);
        const vals = keys.map(k => varDef[k]);

        const combos = cartesian(vals);
        const batch: any[] = [];

        for (const combo of combos) {
          const vars: Record<string, string> = {};
          keys.forEach((k, i) => { vars[k] = combo[i]; });

          const vendorId = choose(availVendors);
          const prod = genVariantProduct(tpl, vars, catId, vendorId, totalProducts + 1);
          batch.push(prod);
          totalProducts++;

          if (batch.length >= BATCH_SIZE) {
            await prisma.product.createMany({ data: batch });
            batch.length = 0;
          }
        }

        if (batch.length > 0) {
          await prisma.product.createMany({ data: batch });
        }
      } else {
        // Single product
        const vendorId = choose(availVendors);
        const prod = genSingleProduct(tpl, catId, vendorId, totalProducts + 1);
        await prisma.product.create({ data: prod });
        totalProducts++;
      }
    }
  }

  console.log(totalProducts + ' products created.');
  console.log('========================');
  console.log('Seed complete!');
  console.log('  Admin:  admin@fushion.dev / Admin@Fushion2026');
  console.log('  Buyer:  buyer@fushion.dev / Buyer@Test2026');
  console.log('  Vendors: vendor0@fushion.dev ... vendor19@fushion.dev / Admin@Fushion2026');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

