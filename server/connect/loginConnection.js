export default function loginConnection(setIsSubmitting, setAlertMessage, setShowAlert) {

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
        console.log("Data: ", data);
        localStorage.setItem('token', data.token);
        //window.location.href = '/prototype1';
    })
    .catch((error) => {
        setAlertMessage(error.message); // Define a mensagem de erro
        setShowAlert(true); // Mostra o alerta
    })
    .finally(() => {
        setIsSubmitting(false); // Reabilita o botão após a conclusão da operação
    });
}