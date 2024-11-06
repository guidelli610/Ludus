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

io.on('connection', (socket) => {
  console.log('Cliente conectado com ID:', socket.id);
  users[socket.id] = { id: socket.id };
  console.log('Total de usuários: ', users);

  const doesRoomExist = (roomName) => {
    return io.sockets.adapter.rooms.has(roomName);
  }

  const selectRoomName = (identity, target) => {
    if (!target || !identity) return null; // Verificação para garantir que o target é válido
    let roomName;
    if (target === "room_global") {
      roomName = `room_global`;
    } else {
      roomName = `room_${identity}_${target}`;
      const roomTest = `room_${target}_${identity}`;
      if (doesRoomExist(roomTest)) {
        roomName = roomTest;
      }
    }
    return roomName;
  }

  // Criar e entrar em uma sala quando um usuário quiser
  // type = tipo da sala ou identificador do propósito
  // identity = você
  // target = alvo
  socket.on('joinRoom', (identity, target, setCurrentRoom) => {
    const roomName = selectRoomName(identity, target);
    setCurrentRoom(`${roomName}`);
    if (roomName && !socket.rooms.has(roomName)) {
      socket.join(roomName);
      console.log(`${identity} entrou na sala: ${roomName}`);
      socket.emit('message', identity, `Você entrou na sala: ${roomName}`);
      socket.to(roomName).emit('message', identity, `${identity} entrou na sala!`, roomName);
    }
  });


  // Sai de uma sala quando um usuário quiser
  // type = tipo da sala ou identificador do propósito
  // identity = você
  // target = alvo
  // setCurrentRoom <- função de salvamento de nome
  socket.on('leaveRoom', (identity, target) => {
    const roomName = selectRoomName(target);
    if (roomName && socket.rooms.has(roomName)) {
      socket.leave(roomName);
      console.log(`${identity} saiu da sala: ${roomName}`);
      socket.emit('message', identity, `Você saiu da sala: ${roomName}`);
      socket.to(roomName).emit('message', identity, `${identity} saiu da sala!`, roomName);
    }
  });

  // O cliente agora está conectado, e você pode escutar eventos desse cliente
  socket.on('message', (identity, message, room) => {
    console.log(`Mensagem recebida de ${identity} na sala ${room}: `, message);
    socket.to(room).emit('message', identity, message, room);
  });

  socket.on('disconnect', () => {
    console.log('Cliente desconectado com ID:', socket.id);
    socket.leaveAll(); // Remove o usuário de todas as salas ao desconectar
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

  const { identity, name, email, password } = req.body;

  const sql = 'CALL create_user(?,?,?,?);';

  connection.query(sql, [identity, name, email, password], (err, results) => {
    if (err) {
      console.error(err.message)
        return res.status(500).json({ message: err.message });
    }
    console.log(`Usuário ${name} criado com sucesso!`)
    res.status(201).json({ message: "Usuário criado com sucesso!" });
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
      const sqlGetIdentityAndName = 'SELECT identity, name FROM users WHERE email = ?';
      const results = await query(sqlGetIdentityAndName, [email]);
      const data = results.length > 0 ? results[0] : null;// Verifica se o name foi encontrado
      const identity = data.identity;
      const name = data.name;

      res.status(200).json({ token: token, identity: identity, name: name, email: email, message: 'Usuário autenticado com sucesso!'});
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

