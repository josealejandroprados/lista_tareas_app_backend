//importamos express
const express = require('express');
//creamos un metodo router
const router = express.Router();
//importar jwt
const jwt = require('jsonwebtoken');
//importamos bcryptjs
const bcrypt = require('bcryptjs');
// importar nodemailer
const nodemailer = require('nodemailer');

// Configurar el transporte de nodemailer para usar Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_BACKEND,
      pass: process.env.PASSWORD_APP
    },
});

// importar modelo User
const User = require('../models/user.model.js');

// importar middleware isAuth
const { isAuth } = require('./auth.js');

// endpoint registrar un usuario
router.post('/register', async (req,res) => {
    // obtengo el usuario que viene en el req
    const user = new User({
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        email: req.body.email,
        password: req.body.password,
        rol: 'user'
    });

    try {
        // encriptar password
        let passHash = await bcrypt.hash(user.password,8);
        user.password = passHash;

        // insertar usuario
        await user.save();

        res.json({message:'exito'});
    }
    catch (error) {
        console.log('error al agregar nuevo usuario',error);
        res.json({message:'error'});
    }
});

// endpoint inicio sesion/login de usuario
router.post('/login', async(req,res) => {
    // obtengo el usuario (email) y password proporcionado por el usuario en el frontend
    const user = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        // consulto a la BBDD si existe un usuario con el email proporcionado por el usuario
        const userExist = await User.findOne({email: user.email});

        if(!userExist){
            console.log('usuario no encontrado');
            //usuario (email) no encontrado
            res.json({auth: false, message: "usuario no encontrado"});
        }
        else{
            // si existe el usuario

            // comparar password obtenido de la BBDD con el password ingresado por el usuario en el frontend
            const validPassword = await bcrypt.compare(user.password,userExist.password);

            // verificar si el password que ingresó el usuario es correcto
            if(validPassword){
                // password correcto => generar token con jsonwebtoken
                const token = jwt.sign({id: userExist._id}, process.env.claveSecret);

                res.json({
                    auth: true,
                    token: token,
                    rol: userExist.rol,
                    usuario: user.email,
                    id: userExist._id
                });
            }
            else{
                //password incorrecto
                res.json({auth: false, message: 'Password incorrecto'});
            }
        }
    } catch (error) {
        console.log(error);
        res.json({
            auth: false,
            message:'Ha ocurrido un error',
            error: error
        })
    }
});

// end point eliminar cuenta de usuario
router.delete('/deleteaccount/:id', isAuth, async(req,res) => {
    // obtengo el id del usuario como un parámetro de ruta
    const id = req.params.id;

    try {
        await User.findByIdAndDelete(id);

        res.json({message:'exito'});
    } catch (error) {
        console.log('error al eliminar el usuario',error);

        res.json({message:'error'});
    }
});

// endpoint para consultar disponibilidad de email en la BBDD
router.get('/emailAvailable/:email', async(req,res) => {
    // obtener email como parametro de ruta
    const email = req.params.email;

    try {
        // consulto a la BBDD si existe el email
        const resultado = await User.find({email: email});

        if(resultado[0]){
            // si obtengo un resultado quiere decir que el email ya existe en la BBDD
            // entonces no está disponible para registro
            res.json({available: false});
        }
        else{
            // no obtuve resultado => email si está disponible para registro
            res.json({available: true});
        }
    } catch (error) {
        res.json({available: false});
    }
});

// end point para email con los datos del formulario de contacto que viene del frontend
router.post('/sendemail', (req,res) => {
    const obj = {
        nombre: req.body.nombre,
        email_user: req.body.email_user,
        mensaje: req.body.mensaje,
        asunto: req.body.asunto,
        telefono: req.body.telefono
    }
    var texto;
    if(obj.telefono != ''){
        texto = `La persona de nombre ${obj.nombre} con email ${obj.email_user} y telefono ${obj.telefono}, te envío el mensaje:<br><br> ${obj.mensaje}`;
    }
    else{
        texto = `La persona de nombre ${obj.nombre} con email ${obj.email_user}, te envío el mensaje:<br><br> ${obj.mensaje}`;
    }

    const mailOptions = {
        from: process.env.EMAIL_BACKEND, // Remitente
        to: process.env.EMAIL_DEST,
        subject: obj.asunto,
        text:texto,
        html: `
            <p>${texto}</p>
        `
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log(error);
            res.json({message:'error'});
        }
        else{
            console.log('Correo enviado: ' + info.response);
            res.json({message:'exito'});
        }
    })
});

module.exports = router;