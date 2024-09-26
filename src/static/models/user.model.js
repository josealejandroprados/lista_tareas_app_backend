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

module.exports = User;