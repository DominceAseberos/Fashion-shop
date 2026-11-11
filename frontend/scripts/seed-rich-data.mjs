import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const assetsDir = path.resolve(__dirname, '../src/assets');

// 1. Authenticate as Super Admin
console.log('Logging in to Strapi Admin...');
const loginRes = await fetch('http://localhost:1337/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@cheq.atelier',
    password: 'AdminCheq2026!'
  })
});

const loginData = await loginRes.json();
const token = loginData.data?.token;
if (!token) {
  console.error('Login failed:', loginData);
  process.exit(1);
}
console.log('Logged in successfully!');

// Helper for authenticated fetch
async function api(endpoint, options = {}) {
  const url = `http://localhost:1337${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
      ...(options.headers || {})
    }
  });
  const data = await res.json().catch(() => null);
  return { status: res.status, ok: res.ok, data };
}

// 2. Upload images to Media Library
console.log('Uploading sample assets to Media Library...');
const imageFiles = [
  { file: 'look-01.jpg', name: 'The Ivory Suit - Editorial' },
  { file: 'look-02.png', name: 'The Onyx Drape - Studio' },
  { file: 'look-03.jpg', name: 'The Oxblood Column - Interior' },
  { file: 'look-04.png', name: 'The Azure Trench - Stone Wall' },
  { file: 'look-05.png', name: 'The Emerald Silk - Chiaroscuro' },
  { file: 'look-06.png', name: 'The Charcoal Knit - Tactile' },
  { file: 'hero-portrait.jpg', name: 'Cheq Hero Portrait' },
  { file: 'atelier-detail.jpg', name: 'Atelier Tailoring Detail' },
  { file: 'journal-stitch.jpg', name: 'Hand-basting Silk Stitch' }
];

const uploadedMedia = {};

for (const img of imageFiles) {
  const filePath = path.join(assetsDir, img.file);
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping ${img.file}, file not found.`);
    continue;
  }

  const fileBytes = fs.readFileSync(filePath);
  const formData = new FormData();
  const blob = new Blob([fileBytes], { type: img.file.endsWith('.png') ? 'image/png' : 'image/jpeg' });
  formData.append('files', blob, img.file);
  formData.append('fileInfo', JSON.stringify({ name: img.name, caption: img.name, alternativeText: img.name }));

  try {
    const uploadRes = await fetch('http://localhost:1337/upload', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });
    const uploadData = await uploadRes.json();
    if (uploadData && uploadData[0]) {
      uploadedMedia[img.file] = uploadData[0];
      console.log(`Uploaded media: ${img.file} (ID: ${uploadData[0].id})`);
    } else {
      console.warn(`Upload response for ${img.file}:`, uploadData);
    }
  } catch (err) {
    console.error(`Error uploading ${img.file}:`, err.message);
  }
}

// 3. Create & Publish Collections
console.log('Seeding Collections...');
const collections = [
  {
    title: 'Autumn / Winter MMXXVI Edit',
    season: 'Autumn / Winter MMXXVI',
    intro: 'The debut collection explores pure sculptural proportion, virgin wools from Biella, and quiet authority.',
  },
  {
    title: 'Nocturne Atelier Capsule',
    season: 'Permanent Evening Capsule',
    intro: 'Form-elongating eveningwear cut on the bias in Como silk charmeuse and garment-dyed faille.',
  }
];

const createdCollections = [];
for (const col of collections) {
  const check = await api(`/content-manager/collection-types/api::collection.collection?filters[title][$eq]=${encodeURIComponent(col.title)}`);
  if (check.data?.results?.length) {
    createdCollections.push(check.data.results[0]);
    console.log(`Collection already exists: ${col.title}`);
  } else {
    const createRes = await api('/content-manager/collection-types/api::collection.collection', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(col)
    });
    const docId = createRes.data?.documentId || createRes.data?.id;
    if (docId) {
      await api(`/content-manager/collection-types/api::collection.collection/${docId}/actions/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      createdCollections.push(createRes.data);
      console.log(`Created & published collection: ${col.title}`);
    }
  }
}

// 4. Attach Media to Existing Garments
console.log('Attaching uploaded images to existing garments...');
const existingGarmentsRes = await api('/content-manager/collection-types/api::garment.garment?pageSize=50');
const existingGarments = existingGarmentsRes.data?.results || [];

const garmentImgMap = {
  'The Ivory Suit': 'look-01.jpg',
  'The Onyx Drape': 'look-02.png',
  'The Oxblood Column': 'look-03.jpg',
  'The Azure Trench': 'look-04.png',
  'The Emerald Silk': 'look-05.png',
  'The Charcoal Knit': 'look-06.png',
};

for (const g of existingGarments) {
  const targetImg = garmentImgMap[g.name];
  if (targetImg && uploadedMedia[targetImg]) {
    const mediaObj = uploadedMedia[targetImg];
    const docId = g.documentId || g.id;
    const updateRes = await api(`/content-manager/collection-types/api::garment.garment/${docId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: mediaObj.id,
        collection: createdCollections[0]?.id || null
      })
    });
    // Publish update
    await api(`/content-manager/collection-types/api::garment.garment/${docId}/actions/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    console.log(`Attached ${targetImg} to ${g.name} and published!`);
  }
}

// 5. Add New Garments (Look VII - Look X)
console.log('Adding additional luxury looks (Look VII - Look X)...');
const newLooks = [
  {
    name: 'The Cashmere Overcoat',
    index: 'VII',
    slug: 'the-cashmere-overcoat',
    subtitle: 'Double-breasted, storm flap silhouette',
    fabric: 'Pure Mongolian cashmere 100%',
    origin: 'Florence, Tuscany',
    edition: '15 garments',
    price: 2850,
    alt: 'Model in an oversized double-breasted camel cashmere overcoat.',
    story: 'Cut from double-woven Mongolian cashmere, this overcoat balances strict military proportion with unstructured, enveloping warmth.',
  },
  {
    name: 'The Pleated Palazzo',
    index: 'VIII',
    slug: 'the-pleated-palazzo',
    subtitle: 'High-waisted, fluid wide-leg trouser',
    fabric: 'Silk & linen faille',
    origin: 'Biella, Piedmont',
    edition: '25 garments',
    price: 1150,
    alt: 'Model in wide-leg high-waisted pleated palazzo trousers in slate grey.',
    story: 'Deep front pleats and a dropped rise give this trouser dramatic kinetic volume with every stride.',
  },
  {
    name: 'The Structured Bustier',
    index: 'IX',
    slug: 'the-structured-bustier',
    subtitle: 'Architectural contour, hidden bone stay',
    fabric: 'Bonded Duchess satin',
    origin: 'Como, Lombardy',
    edition: '18 garments',
    price: 1380,
    alt: 'Close-up detail of a structured architectural black satin bustier.',
    story: 'A sculpted bodice shaped by precision darts and inner corsetry, designed to be worn alone or layered over crisp poplin.',
  },
  {
    name: 'The Merino Turtleneck',
    index: 'X',
    slug: 'the-merino-turtleneck',
    subtitle: 'Seamless fine-gauge knit, raw edge',
    fabric: 'Extra-fine Merino wool',
    origin: 'Perugia, Umbria',
    edition: '40 garments',
    price: 890,
    alt: 'Model wearing an ink-black fine-gauge merino wool turtleneck.',
    story: 'Knitted on specialized 18-gauge machines without side seams, creating an unbroken second-skin silhouette.',
  }
];

for (const look of newLooks) {
  const check = await api(`/content-manager/collection-types/api::garment.garment?filters[name][$eq]=${encodeURIComponent(look.name)}`);
  if (!check.data?.results?.length) {
    const createRes = await api('/content-manager/collection-types/api::garment.garment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...look,
        collection: createdCollections[0]?.id || null
      })
    });
    const docId = createRes.data?.documentId || createRes.data?.id;
    if (docId) {
      await api(`/content-manager/collection-types/api::garment.garment/${docId}/actions/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      console.log(`Created and published: ${look.name} (${look.index})`);
    }
  } else {
    console.log(`Look already exists: ${look.name}`);
  }
}

// 6. Create Editorial Journal Posts
console.log('Seeding Editorial Journal Posts...');
const journalPosts = [
  {
    title: 'The Art of the Basted Fitting',
    slug: 'the-art-of-the-basted-fitting',
    eyebrow: 'ATELIER ARCHIVE',
    intro: 'Why real luxury cannot be rushed: inside the three fittings required for every bespoke silhouette.',
    content: 'Before the final stitch is sewn, cloth must breathe with the body. The basted fitting uses temporary white thread, allowing master tailors to sculpt proportions directly against posture.',
  },
  {
    title: 'Woven in Como: Silk Charmeuse',
    slug: 'woven-in-como-silk-charmeuse',
    eyebrow: 'TEXTILE PROVENANCE',
    intro: 'A journey through the Lombardy mills that have perfected garment-dyed silk for over three centuries.',
    content: 'Como has maintained Europe\'s most revered silk weaving tradition since the Renaissance. Our pure charmeuse is finished on antique shuttle looms that yield unmatched drape and light reflection.',
  }
];

for (const post of journalPosts) {
  const check = await api(`/content-manager/collection-types/api::journal-post.journal-post?filters[slug][$eq]=${post.slug}`);
  if (!check.data?.results?.length) {
    const createRes = await api('/content-manager/collection-types/api::journal-post.journal-post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(post)
    });
    const docId = createRes.data?.documentId || createRes.data?.id;
    if (docId) {
      await api(`/content-manager/collection-types/api::journal-post.journal-post/${docId}/actions/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      console.log(`Created & published journal post: ${post.title}`);
    }
  } else {
    console.log(`Journal post already exists: ${post.title}`);
  }
}

// 7. Seed Real Customer Reservations (Demonstrates E-Commerce Inquiries)
console.log('Seeding Customer Reservations...');
const reservations = [
  {
    customerName: 'Elena Rostova',
    customerEmail: 'elena.rostova@milano.it',
    customerPhone: '+39 02 8392 104',
    garmentName: 'The Ivory Suit',
    status: 'confirmed'
  },
  {
    customerName: 'Marcus Vance',
    customerEmail: 'm.vance@capitalpartners.co.uk',
    customerPhone: '+44 20 7946 0912',
    garmentName: 'The Azure Trench',
    status: 'pending'
  },
  {
    customerName: 'Sophie de Belmont',
    customerEmail: 's.belmont@rivegauche.fr',
    customerPhone: '+33 1 42 68 55 00',
    garmentName: 'The Emerald Silk',
    status: 'allocated'
  }
];

for (const res of reservations) {
  const check = await api(`/content-manager/collection-types/api::reservation.reservation?filters[customerEmail][$eq]=${encodeURIComponent(res.customerEmail)}`);
  if (!check.data?.results?.length) {
    const createRes = await api('/content-manager/collection-types/api::reservation.reservation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(res)
    });
    const docId = createRes.data?.documentId || createRes.data?.id;
    if (docId) {
      await api(`/content-manager/collection-types/api::reservation.reservation/${docId}/actions/publish`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
      console.log(`Created reservation lead for: ${res.customerName} (${res.garmentName})`);
    }
  }
}

console.log('Rich data seeding completed successfully!');
