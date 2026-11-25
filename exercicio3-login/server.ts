import express from 'express';
import fs from 'fs';

const app = express();
app.use(express.json());

app.post('/login', (req, res) => {
  const { usuario, senha } = req.body;

  try {
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

app.listen(3003, () => console.log('Servidor em http://localhost:3003'));
