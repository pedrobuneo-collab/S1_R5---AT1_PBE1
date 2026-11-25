import express, { ErrorRequestHandler, Request, Response } from 'express';

const app = express();
app.use(express.json());

interface MensagemBody {
  nome?: unknown;
  idade?: unknown;
  timeFavorito?: unknown;
}

app.post('/mensagem', (req: Request<Record<string, never>, unknown, MensagemBody>, res: Response) => {
  const { nome, idade, timeFavorito } = req.body;

  if (!nome || idade === undefined || !timeFavorito) {
    return res.status(400).json({ erro: 'Campos obrigatórios: nome, idade e timeFavorito.' });
  }

  if (typeof nome !== 'string' || typeof timeFavorito !== 'string') {
    return res.status(400).json({ erro: 'nome e timeFavorito devem ser textos.' });
  }

  const idadeNumero = Number(idade);
  if (!Number.isFinite(idadeNumero) || idadeNumero < 0) {
    return res.status(400).json({ erro: 'idade deve ser um número válido.' });
  }

  const frase = `Olá, ${nome}! Você tem ${idade} anos e torce para o ${timeFavorito}!`;
  return res.status(200).json({ mensagem: frase });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && 'body' in err) {
    res.status(400).json({ erro: 'Corpo da requisição deve conter um JSON válido.' });
    return;
  }
  console.error(err);
  res.status(500).json({ erro: 'Erro interno do servidor.' });
};
app.use(errorHandler);

if (require.main === module) {
  const port = Number(process.env.PORT) || 3001;
  app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
}

export default app;
