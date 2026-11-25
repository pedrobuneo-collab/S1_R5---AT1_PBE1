import test from 'node:test';
import assert from 'node:assert/strict';
import app from './server';

async function chamar(callback: (baseUrl: string) => Promise<void>) {
  const servidor = app.listen(0);
  await new Promise<void>((resolve) => servidor.once('listening', resolve));
  const endereco = servidor.address() as { port: number };

  try {
    await callback(`http://127.0.0.1:${endereco.port}`);
  } finally {
    await new Promise<void>((resolve) => servidor.close(() => resolve()));
  }
}

test('mensagem, soma e login', async () => {
  await chamar(async (baseUrl) => {
    const mensagem = await fetch(`${baseUrl}/mensagem`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'Carlos', idade: 18, timeFavorito: 'Real Madrid' })
    });
    assert.equal(mensagem.status, 200);

    const soma = await fetch(`${baseUrl}/soma`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ n1: 10, n2: 15, n3: 5 })
    });
    assert.deepEqual(await soma.json(), { resultado: 30 });

    const login = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: 'admin', senha: '123456' })
    });
    assert.equal(login.status, 200);
  });
});
