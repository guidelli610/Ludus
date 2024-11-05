import dotenv from 'dotenv';
dotenv.config();
//Configura a variável de ambiente no arquivo '.env'
console.log('JWT Secret:', process.env.JWT_SECRET);

//Instanciamento das bibliotecas, frameworks e API server
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import connection from './db.js';

// -------------------------------------------------[Configuração]--------------------------------------------------- //

const app = express(); // Instanciamento do server
const server = http.createServer(app); // Cria o servidor HTTP com Express

const PORT = process.env.PORT || 3000; // Porta

// Configuração do CORS para o Express
app.use(
  cors({
  origin: 'http://localhost:5173', // Permitir a origem do seu frontend
  methods: ['GET', 'POST'], // Métodos permitidos
  credentials: true, // Permite envio de cookies de autenticação
  })
);

app.use(express.json());// Middleware para analisar JSON

// Configuração do Socket.IO com CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173', // Permitir o frontend
    methods: ['GET', 'POST'],
    credentials: true,
  },
  reconnection: true, // habilita a reconexão automática
  reconnectionAttempts: 10, // define o número de tentativas antes de desistir
  reconnectionDelay: 1000, // tempo de espera entre tentativas de reconexão em ms
});

// -------------------------------------------------[Socket.io]--------------------------------------------------- //

let users = {}; // Objeto para armazenar os usuários conectados
const sala = "sala123";

io.on('connection', (socket) => {
  socket.join(sala);
  console.log('Cliente conectado com ID:', socket.id);
  users[socket.id] = { id: socket.id };
  console.log('Total de usuários: ', users);

  // O cliente agora está conectado, e você pode escutar eventos desse cliente
  socket.on('message', (data) => {
    console.log('Mensagem recebida:', data);
    socket.to(sala).emit('message',data);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado com ID:', socket.id);
    delete users[socket.id]; // Remove o usuário da lista
  });
});

// -------------------------------------------------[Ativadores]--------------------------------------------------- //

// Iniciar o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Middleware de log
app.use((req, res, next) => {
  console.log(`\nTentativa de ${req.url.split('/')[1]}...`);
  next();
});

// -------------------------------------------------[Autenticação]--------------------------------------------------- //

// Middleware de autenticação do Token
const authenticateToken = (req, res, next) => {

  console.log("Rota registrada para autenticação");

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extrai o token do cabeçalho Authorization

  console.log("Autenticando token: ", token);

  if (!token) {
    console.error("Token não fornecido!");
    return res.status(401).json({ message: 'Token não fornecido' }) // Token: indefined
  };

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {

    if (err) {
      console.error("Token inválido ou expirado!");
      return res.status(403).json({ message: 'Token inválido ou expirado' }); // Token: inválido
    }

    console.error("Token validado!");
    req.user = decoded; // Anexa os dados decodificados ao objeto req
    next(); // Passa para a próxima função ou rota
  });
};

// Rotas a serem autenticadas
app.use('/secure', authenticateToken);

// -------------------------------------------------[Teste]--------------------------------------------------- //

// Rota principal (GET)
app.get('/', (req, res) => {
  res.send('Servidor rodando com Express e Socket.IO');
});

// Uso do middleware em uma rota protegida
app.get('/secure', (req, res) => {
  res.json({ message: 'Você tem acesso à rota protegida!', user: req.user });
});

// -------------------------------------------------[Rotas]--------------------------------------------------- //


// -------------------------------------------------[Finalizados]--------------------------------------------------- //

// Rota para cadastro
app.post('/register', (req, res) => {

  const { name, email, password } = req.body;

  const sql = 'CALL create_user(?,?,?);';

  connection.query(sql, [name, email, password], (err, results) => {
    if (err) {
      console.error(err.message)
        return res.status(500).json({ message: err.message });
    }
    console.log(`Usuário ${name} criado com sucesso!`)
    res.status(201).json({ name, email, password, message: "Usuário criado com sucesso!"});
  });
});

// Função auxiliar para fazer uma consulta SQL que retorna uma Promise
const query = (sql, params) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, params, (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

// Rota para login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Validação de entrada
  if (!email || !password) {
    console.error("Email e senha são obrigatórios!");
    return res.status(400).json({ message: 'Email e senha são obrigatórios!' });
  }

  try {
    // Consulta de autenticação
    const sqlAuth = 'SELECT connect(?, ?) AS isAuthenticated;';
    const authResults = await query(sqlAuth, [email, password]);

    // Captura o retorno booleano da função
    const isAuthenticated = authResults[0]?.isAuthenticated === 1;

    if (isAuthenticated) {
      // Criação do token JWT
      const token = jwt.sign({ email, timestamp: Date.now() }, process.env.JWT_SECRET, { expiresIn: '1m' });

      // Obtém o name do usuário
      const sqlGetName = 'SELECT name FROM users WHERE email = ?';
      const nameResults = await query(sqlGetName, [email]);

      // Verifica se o name foi encontrado
      const name = nameResults.length > 0 ? nameResults[0].name : null;

      res.status(200).json({ token: token, name: name, message: 'Usuário autenticado com sucesso!'});
      console.log("Token criado:", token);
    } else {
      console.error("Email ou senha incorretos!");
      return res.status(401).json({ message: 'Email ou senha incorretos!' });
    }
  } catch (error) {
    console.error("Erro no processo de login:", error.message);
    return res.status(500).json({ message: 'Erro no processo de login.' });
  }
});


// -------------------------------------------------[Release]--------------------------------------------------- //

