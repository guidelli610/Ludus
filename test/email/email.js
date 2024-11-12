//Teste da biblioteca nodemailer
import nodemailer from 'nodemailer'

// Configurar o transporte do Nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail', // ou outro serviço de e-mail
    auth: {
        user: 'email',
        pass: 'key'
    }
});

// Função para enviar o e-mail de confirmação
function sendConfirmationEmail(userEmail) {
    const mailOptions = {
        from: 'email',
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
