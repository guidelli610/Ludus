//node server.cjs


const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

let salas = {};

io.on('connection', (socket) => {
  console.log('Um jogador se conectou!');

  // Entrar em uma sala
  socket.on('entrar-sala', (sala) => {
    socket.join(sala);
    // ... lógica para gerenciar jogadores na sala
  });

  // Fazer uma jogada
  socket.on('jogada', (jogada) => {
    const sala = socket.rooms.values().next().value; // Sala atual
    // ... lógica para processar a jogada e enviar para a sala
    io.to(sala).emit('jogada', jogada);
  });
});

// Servir arquivos estáticos (HTML, CSS, JS) para o jogo
app.use(express.static('public')); 

http.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});