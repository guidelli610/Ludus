import { Chess } from "chess.js"

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

let rooms = {};

io.on('connection', (socket) => {
  socket.identity = null;
  socket.type = null;
  socket.target = null;
  socket.currentRoom = null;
  
  console.log('Cliente conectado com ID:', socket.id);

  // _________________________________________[Functions]_________________________________________ //
  
  /*
  types:
  c = contacts
  g = groups
  d = definite
  */
  const selectRoomName = (type, target) => {
    if (!target || !socket.identity) return null;
    let roomName;
    if (type === 'd') {
      roomName = target;
    } else {
      roomName = `room_${type}_${socket.identity}_${target}`;
      const roomTest = `room_${type}_${target}_${socket.identity}`;
      if (doesRoomExist(roomTest)) {
        roomName = roomTest;
      }
    }
    return roomName;
  }
  
  const emitRoom = () => {
    const publicRooms = [];
    const privateRooms = [];
  
    for (const key in rooms) {
      if (rooms.hasOwnProperty(key) && rooms[key].type === 'g') {
        if (rooms[key].password === '') {
          console.log(key);
          publicRooms.push({ key: key, name: rooms[key].name });
        } else {
          privateRooms.push({ key: key, name: rooms[key].name });
        }
      }
    }
  
    io.emit('roomList', publicRooms, privateRooms); 
  };

  const logOutRoom = () => {
    if (socket.currentRoom) {
      const roomData = rooms[socket.currentRoom];
      if (roomData && roomData.users) {
        roomData.users = roomData.users.filter(user => user !== socket.identity);
        console.log(`${socket.identity} removido da sala ${socket.currentRoom}`);
  
        if (roomData.users.length === 0) {
          console.log(`A sala ${socket.currentRoom} foi deletada`);
          delete rooms[socket.currentRoom];
        }
      } else {
        console.warn(`Tentativa de remover usuário de sala inexistente ou sem usuários: ${socket.currentRoom}`);
      }
    }
    emitRoom();
  };

  const doesRoomExist = (roomName) => {
    return io.sockets.adapter.rooms.has(roomName);
  }

  // _________________________________________[Mensagem]_________________________________________ //

  socket.on('roomList', () => {
    emitRoom();
  });

  // Define o `identity` quando o cliente fornece esse dado
  socket.on('setIdentity', (identity) => {
    socket.identity = identity; // Salva o `identity` diretamente no socket
    console.log(`Usuário definido como ${identity} com ID: ${socket.id}`);
  });

  const createRoom = (roomName, type, target, password) => {
    // Criando a sala

    leaveRoom();
    socket.currentRoom = roomName;

    rooms[socket.currentRoom] = { name: target, type: type, password: password, users: [], game: {} };
    socket.join(socket.currentRoom);
    rooms[socket.currentRoom].users.push(socket.identity);
    console.log(`${socket.identity} criou a sala: ${socket.currentRoom}`);
    socket.emit('message', socket.identity, `Você criou e entrou na sala: ${socket.currentRoom}`);
    socket.emit('sucess', true);
    socket.emit('uptadeRoom', 1);
    emitRoom();
  }

  const joinRoom = (roomName) => {
    // Entrando na sala

    leaveRoom();
    socket.currentRoom = roomName;

    socket.join(socket.currentRoom);
    rooms[socket.currentRoom].users.push(socket.identity);
    console.log(`${socket.identity} entrou na sala: ${socket.currentRoom}`);
    socket.emit('message', socket.identity, `Você entrou na sala: ${socket.currentRoom}`);
    socket.to(socket.currentRoom).emit('message', socket.identity, `${socket.identity} entrou na sala!`);
    socket.emit('sucess', true);
    socket.to(socket.currentRoom).emit('uptadeRoom', rooms[socket.currentRoom].users.length);
    emitRoom();
  }

  // Criar e entrar em uma sala quando um usuário quiser
  socket.on('create&joinRoom', (type, target, password = '') => {
    if (!socket.identity) {return;}

    const roomName = selectRoomName(type, target);

    if (doesRoomExist(roomName)) {
      socket.type = type;
      socket.target = target;

      if (!socket.rooms.has(roomName) && rooms[roomName].password == password){
        joinRoom(roomName);
      } else {
        socket.emit('sucess', false)
      }
    }
    else {
      createRoom(roomName, type, target, password);
    }

    console.log("Rooms: ", rooms);
  });

  // Criar e entrar em uma sala quando um usuário quiser
  socket.on('createRoom', (type, target, password = '') => {
    if (!socket.identity) {return;}

    const roomName = selectRoomName(type, target);

    if (!doesRoomExist(roomName)) {
      createRoom(roomName, type, target, password);
    } else {
      socket.emit('sucess', false, "Essa sala já existe!")
    }

    console.log("Rooms: ", rooms);
  });

  // Criar e entrar em uma sala quando um usuário quiser
  socket.on('joinRoom', (type, target, password = '') => {
    if (!socket.identity) {return;}

    const roomName = selectRoomName(type, target);
    if (doesRoomExist(roomName)) {
      socket.type = type;
      socket.target = target;

      if (!socket.rooms.has(roomName)){
        if (rooms[roomName].password == password) {
          joinRoom(roomName);
        } else {
          socket.emit('sucess', false, "Senha incorreta!")
        }
      }
      else {
        socket.emit('sucess', true, "Você já esta na sala!")
      }
    } else {
      socket.emit('sucess', false, "Sala não existe!")
    }

    console.log("Rooms: ", rooms);
  });

  const leaveRoom = () => {
    if (socket.currentRoom != null){
      if (!doesRoomExist(socket.currentRoom)){
        rooms[socket.currentRoom];
      }
      
      if (socket.currentRoom && socket.rooms.has(socket.currentRoom)) {

        logOutRoom();

        socket.leave(socket.currentRoom);
  
        console.log(`${socket.identity} saiu da sala: ${socket.currentRoom}`);
        socket.emit('message', socket.identity, `Você saiu da sala: ${socket.currentRoom}`);
        socket.to(socket.currentRoom).emit('message', socket.identity, `${socket.identity} saiu da sala!`);
      }
    }
  }

  // Sai de uma sala quando um usuário quiser
  socket.on('leaveRoom', () => {
    leaveRoom();
  });

  // Envio de mensagens
  socket.on('message', (message) => {
    console.log(`Mensagem recebida de ${socket.identity} na sala ${socket.currentRoom}: `, message);
    
    // Verifica se o socket está na sala antes de retransmitir a mensagem
    if (socket.rooms.has(socket.currentRoom)) {
      socket.emit('message', socket.identity, message);
      socket.to(socket.currentRoom).emit('message', socket.identity, message);
    } else {
      console.log(`Cliente ${socket.id} tentou enviar uma mensagem para uma sala em que não está: ${socket.currentRoom}`);
    }
  });

  // Desconexão
  socket.on('disconnect', () => {
    console.log('Cliente desconectado com ID:', socket.id);
    logOutRoom();
    socket.leaveAll(); // Sai de todas as salas ao desconectar
  });

  // _________________________________________[Teste]_________________________________________ //

  // Obter IDs de sockets de uma sala a qualquer momento
  socket.on("getRoomUsers", () => {
    console.log("getRoomUsers");
    const roomSockets = io.sockets.adapter.rooms.get(socket.currentRoom);
    if (roomSockets) {
        console.log(`Usuários na sala ${socket.currentRoom}:`, [...roomSockets]);
    } else {
        console.log(`Sala ${socket.currentRoom} não existe ou não há usuários.`);
    }
  });

  // _________________________________________[Xadrez]_________________________________________ //

  socket.on('startMatch', () => {
    if (rooms[socket.currentRoom] && rooms[socket.currentRoom]?.users.length > 1) {

      const isWhite = Math.random() < 0.5; // Determina aleatoriamente quem começa com branco
      const whitePlayer = isWhite ? rooms[socket.currentRoom]?.users[0] : rooms[socket.currentRoom]?.users[1];
      const blackPlayer = isWhite ? rooms[socket.currentRoom]?.users[1] : rooms[socket.currentRoom]?.users[0];

      rooms[socket.currentRoom].game = { white: whitePlayer, black: blackPlayer, turn: whitePlayer, chess: new Chess() };
      socket.emit('updateGame', whitePlayer, blackPlayer, whitePlayer);
      socket.to(socket.currentRoom).emit('updateGame', whitePlayer, blackPlayer, whitePlayer);
    }
  });

  socket.on('requestUpdateGame', () => {
    const game = rooms[socket.currentRoom].game;
    socket.emit('updateGame', game.white, game.black, game.turn);
  })

  socket.on('endMatch', () => {
    if (rooms[socket.currentRoom]) {
      delete rooms[socket.currentRoom].game;
    }
  });

  socket.on('move', (from, to, newBoard) => {
    const game = rooms[socket.currentRoom]?.game;
    console.log("move!", game);

    if (game && game?.turn == socket.identity) {
      try {
        game.chess.move({from: from, to: to});
        game.turn = game.turn == game.white ? game.black : game.white;
        socket.emit('message', "system", `Você terminou sua jogada, vez de ${socket.identity}!`, from, to);
        socket.to(socket.currentRoom).emit('message', "system", `${socket.identity} terminou sua jogada, vez de ${game.turn}!`, from, to);
        socket.emit('updateGame', game.white, game.black, game.turn);
        socket.to(socket.currentRoom).emit('updateGame', game.white, game.black, game.turn);
        socket.emit('updateBoard', newBoard);
        socket.to(socket.currentRoom).emit('updateBoard', newBoard);
      } catch(e) {
        socket.emit('sucess', "system", e.message);
      }
    }
  });

  socket.on('game-finished', (roomName) => {
    //{ name: roomName, password: password, users: [], game: {} };
    const { name, date, password, users, game } = rooms[roomName];

    const dateStartTimestamp = data.dateStart; // Timestamp de início
    const dateEndTimestamp = Math.floor(Date.now() / 1000); // Timestamp de fim

    connection.execute(
      'INSERT INTO games (player_white_id, player_black_id, date_start, date_end, result, winner_id, moves, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.playerWhiteId, data.playerBlackId, dateStartTimestamp, dateEndTimestamp, result, winnerId, moves, 'finished'],
      (err, result) => {
        if (err) {
          console.error('Erro ao salvar o jogo:', err);
        } else {
          console.log('Jogo salvo com sucesso!');
        }
      }
    );
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
