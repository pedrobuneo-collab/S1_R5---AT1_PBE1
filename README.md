# Exercícios Express.js com TypeScript

Um único servidor Express com três rotas POST.

## Instalação e execução

```bash
npm install
npm start
```

Servidor disponível em `http://localhost:3000`.

## Rotas

### POST `/mensagem`

```json
{
  "nome": "Carlos",
  "idade": 18,
  "timeFavorito": "Real Madrid"
}
```

### POST `/soma`

```json
{
  "n1": 10,
  "n2": 15,
  "n3": 5
}
```

### POST `/login`

```json
{
  "usuario": "admin",
  "senha": "123456"
}
```

As credenciais ficam em `credenciais.json`.

## Testes e compilação

```bash
npm test
npm run build
```