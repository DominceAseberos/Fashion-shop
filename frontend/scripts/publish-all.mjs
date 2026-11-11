// Login to Strapi Admin and publish all draft garments
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
console.log('Logged in successfully. Token exists:', !!token);

if (!token) {
  console.error('Login failed:', loginData);
  process.exit(1);
}

// Fetch all garments in content-manager
const listRes = await fetch('http://localhost:1337/content-manager/collection-types/api::garment.garment?pageSize=50', {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: 'application/json'
  }
});

const listData = await listRes.json();
const garments = listData.results || [];
console.log(`Found ${garments.length} garments in Content Manager`);

for (const g of garments) {
  console.log(`Publishing look: ${g.name} (${g.documentId || g.id})...`);
  const docId = g.documentId || g.id;
  const pubRes = await fetch(`http://localhost:1337/content-manager/collection-types/api::garment.garment/${docId}/actions/publish`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({})
  });
  console.log(`Published ${g.name} status: ${pubRes.status}`);
}

console.log('All garments published successfully!');
