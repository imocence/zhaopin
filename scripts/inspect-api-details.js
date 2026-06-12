const base = 'http://127.0.0.1:3000';
async function check(path) {
  try {
    const res = await fetch(base + path);
    const text = await res.text();
    console.log(path, res.status, text.slice(0, 400));
  } catch (err) {
    console.error(path, 'ERROR', err.message);
  }
}
(async () => {
  await check('/api/companies/company10');
  await check('/api/users/user2');
  await check('/api/jobs/job1');
})();
