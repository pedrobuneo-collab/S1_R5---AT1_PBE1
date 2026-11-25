import express, { ErrorRequestHandler, Request, Response } from 'express';

const app = express();
app.use(express.json());

type SomaBody = Record<string, unknown>;

function lerValores(body: SomaBody): unknown[] {
  const grupos: string[][] = [
    ['n1', 'numero1', 'num1', 'a', 'primeiro'],
    ['n2', 'numero2', 'num2', 'b', 'segundo'],
    ['n3', 'numero3', 'num3', 'c', 'terceiro']
  ];

  return grupos.map((aliases) => {
    const chave = aliases.find((nome) => Object.prototype.hasOwnProperty.call(body, nome));
    return chave ? body[chave] : undefined;
  });
}

app.post('/soma', (req: Request<Record<string, never>, unknown, SomaBody>, res: Response) => {
  const valores = lerValores(req.body || {});
  if (valores.some((valor) => valor === undefined)) {
    return res.status(400).json({ erro: 'Informe três números no body (n1, n2 e n3).' });
  }

  const invalidos = valores
    .map((valor, indice) => ({ valor, indice: indice + 1 }))
    .filter(({ valor }) => typeof valor !== 'number' || !Number.isFinite(valor));

  if (invalidos.length) {
    return res.status(400).json({
      erro: 'Todos os valores devem ser números.',
      camposInvalidos: invalidos.map(({ indice }) => indice)
    });
  }

  const numeros = valores as number[];
  return res.status(200).json({ resultado: numeros[0] + numeros[1] + numeros[2] });
});

app.use((req: Request, res: Response) => res.status(404).json({ erro: 'Rota não encontrada.' }));
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
  const port = Number(process.env.PORT) || 3002;
  app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
}

export default app;
