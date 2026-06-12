const base = 'http://127.0.0.1:3000';
const endpoints = [
  '/api/categories',
  '/api/categories?type=subcategories',
  '/api/companies',
  '/api/companies?type=verified',
  '/api/jobs',
  '/api/jobs?type=hot',
  '/api/jobs?type=latest',
  '/api/locations',
  '/api/locations?type=cities',
  '/api/users',
  '/api/captcha'
];

async function fetchJson(path) {
  const resp = await fetch(base + path);
  const text = await resp.text();
  let json = null;
  try { json = JSON.parse(text); } catch (e) { json = text; }
  return { status: resp.status, body: json, path };
}

(async () => {
  console.log('Testing base API endpoints...');
  const results = [];
  for (const path of endpoints) {
    try {
      const res = await fetchJson(path);
      results.push(res);
      console.log(`${path} -> ${res.status}`);
    } catch (error) {
      console.error(`${path} -> ERROR`, error.message);
    }
  }

  const companies = results.find(r => r.path === '/api/companies')?.body?.data || [];
  const jobs = results.find(r => r.path === '/api/jobs')?.body?.data || [];
  const users = results.find(r => r.path === '/api/users')?.body?.data || [];
  const categories = results.find(r => r.path === '/api/categories')?.body?.data || [];
  const locations = results.find(r => r.path === '/api/locations')?.body?.data || [];

  const detailTests = [];
  if (companies.length) detailTests.push(`/api/companies/${companies[0].id}`);
  if (jobs.length) detailTests.push(`/api/jobs/${jobs[0].id}`);
  if (users.length) detailTests.push(`/api/users/${users[0].id}`);
  if (locations.length) {
    detailTests.push(`/api/locations?stateCode=${encodeURIComponent(locations[0].stateCode)}`);
  }
  if (categories.length) {
    detailTests.push(`/api/categories?slug=${encodeURIComponent(categories[0].slug)}`);
  }

  for (const path of detailTests) {
    try {
      const res = await fetchJson(path);
      console.log(`${path} -> ${res.status}`);
    } catch (error) {
      console.error(`${path} -> ERROR`, error.message);
    }
  }

  console.log('Captcha POST test...');
  try {
    const cap = await fetchJson('/api/captcha');
    console.log(`/api/captcha GET -> ${cap.status}`);
    if (cap.body?.captchaId && cap.body?.captchaCode) {
      const resp = await fetch(base + '/api/captcha', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ captchaId: cap.body.captchaId, captchaCode: cap.body.captchaCode })
      });
      const body = await resp.json();
      console.log(`/api/captcha POST -> ${resp.status}, success=${body.success}`);
    } else {
      console.log('/api/captcha GET response missing captchaId/code');
    }
  } catch (error) {
    console.error('/api/captcha POST -> ERROR', error.message);
  }
})();
