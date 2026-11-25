# Exercícios Express.js com TypeScript

Este repositório contém três projetos independentes, cada um com uma API Express em TypeScript.

## Projetos

### 1. Mensagem

- Porta: `3001`
- Rota: `POST /mensagem`
- Body: `{ "nome": "Carlos", "idade": 18, "timeFavorito": "Real Madrid" }`

```bash
cd exercicio1-mensagem
npm install
npm start
```

### 2. Soma

- Porta: `3002`
- Rota: `POST /soma`
- Body: `{ "n1": 10, "n2": 15, "n3": 5 }`

```bash
cd exercicio2-soma
npm install
npm start
```

### 3. Login

- Porta: `3003`
- Rota: `POST /login`
- Body: `{ "usuario": "admin", "senha": "123456" }`
- Credenciais carregadas de `credenciais.json`

```bash
cd exercicio3-login
npm install
npm start
```

## Testes e compilação

Em cada pasta execute:

```bash
npm test
npm run build
```