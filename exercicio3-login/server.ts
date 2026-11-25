import express, { ErrorRequestHandler, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
app.use(express.json());

interface Usuario { usuario: string; senha: string; }
interface ArquivoCredenciais { usuarios: Usuario[]; }
interface LoginBody { usuario?: unknown; user?: unknown; senha?: unknown; password?: unknown; }

function lerCredenciais(): Usuario[] {
    const arquivo = path.join(__dirname, 'credenciais.json');
    const dados = JSON.parse(fs.readFileSync(arquivo, 'utf8')) as ArquivoCredenciais;
    return dados.usuarios;
}

app.post('/login', (req: Request<Record<string, never>, unknown, LoginBody>, res: Response) => {
    const body = req.body || {};
    const usuario = body.usuario ?? body.user;
    const senha = body.senha ?? body.password;

    if (!usuario || !senha) {
        return res.status(400).json({ erro: 'Os campos usuario e senha são obrigatórios.' });
    }

    try {
        const usuarios = lerCredenciais();
        const valido = usuarios.some((item) => item.usuario === usuario && item.senha === senha);
        if (!valido) {
            return res.status(401).json({ erro: 'Usuário ou senha inválidos.' });
        }
        return res.status(200).json({ mensagem: 'Login realizado com sucesso.' });
    } catch (erro) {
        console.error('Erro ao ler credenciais:', erro);
        return res.status(500).json({ erro: 'Não foi possível verificar o login.' });
    }
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
    const port = Number(process.env.PORT) || 3003;
    app.listen(port, () => console.log(`Servidor rodando em http://localhost:${port}`));
}

export default app;
