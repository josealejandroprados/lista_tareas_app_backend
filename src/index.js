// importar express
const express = require('express');

//importar dotenv
const dotenv = require('dotenv');
//seteamos las variables de entorno
dotenv.config({path:'./src/env/.env'});

// importar cors
const cors = require('cors');

//crear app
const app = express();

//configurar cors, listDomain='lista de sitios permitidos'
const listDomain = [
    "http://localhost:4200"
];
//opciones de CORS
const corsOpcions = {
    origin: function(origin,callback){
        if(listDomain.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }
        else{
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus:200,
    credentials:true
};

//usar CORS
app.use(cors(corsOpcions));

//setting express
app.set('port', process.env.PORT || 3000);

//configuracion archivos estaticos
app.use(express.static('./src/static'));

app.use(express.json());
app.use(express.urlencoded({extended: false}));



//iniciar servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
});