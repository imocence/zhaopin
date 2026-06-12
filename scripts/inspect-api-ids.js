const base = 'http://127.0.0.1:3000';
const names = ['categories','companies','jobs','users'];
(async () => {
  for (const name of names) {
    const res = await fetch(`${base}/api/${name}`);
    const json = await res.json();
    console.log(name, 'status', res.status, 'count', json.data?.length);
    console.log(JSON.stringify((json.data||[]).slice(0,2).map(item => item.id || item.slug || item.stateCode), null,2));
  }
})();
