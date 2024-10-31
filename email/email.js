//Teste da biblioteca nodemailer
import nodemailer from 'nodemailer'

// Configurar o transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço de e-mail
    auth: {
        user: 'ludus4423@gmail.com',
        pass: 'ludus123mail'
    }
});

// Função para enviar o e-mail de confirmação
function sendConfirmationEmail(userEmail) {
    const mailOptions = {
        from: 'ludus4423@gmail.com',
        to: userEmail,
        subject: 'Confirmação de Registro',
        text: 'Obrigado por se registrar! Por favor, confirme seu e-mail.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail: ', error);
        } else {
            console.log('E-mail enviado: ' + info.response);
        }
    });
}
