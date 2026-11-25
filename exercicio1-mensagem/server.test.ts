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

test('POST /mensagem retorna a frase esperada', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/mensagem`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Carlos', idade: 18, timeFavorito: 'Real Madrid' })
    });
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { mensagem: 'Olá, Carlos! Você tem 18 anos e torce para o Real Madrid!' });
  });
});

test('POST /mensagem informa campos ausentes', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/mensagem`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}'
    });
    assert.equal(response.status, 400);
  });
});
