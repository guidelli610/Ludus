//Conexão com o mysql
import mysql from 'mysql2'

// Configuração da conexão
const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'app_user',
    password: 'user@123',
    database: 'Ludus'
});

// Conectar ao banco de dados
connection.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao MySQL!');
});

export default connection;