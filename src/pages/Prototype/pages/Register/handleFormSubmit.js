export default function handleFormSubmit(setIsSubmitting) {
    
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
    .catch((error) => {
        alert(`Ocorreu um erro ao criar o usuário.\n${error.message}`);
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}