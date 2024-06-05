const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware para permitir CORS
app.use(cors());

// Middleware para parsear JSON
app.use(bodyParser.json());

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/reservas', { useNewUrlParser: true, useUnifiedTopology: true });

// Definir el esquema y el modelo para las reservas
const reservaSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    time: String,
    guests: Number
});

const Reserva = mongoose.model('Reserva', reservaSchema);

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
        user: 'alvaroarraras94@outlook.com',
        pass: 'Wasd123123.'
    },
    tls: {
        ciphers: 'SSLv3'
    }
});

// Ruta para manejar las reservas
app.post('/api/reservas', (req, res) => {
    const nuevaReserva = new Reserva(req.body);

    nuevaReserva.save()
        .then(() => {
            // Configurar el correo
            const mailOptions = {
                from: 'alvaroarraras94@outlook.com',
                to: 'al.arraras0x@gmail.com',
                subject: '¡Has recibido una reserva!',
                html: `
                    <h1>Nueva Reserva</h1>
                    <p><strong>Nombre:</strong> ${req.body.name}</p>
                    <p><strong>Email:</strong> ${req.body.email}</p>
                    <p><strong>Fecha:</strong> ${req.body.date}</p>
                    <p><strong>Hora:</strong> ${req.body.time}</p>
                    <p><strong>Número de comensales:</strong> ${req.body.guests}</p>
                `
            };

            // Enviar el correo
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error('Error al enviar correo:', error);
                    return res.status(500).json({ message: 'Error al enviar correo', error });
                }
                console.log('Correo enviado:', info.response);
                res.json({ message: 'Reserva recibida con éxito y correo enviado', reserva: nuevaReserva });
            });
        })
        .catch(error => {
            console.error('Error al guardar la reserva:', error);
            res.status(500).json({ message: 'Error al guardar la reserva', error });
        });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
