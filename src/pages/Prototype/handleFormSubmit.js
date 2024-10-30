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
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data: ", data);
        alert(`Usuário criado com sucesso! ID: ${data.id}`);
    })
    .catch((error) => {
        console.error(error);
        alert(`Ocorreu um erro ao criar o usuário.\n${error}`);
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}