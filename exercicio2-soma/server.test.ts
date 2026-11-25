import test from 'node:test';
import assert from 'node:assert/strict';
import app from './server';

async function withServer(callback: (baseUrl: string) => Promise<void>) {
  const server = app.listen(0);
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const baseUrl = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
  try { await callback(baseUrl); }
  finally { await new Promise<void>((resolve) => server.close(() => resolve())); }
}

test('POST /soma retorna a soma', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/soma`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: 10, n2: 15, n3: 5 })
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { resultado: 30 });
  });
});

test('POST /soma rejeita valor não numérico', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/soma`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: 10, n2: 'quinze', n3: 5 })
    });
    assert.equal(response.status, 400);
  });
});
