import test from 'node:test';
import assert from 'node:assert/strict';
import app from './server';

async function executarTeste(callback: (baseUrl: string) => Promise<void>) {
  const servidor = app.listen(0);
  await new Promise<void>((resolve) => servidor.once('listening', resolve));
  const endereco = servidor.address() as { port: number };

  try {
    await callback(`http://127.0.0.1:${endereco.port}`);
  } finally {
    await new Promise<void>((resolve) => servidor.close(() => resolve()));
  }
}

test('POST /soma retorna o resultado', async () => {
  await executarTeste(async (baseUrl) => {
    const resposta = await fetch(`${baseUrl}/soma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: 10, n2: 15, n3: 5 })
    });

    assert.equal(resposta.status, 200);
    assert.deepEqual(await resposta.json(), { resultado: 30 });
  });
});

test('POST /soma rejeita texto', async () => {
  await executarTeste(async (baseUrl) => {
    const resposta = await fetch(`${baseUrl}/soma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: 10, n2: 'quinze', n3: 5 })
    });

    assert.equal(resposta.status, 400);
  });
});
