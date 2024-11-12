//Importaçãp da biblioteca de conexão com o banco
import mysql from 'mysql2'

// Configuração da conexão
const connection = mysql.createConnection({
    host: 'localhost', // Http
    port: 3306, // Porta
    user: 'app_user', // Usuário
    password: 'user@123', // Senha
    database: 'Ludus' // Banco de dados
});

// Conexão ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

export default connection;