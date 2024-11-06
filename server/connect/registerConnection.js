export default function registerConnection(setIsSubmitting) {
    
    const identity = document.getElementById('identity').value;
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ identity, name, email, password }),
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
        window.location.href = '/login';
    })
    .catch((error) => {
        alert(`Ocorreu um erro ao criar o usuário.\n${error.message}`);
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}