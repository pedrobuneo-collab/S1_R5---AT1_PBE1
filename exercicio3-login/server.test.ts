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

test('POST /login aceita credenciais válidas', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'admin', senha: '123456' })
    });
    assert.equal(response.status, 200);
  });
});

test('POST /login rejeita credenciais inválidas', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/login`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'admin', senha: 'errada' })
    });
    assert.equal(response.status, 401);
    assert.deepEqual(await response.json(), { erro: 'Usuário ou senha inválidos.' });
  });
});
