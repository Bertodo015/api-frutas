/**
 * Para instalar o mongoose
 * npm i mongoose
 * npm i express mongoose
 * npm i jsonwebtoken
 * npm i dotenv
 * npm i bcrypt
 */
const express = require('express');
const api = express();
//puxa o .env
require('dotenv').config();
//process.env são todas as variáveis do arquivo .env
const URL_BD = process.env.URL_BD || '';
const portaApi = 3000;
const mongoose = require('mongoose');

mongoose.connect(URL_BD);

//para ter um feedback de que deu certo
mongoose.connection.on('connected', () => {
    console.log('API conectada ao BD!');
});
//function() {} é similar a () => {}

mongoose.connection.on('disconnected', () => {
    console.log('API desconectada do BD!');
});

mongoose.connection.on('error', (erro) => {
    console.log('Erro ao conectar no BD!', erro);
});

api.get('/status', function (req, res) {
    res.send('<h3>API Online!</h3>');
})

api.listen(portaApi, function () {
    console.log('API Online!');
});

const frutasController = require("./controller/frutas.js");
const usuarioController = require("./controller/usuario.js");
const autenticacao = require('./middlewares/autenticacao.js');


api.post('/login', autenticacao.logar);
api.post('/usuario', usuarioController.registrarUsuario);
api.get('/frutas', autenticacao.autenticar, frutasController.listarFrutas);
//POST para adicionar
api.post('/fruta', autenticacao.autenticar, frutasController.adicionarFruta);
//PUT para editar
api.put('/fruta', autenticacao.autenticar, frutasController.editarFruta);
//DELETE para remover
api.delete('/fruta', autenticacao.autenticar, frutasController.removerFruta);
//api. metodoHTTP ("/caminho")