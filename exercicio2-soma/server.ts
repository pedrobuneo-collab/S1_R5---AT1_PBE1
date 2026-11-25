import express from 'express';

const app = express();
app.use(express.json());

app.post('/soma', (req, res) => {
  const { n1, n2, n3 } = req.body;

  if ([n1, n2, n3].some((valor) => typeof valor !== 'number' || !Number.isFinite(valor))) {
    return res.status(400).json({ erro: 'n1, n2 e n3 devem ser números.' });
  }

  return res.json({ resultado: n1 + n2 + n3 });
});

app.listen(3002, () => console.log('Servidor em http://localhost:3002'));
