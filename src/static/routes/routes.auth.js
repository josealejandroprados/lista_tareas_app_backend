//importamos express
const express = require('express');
//creamos un metodo router
const router = express.Router();
//importamos bcryptjs
const bcrypt = require('bcryptjs');

// importar mongoose
const { mongoose } = require('../db/db.js');

// definir esquema de usuario
const userSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true
        },
        apellido: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required:true
        },
        password: {
            type: String,
            required:true
        },
        rol: {
            type: String,
            required:true
        },
    },
    {
        versionKey: false,
    }
);

// creo un modelo
const User = mongoose.model('users',userSchema);

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

    const user = {
        email: req.body.email,
        password: req.body.password
    }

    try {
        const userExist = await User.findOne({email: user.email})

        if(!userExist){
            console.log('no existe el usuario');
        }
        else{
            console.log('usuario', userExist);
        }
    } catch (error) {
        
    }
});

module.exports = router