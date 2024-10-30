//Instanciamento do server
import express from 'express'
import cors from 'cors'
import connection from './db.js'

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

// Manipulação de Dados
app.post('/register', (req, res) => {
  const { nome, email, senha } = req.body;
  const sql = 'CALL create_player(?,?,?);';
  connection.query(sql, [nome, email, senha], (err, results) => {
    if (err) {
        return res.status(500).json({ error: err.message });
    }
    res.status(201).json({ id: results.insertId, nome, email, senha });
  });
});

// Rota para obter informações de um usuário específico
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT connect(?, ?) AS isAuthenticated;'; // Consulta SQL
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    console.log("Resultados da consulta:", results);

    // Captura o retorno booleano da função
    const isAuthenticated = results[0]?.isAuthenticated === 1; // Ajuste aqui

    console.log(isAuthenticated);
    // Verifica se o usuário está autenticado
    if (isAuthenticated) {
      res.status(200).json({ authentication: true, message: 'Usuário autenticado com sucesso' });
    } else {
      res.status(401).json({ authentication: false, message: 'Credenciais inválidas' });
    }
  });
});

app.delete('/users/:id', (req, res) => {
  res.send(`Usuário ${req.params.id} deletado`);
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});