const mongoose = require('mongoose');
const Schema = mongoose.Schema; //Schema associado mais a estrutura

const UsuarioSchema = new Schema({
    usuario: { type: String, required: true, unique: true },    //não faz sentido ter mais de um usuário com o mesmo login
    email: { type: String, required: true, unique: true },
    senha: { type: String, required: true }
});

module.exports = mongoose.model('Usuario', UsuarioSchema);