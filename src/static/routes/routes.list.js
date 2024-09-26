// importamos express
const express = require('express');
// creo metodo router
const router = express.Router();

// importar conexión a BBDD de mongoDB
const { db } = require('../db/db.js');

// importar middleware isAuth
const { isAuth } = require('./auth.js');

// importar modelo de lista
const Task = require('../models/task.model.js');

// ----------------------    RUTAS   -------------------------------------------------
// ruta inicial
router.get('/', (req,res) => {
    db;
    res.send('Aplicación de lista de tareas funcionando');
});

// obtener todas las tareas
router.get('/gettasks/:user_id', isAuth, async (req,res) => {
    // obtengo el id del usuario como parametro de ruta
    const user_id = req.params.user_id;

    try {
        // obtengo las tareas con el metodo find()
        const tasks = await Task.find({user_id: user_id});

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
router.get('/gettask/:id', isAuth, async(req,res) => {
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
router.post('/addtask', isAuth, async (req,res) => {
    // obtengo los campos de la tarea que vienen en el req
    const task = new Task({
        user_id: req.body.user_id,
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
router.put('/updatetask/:id', isAuth, async(req,res) => {
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
router.delete('/deletetask/:id', isAuth, async (req,res) => {
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

// eliminar todas las tareas de una sola vez, util cuando se elimina una cuenta de usuario
router.delete('/deletealltasks/:user_id', isAuth, async(req,res) => {
    // obtengo el id del usuario como parametro de ruta
    const user_id = req.params.user_id;

    try {
        // llamar al metodo deleteMany
        await Task.deleteMany({user_id: user_id});

        res.json({message:'exito'});
    } catch (error) {
        console.log('error al eliminar todas las tareas',error);

        res.json({message:'error'});
    }
});


module.exports = router;