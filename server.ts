import express, { ErrorRequestHandler } from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

app.post('/mensagem', (req, res) => {
  const { nome, idade, timeFavorito } = req.body;

  if (!nome || idade === undefined || !timeFavorito) {
    return res.status(400).json({ erro: 'Informe nome, idade e timeFavorito.' });
  }

  return res.json({
    mensagem: `Olá, ${nome}! Você tem ${idade} anos e torce para o ${timeFavorito}!`
  });
});

app.post('/soma', (req, res) => {
  const { n1, n2, n3 } = req.body;

  if ([n1, n2, n3].some((valor) => typeof valor !== 'number' || !Number.isFinite(valor))) {
    return res.status(400).json({ erro: 'n1, n2 e n3 devem ser números.' });
  }

  return res.json({ resultado: n1 + n2 + n3 });
});

app.post('/login', (req, res) => {
  try {
    const { usuario, senha } = req.body;
    const dados = JSON.parse(fs.readFileSync('./credenciais.json', 'utf8'));
    const valido = dados.usuarios.some((item: { usuario: string; senha: string }) =>
      item.usuario === usuario && item.senha === senha
    );

    if (!valido) {
      return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
    }

    return res.json({ mensagem: 'Login realizado com sucesso.' });
  } catch {
    return res.status(500).json({ erro: 'Não foi possível verificar o login.' });
  }
});

const errorHandler: ErrorRequestHandler = (erro, req, res, next) => {
  if (erro instanceof SyntaxError) {
    res.status(400).json({ erro: 'JSON inválido.' });
    return;
  }
  res.status(500).json({ erro: 'Erro interno do servidor.' });
};
app.use(errorHandler);

if (require.main === module) {
  app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
  });
}

export default app;
