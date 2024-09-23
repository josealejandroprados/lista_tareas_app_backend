// importamos express
const express = require('express');
// creo metodo router
const router = express.Router();

// importar conexión a BBDD de mongoDB
const { db, mongoose } = require('../db/db.js');

// definir esquema de tareas
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        required:true
    }
},
{
    timestamps: true
});

// creo un modelo
const Task = mongoose.model('lista',taskSchema);


// ----------------------    RUTAS   -------------------------------------------------
// ruta inicial
router.get('/', (req,res) => {
    db;
    res.send('Aplicación de lista de tareas funcionando');
});

// agregar tarea a BBDD
router.post('/addtask', async (req,res) => {
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        completed: req.body.completed
    });

    try {
        await task.save();

        res.json({message: 'exito'});
    }
    catch (error) {
        console.log('error al agregar tarea',error);
        
        res.json({message: 'error'});
    }
});


module.exports = {
    router
}