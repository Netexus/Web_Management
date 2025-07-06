import express from 'express';
import fs from 'fs';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const DB_PATH = path.join(__dirname, 'data/db.json');

function leerDB() {
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
}

function guardarDB(data) {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// POST: nuevo evento y envío de correo
app.post('/api/eventos', (req, res) => {
  const nuevoEvento = req.body;
  const db = leerDB();

  db.eventos.push(nuevoEvento);
  guardarDB(db);

  const asunto = `Nuevo evento: ${nuevoEvento.titulo}`;
  const cuerpo = `
    <h2>${nuevoEvento.titulo}</h2>
    <p>${nuevoEvento.descripcion}</p>
    <p><strong>Fecha:</strong> ${nuevoEvento.fecha}</p>
    <p>Estado: ${nuevoEvento.estado}</p>
  `;

  // Enviar a todos los suscriptores
  db.suscriptores.forEach(suscriptor => {
    const mailOptions = {
      from: `"Dos Ruedas Libres" <${process.env.EMAIL_USER}>`,
      to: suscriptor.correo,
      subject: asunto,
      html: cuerpo
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(`Error enviando a ${suscriptor.correo}:`, err);
      } else {
        console.log(`Correo enviado a ${suscriptor.correo}:`, info.response);
      }
    });
  });

  res.status(201).json({ mensaje: "Evento creado y correos enviados" });
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
