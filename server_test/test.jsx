

document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Impede o envio padrão do formulário

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
    })
    .then(response => {
        // Verifica se a resposta é ok (status na faixa 200-299)
        if (!response.ok) {
            throw new Error(`Erro: ${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data: ", data); // Exibe a resposta do servidor
        alert(`Usuário criado com sucesso! ID: ${data.id}`); // Mostra o ID do usuário criado
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert(`Ocorreu um erro ao criar o usuário.\n${error}`); // Mensagem de erro genérica
    });
});