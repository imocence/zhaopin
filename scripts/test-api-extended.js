const base = 'http://127.0.0.1:3000';
const fetchJson = async (path, opts = {}) => {
  const resp = await fetch(base + path, opts);
  const text = await resp.text();
  let body = null;
  try {
    body = JSON.parse(text);
  } catch {
    body = text;
  }
  return { path, status: resp.status, body };
};

const isObject = (value) => typeof value === 'object' && value !== null && !Array.isArray(value);
const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message);
  }
};

const validateArrayResponse = (response) => {
  assert(response.status === 200, `${response.path} should return 200`);
  assert(isObject(response.body), `${response.path} should return JSON object`);
  assert(Array.isArray(response.body.data), `${response.path} should include data array`);
};

const validateObjectResponse = (response) => {
  assert(response.status === 200, `${response.path} should return 200`);
  assert(isObject(response.body), `${response.path} should return JSON object`);
  assert(isObject(response.body.data), `${response.path} should include data object`);
};

const validateStringArrayResponse = (response) => {
  assert(response.status === 200, `${response.path} should return 200`);
  assert(isObject(response.body), `${response.path} should return JSON object`);
  assert(Array.isArray(response.body.data), `${response.path} should include data array`);
  response.body.data.forEach((item, idx) => {
    assert(typeof item === 'string', `${response.path} data[${idx}] should be a string`);
  });
};

const validatePaginationResponse = (response) => {
  assert(response.status === 200, `${response.path} should return 200`);
  assert(isObject(response.body), `${response.path} should return JSON object`);
  assert(Array.isArray(response.body.data), `${response.path} should include data array`);
  assert(isObject(response.body.pagination), `${response.path} should include pagination object`);
  assert(typeof response.body.pagination.page === 'number', `${response.path} pagination.page should be number`);
  assert(typeof response.body.pagination.pageSize === 'number', `${response.path} pagination.pageSize should be number`);
};

const validateEntity = (entity, requiredFields, path) => {
  requiredFields.forEach((field) => {
    assert(field in entity, `${path} data item missing ${field}`);
  });
};

const logResult = (path, status, message) => {
  console.log(`${path} -> ${status}${message ? ' (' + message + ')' : ''}`);
};

(async () => {
  console.log('Starting strong API validation...');
  const baseTests = [
    { path: '/api/categories', type: 'categories' },
    { path: '/api/categories?type=subcategories', type: 'stringArray' },
    { path: '/api/companies', type: 'companies' },
    { path: '/api/companies?type=verified', type: 'companies' },
    { path: '/api/jobs', type: 'jobs' },
    { path: '/api/jobs?type=hot', type: 'jobs' },
    { path: '/api/jobs?type=latest', type: 'jobs' },
    { path: '/api/locations', type: 'locations' },
    { path: '/api/locations?type=cities', type: 'stringArray' },
    { path: '/api/users', type: 'users' },
    { path: '/api/captcha', type: 'captcha' },
  ];

  const results = [];
  for (const test of baseTests) {
    try {
      const res = await fetchJson(test.path);
      switch (test.type) {
        case 'categories':
          validateArrayResponse(res);
          if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'name', 'slug'], test.path);
          break;
        case 'companies':
          validateArrayResponse(res);
          if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'name', 'email'], test.path);
          break;
        case 'jobs':
          validateArrayResponse(res);
          if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'title', 'companyId'], test.path);
          break;
        case 'locations':
          validateArrayResponse(res);
          if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'name', 'stateCode'], test.path);
          break;
        case 'users':
          validateArrayResponse(res);
          if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'email', 'role'], test.path);
          break;
        case 'stringArray':
          validateStringArrayResponse(res);
          break;
        case 'captcha':
          assert(res.status === 200, `${test.path} should return 200`);
          assert(isObject(res.body), `${test.path} should return JSON object`);
          assert(typeof res.body.captchaId === 'string', `${test.path} response should include captchaId`);
          assert(typeof res.body.captchaCode === 'string', `${test.path} response should include captchaCode`);
          break;
      }
      results.push(res);
      logResult(test.path, res.status);
    } catch (error) {
      console.error(`${test.path} -> FAILED`, error.message);
      process.exit(1);
    }
  }

  const companies = results.find((r) => r.path === '/api/companies')?.body?.data || [];
  const jobs = results.find((r) => r.path === '/api/jobs')?.body?.data || [];
  const users = results.find((r) => r.path === '/api/users')?.body?.data || [];
  const locations = results.find((r) => r.path === '/api/locations')?.body?.data || [];
  const categories = results.find((r) => r.path === '/api/categories')?.body?.data || [];

  const detailTests = [];
  if (companies.length) detailTests.push({ path: `/api/companies/${companies[0].id}`, type: 'company' });
  if (jobs.length) detailTests.push({ path: `/api/jobs/${jobs[0].id}`, type: 'job' });
  if (users.length) detailTests.push({ path: `/api/users/${users[0].id}`, type: 'user' });
  if (categories.length) detailTests.push({ path: `/api/categories?slug=${encodeURIComponent(categories[0].slug)}`, type: 'category' });
  if (locations.length) detailTests.push({ path: `/api/locations?stateCode=${encodeURIComponent(locations[0].stateCode)}`, type: 'location' });
  if (companies.length) detailTests.push({ path: `/api/jobs?companyId=${encodeURIComponent(companies[0].id)}`, type: 'jobs' });
  if (users.length) detailTests.push({ path: `/api/users?email=${encodeURIComponent(users[0].email)}`, type: 'userQuery' });

  for (const test of detailTests) {
    try {
      const res = await fetchJson(test.path);
      switch (test.type) {
        case 'company':
          validateObjectResponse(res);
          validateEntity(res.body.data, ['id', 'name', 'email'], test.path);
          break;
        case 'job':
          validateObjectResponse(res);
          validateEntity(res.body.data, ['id', 'title', 'companyId'], test.path);
          break;
        case 'user':
          validateObjectResponse(res);
          validateEntity(res.body.data, ['id', 'email', 'role'], test.path);
          break;
        case 'category':
          validateObjectResponse(res);
          validateEntity(res.body.data, ['id', 'name', 'slug'], test.path);
          break;
        case 'location':
          validateObjectResponse(res);
          validateEntity(res.body.data, ['id', 'name', 'stateCode'], test.path);
          break;
        case 'jobs':
          validateArrayResponse(res);
          if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'title', 'companyId'], test.path);
          break;
        case 'userQuery':
          validateObjectResponse(res);
          validateEntity(res.body.data, ['id', 'email', 'role'], test.path);
          break;
      }
      logResult(test.path, res.status);
    } catch (error) {
      console.error(`${test.path} -> FAILED`, error.message);
      process.exit(1);
    }
  }

  const searchTest = { path: '/api/jobs?keyword=engineer', type: 'search' };
  try {
    const res = await fetchJson(searchTest.path);
    validatePaginationResponse(res);
    if (res.body.data.length > 0) validateEntity(res.body.data[0], ['id', 'title', 'companyId'], searchTest.path);
    logResult(searchTest.path, res.status);
  } catch (error) {
    console.error(`${searchTest.path} -> FAILED`, error.message);
    process.exit(1);
  }

  console.log('Captcha POST validation...');
  try {
    const cap = await fetchJson('/api/captcha');
    assert(cap.status === 200, '/api/captcha GET should return 200');
    assert(typeof cap.body.captchaId === 'string', '/api/captcha GET should include captchaId');
    assert(typeof cap.body.captchaCode === 'string', '/api/captcha GET should include captchaCode');
    const resp = await fetch(base + '/api/captcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captchaId: cap.body.captchaId, captchaCode: cap.body.captchaCode }),
    });
    const body = await resp.json();
    assert(resp.status === 200, '/api/captcha POST should return 200');
    assert(body.success === true, '/api/captcha POST should return success true');
    logResult('/api/captcha POST', resp.status);
  } catch (error) {
    console.error('/api/captcha POST -> FAILED', error.message);
    process.exit(1);
  }

  console.log('All strong validation tests passed.');
})();
