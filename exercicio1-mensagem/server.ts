import express from 'express';

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

app.listen(3001, () => console.log('Servidor em http://localhost:3001'));
