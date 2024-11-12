export default async function protectedConnection() {
    // Obtém o token do localStorage (ou de onde ele estiver salvo)
    const token = localStorage.getItem('token');

    // Realiza a requisição com o cabeçalho Authorization
    const response = await fetch('http://localhost:3000/secure', {
        method: 'GET', // ou 'POST', 'PUT', etc., dependendo da sua rota
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
        }
    });
    
    if (!response.ok) {
        return response.json().then(error => {
            throw new Error(error.message); // Captura a mensagem de erro do servidor
        });
    }
    
    return response.json(); // Retorna os dados se a resposta for válida
}