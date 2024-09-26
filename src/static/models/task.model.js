// importar conexión a BBDD de mongoDB
const { mongoose } = require('../db/db.js');

// definir esquema de tareas
const taskSchema = new mongoose.Schema(
    {
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
            required: true
        },
        user_id: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// creo un modelo
const Task = mongoose.model('lista',taskSchema);

module.exports = Task;