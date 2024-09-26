//importamos jwt
const jwt = require('jsonwebtoken');

const {promisify} = require('util');

//convertir jwt.verify en una funcion que devuelve una promesa
const verififyToken = promisify(jwt.verify);

// importar modelo User
const User = require('../models/user.model.js');


let verificarAuth = async (decodificada,req,next) => {
    // realizar consulta a la BBDD para ver si existe el usuario
    const user = await User.findById(decodificada.id);

    if(user){
        req.user = user;
        return next();
    }
    else{
        return next();
    }
}


//middleware auth
const isAuth = async(req,res,next) => {
    //obtener el token que viene en el headers de la petición, nota: auth en minuscula
    const token = req.headers['auth'];
    
    // verifico si hay un token
    if(token)
    {
        try
        {
            const decodificada = await verififyToken(token,process.env.claveSecret);
            // console.log(decodificada);
            verificarAuth(decodificada,req,next);
        }
        catch (error)
        {
            console.log('error: '+error);
            console.log('Fallo de autenticacion');
            res.json({
                message:'exito',
                content:'Fallo de autenticacion'
            });
        }
    }
    else{
        // no hay token
        console.log('No se proporcionó un token o ha expirado')
        res.json({
            message:'error',
            content:'No se proporcionó un token o ha expirado'
        });
    }
}

module.exports = {
    isAuth
}