export default function authentication(setIsSubmitting, setAlertMessage, setShowAlert) {

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
            return response.json().then(error => {
                throw new Error(error.message); // Captura a mensagem de erro do servidor
            });
        }
        return response.json();
    })
    .then(data => {
        if (data.authentication) {
            localStorage.setItem('token', data.token);
        }
        window.location.href = '/home';
    })
    .catch((error) => {
        setAlertMessage(error.message); // Define a mensagem de erro
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
        setShowAlert(true); // Mostra o alerta
    });
}