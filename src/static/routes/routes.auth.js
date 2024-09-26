//importamos express
const express = require('express');
//creamos un metodo router
const router = express.Router();
//importar jwt
const jwt = require('jsonwebtoken');
//importamos bcryptjs
const bcrypt = require('bcryptjs');

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

module.exports = router;