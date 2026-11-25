import express, { ErrorRequestHandler } from 'express';

const app = express();
app.use(express.json());

app.post('/soma', (req, res) => {
    const body = req.body || {};
    const nomes = [
        ['n1', 'numero1', 'num1', 'a'],
        ['n2', 'numero2', 'num2', 'b'],
        ['n3', 'numero3', 'num3', 'c']
    ];

    const valores = nomes.map((aliases) => {
        const campo = aliases.find((nome) => Object.prototype.hasOwnProperty.call(body, nome));
        return campo ? body[campo] : undefined;
    });

    if (valores.some((valor) => valor === undefined)) {
        return res.status(400).json({ erro: 'Informe três números no body.' });
    }

    if (valores.some((valor) => typeof valor !== 'number' || !Number.isFinite(valor))) {
        return res.status(400).json({ erro: 'n1, n2 e n3 devem ser números.' });
    }

    const [n1, n2, n3] = valores as number[];
    return res.status(200).json({ resultado: n1 + n2 + n3 });
});

app.use((_req, res) => {
    res.status(404).json({ erro: 'Rota não encontrada.' });
});

const errorHandler: ErrorRequestHandler = (erro, _req, res, _next) => {
    if (erro instanceof SyntaxError) {
        res.status(400).json({ erro: 'JSON inválido.' });
        return;
    }
    res.status(500).json({ erro: 'Erro interno do servidor.' });
};
app.use(errorHandler);

if (require.main === module) {
    app.listen(3002, () => console.log('Servidor em http://localhost:3002'));
}

export default app;
