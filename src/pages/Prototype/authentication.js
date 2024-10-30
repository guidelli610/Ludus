export default function authentication(setIsSubmitting) {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data:", data);

        if (data.authentication) {
            localStorage.setItem('token', data.token);
            alert('Login bem sucedido!');
        } else {
            alert('Login falhou!');
        }
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert(`Ocorreu um erro ao criar o usuário.\n${error}`);
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}