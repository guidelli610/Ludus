export default function authentication(setIsSubmitting) {

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    let returner = document.getElementById('returner').value;

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
        console.log("Data: ", data);
        alert(`Acessado com sucesso!`);
        returner = toString(data);
        return data.authentication;
    })
    .catch((error) => {
        console.error('Erro:', error);
        alert(`Ocorreu um erro ao criar o usuário.\n${error}`);
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}