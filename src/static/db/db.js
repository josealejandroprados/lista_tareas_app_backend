// importo mongoose para la conexión con la BBDD de MongoDB
const mongoose = require('mongoose');

// Conexión a MongoDB Atlas
const db = mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then( () => {
    console.log('Conexión exitosa a la BBDD de MongoDB Atlas');
})
.catch(error => {
    console.log('error al conectarse a la BBDD de MongoDB Atlas',error);
});

module.exports = {
    db
}