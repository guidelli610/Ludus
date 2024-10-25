const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const port = 3000;

// Middleware para analisar JSON
app.use(express.json());

// Middleware de log
app.use((req, res, next) => {
  console.log(`Requisição para ${req.url}`);
  next();
});

// Rota principal (GET)
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/sobre', (req, res) => {
  res.send('Página sobre');
});

app.get('/contato', (req, res) => {
  res.send('Página de contato');
});

// Manipulação de Usuários
app.post('/users', (req, res) => {
  res.send('Usuário criado');
});

app.put('/users/:id', (req, res) => {
  res.send(`Usuário ${req.params.id} atualizado`);
});

app.delete('/users/:id', (req, res) => {
  res.send(`Usuário ${req.params.id} deletado`);
});

// Manipulação de Dados
app.post('/dados', (req, res) => {
  const { nome, idade } = req.body;
  res.json({ message: `Nome: ${nome}, Idade: ${idade}` });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});