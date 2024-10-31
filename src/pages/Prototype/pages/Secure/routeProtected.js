export default function routeProtected (setIsSubmitting) {
    // Obtém o token do localStorage (ou de onde ele estiver salvo)
    const token = localStorage.getItem('token');

    // Realiza a requisição com o cabeçalho Authorization
    fetch('http://localhost:3000/rota-protegida', {
        method: 'GET', // ou 'POST', 'PUT', etc., dependendo da sua rota
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Adiciona o token ao cabeçalho
        }
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(error => {
                throw new Error(error.message); // Captura a mensagem de erro do servidor
            });
        }
        return response.json();
    })
    .then(data => {
        alert(data.message);
    })
    .catch(error => {
        alert(`Ocorreu um erro na autenticação.\n${error.message}`);
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}