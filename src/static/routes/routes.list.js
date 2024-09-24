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
    state: {
        type: String,
        required:true
    }
},
{
    timestamps: true,
    versionKey: false,
});

// creo un modelo
const Task = mongoose.model('lista',taskSchema);


// ----------------------    RUTAS   -------------------------------------------------
// ruta inicial
router.get('/', (req,res) => {
    db;
    res.send('Aplicación de lista de tareas funcionando');
});

// obtener todas las tareas
router.get('/gettasks', async (req,res) => {
    try {
        // obtengo las tareas con el metodo find()
        const tasks = await Task.find();

        res.json({
            message:'exito',
            tasks: tasks
        });
    } catch (error) {
        console.log('error al obtener las tareas',error);

        res.json({message: 'error'});
    }
});

// obtener una tarea con su id
router.get('/gettask/:id', async(req,res) => {
    const id = req.params.id;

    try {
        const task = await Task.findById(id);

        res.json({
            message: 'exito',
            task: task
        });
    } catch (error) {
        console.log('error al obtener la tarea');
        res.json({message: 'error'});
    }
});

// agregar tarea a BBDD
router.post('/addtask', async (req,res) => {
    // obtengo los campos de la tarea que vienen en el req
    const task = new Task({
        name: req.body.name,
        description: req.body.description,
        state: req.body.state
    });

    try {
        // agregó la tarea usando el método save()
        await task.save();

        res.json({message: 'exito'});
    }
    catch (error) {
        console.log('error al agregar tarea',error);

        res.json({message: 'error'});
    }
});

// actualizar una tarea
router.put('/updatetask/:id', async(req,res) => {
    // obtengo el id como parametro de ruta
    const id = req.params.id;
    // obtengo los campos de la tarea que vienen en el req
    const task = {
        name: req.body.name,
        description: req.body.description,
        state: req.body.state
    };

    try {
        await Task.findByIdAndUpdate(id,task);

        res.json({message: 'exito'});
    } catch (error) {
        console.log('error al actualizar la tarea',error);

        res.json({message: 'error'});
    }
});

// eliminar tarea con su id
router.delete('/deletetask/:id', async (req,res) => {
    // obtengo el id como parametro de ruta
    const id = req.params.id;

    try {
        // elimino tarea con su id usando el método findByIdAndDelete
        await Task.findByIdAndDelete(id);

        res.json({message: 'exito'});
    } catch (error) {
        console.log('error al eliminar tarea',error);

        res.json({message: 'error'});
    }
});


module.exports = {
    router
}