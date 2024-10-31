import dotenv from 'dotenv';
dotenv.config();
//Configura a variável de ambiente no arquivo '.env'

console.log('JWT Secret:', process.env.JWT_SECRET);

//Instanciamento das bibliotecas, frameworks e API server
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connection from './db.js';

const app = express(); // Instanciamento do server
const port = 3000; // Porta

app.use(cors());

// Middleware para analisar JSON
app.use(express.json());

// -------------------------------------------------[Autenticação]--------------------------------------------------- //

// Middleware de autenticação do Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

  console.log("Token sendo autenticado: ", token);

  if (!token) return res.status(401).json({ message: 'Token não fornecido' }); // Token: indefined

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

    console.log(" Decoded: ", decoded);
    console.log(" Erro: ", err);

    if (err) return res.status(403).json({ message: 'Token inválido ou expirado' }); // Token: inválido
    req.user = decoded; // Anexa os dados decodificados ao objeto req
    next(); // Passa para a próxima função ou rota
  });
};

// Rotas a serem autenticadas
app.use('/rota-protegida', authenticateToken);

// -------------------------------------------------[Teste]--------------------------------------------------- //

// Uso do middleware em uma rota protegida
app.get('/rota-protegida', (req, res) => {
  res.json({ message: 'Você tem acesso à rota protegida!', user: req.user });
});

// -------------------------------------------------[Ativadores]--------------------------------------------------- //

// Middleware de log
app.use((req, res, next) => {
  console.log(`Requisição para "${req.url}"`);
  next();
});

// Iniciar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

// -------------------------------------------------[Rotas]--------------------------------------------------- //

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
        return res.status(500).json({ message: err.message });
    }
    res.status(201).json({ nome, email, senha, message: "Usuário criado com sucesso!"});
  });
});


// -------------------------------------------------[Finalizados]--------------------------------------------------- //

// Rota para login
app.post('/login', (req, res) => {

  const { email, password } = req.body;

  // Validação de entrada
  if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }

  const sql = 'SELECT connect(?, ?) AS isAuthenticated;'; // Consulta SQL
  connection.query(sql, [email, password], (err, results) => {

    // Erro do banco de dados
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    // Captura o retorno booleano da função
    const isAuthenticated = results[0]?.isAuthenticated === 1;

    // Verifica se o usuário está autenticado
    if (isAuthenticated) {
      try {
          const token = jwt.sign({ email, timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: '1m' });
          res.status(200).json({ token: token, message: 'Usuário autenticado com sucesso!' });
      } catch (tokenError) {
          res.status(500).json({ message: 'Erro ao gerar o token!' });
      }
    } 
    else {
        res.status(401).json({ message: 'Email ou senha incorretos!' });
    }
  });
});