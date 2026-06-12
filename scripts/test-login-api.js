const base = 'http://127.0.0.1:3000';

(async () => {
  try {
    const res = await fetch(`${base}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'demo@example.com', password: '123456' }),
    });
    const text = await res.text();
    console.log('status', res.status);
    try {
      console.log(JSON.parse(text));
    } catch {
      console.log(text);
    }
  } catch (error) {
    console.error('request error', error);
  }
})();
