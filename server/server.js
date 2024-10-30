import dotenv from 'dotenv';
dotenv.config();

console.log('Current Working Directory:', process.cwd()); // Verifica o diretório atual
console.log('JWT Secret:', process.env.JWT_SECRET);

//Instanciamento do server
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connection from './db.js';

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

// Rota para cadastro
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

// Rota para login
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT connect(?, ?) AS isAuthenticated;'; // Consulta SQL
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    // Captura o retorno booleano da função
    const isAuthenticated = results[0]?.isAuthenticated === 1;
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    console.log("Resultados da consulta:", results);
    console.log('Token:', process.env.JWT_SECRET);
    console.log(isAuthenticated);
    // Verifica se o usuário está autenticado
    if (isAuthenticated) {
      res.status(200).json({ authentication: true, token: token, message: 'Usuário autenticado com sucesso' });
    } else {
      res.status(401).json({ authentication: false, message: 'Credenciais inválidas' });
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});