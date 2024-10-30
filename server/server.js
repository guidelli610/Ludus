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

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: 'Token inválido ou expirado' });

      req.user = decoded; // Anexa os dados decodificados ao objeto req
      next(); // Passa para a próxima função ou rota
  });
};

// Uso do middleware em uma rota protegida
app.get('/rota-protegida', authenticateToken, (req, res) => {
  res.json({ message: 'Você tem acesso à rota protegida!', user: req.user });
});

// Rota para login
app.post('/login', (req, res) => {

  const { email, password } = req.body;

  // Validação de entrada
  if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios!' });
  }

  const sql = 'SELECT connect(?, ?) AS isAuthenticated;'; // Consulta SQL
  connection.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    // Captura o retorno booleano da função
    const isAuthenticated = results[0]?.isAuthenticated === 1;

    console.log("Resultados da consulta:", results);
    console.log(isAuthenticated);
    // Verifica se o usuário está autenticado
    if (isAuthenticated) {
      try {
          console.log('Usuário autenticado, gerando token...');

          const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '60' });

          console.log('Token:', process.env.JWT_SECRET);

          res.status(200).json({ authentication: true, token: token, message: 'Usuário autenticado com sucesso!' });
      } catch (tokenError) {
          console.error('Erro ao gerar o token:', tokenError);
          res.status(500).json({ error: 'Erro ao gerar o token!' });
      }
    } 
    else {
        res.status(401).json({ authentication: false, message: 'Credenciais inválidas!' });
    }
  });
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});