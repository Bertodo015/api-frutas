require('dotenv').config();

//cria o tonken com essa chave, e abre também       tanto para criar, quanto para desfazer
const chavePrivada = process.env.CHAVE_JWT || '';

const jwt = require('jsonwebtoken');

const Usuario = require('../model/usuario.js');
const bcrypt = require('bcrypt');

//requisição, resposta e o next("segue o fluxo normal aí")
exports.autenticar = (req, res, next) => {
    console.log('Entrou no middleware de autenticação...');

    //chave de acesso que será definida (*posso definir a duração)
    const token = req.headers['authorization'];

//{ expiresIn: '20000' } para a chave expirar
    jwt.verify(token, chavePrivada, { expiresIn: '2000' }, (erro, informacoesUsuario) => {
        if (erro)
            return res.status(401).send({ msg: 'Token inválido ou expirado' });
        //res.status(200).send(informacoesUsuario);
        next();
    });
}

//---
exports.logar = async (req, res, next) => {
    //const usuario = req.headers.usuario;
    //const senha = req.headers.senha;
    //as duas linhas de cima podem ser representadas dessa forma
    const { usuario, senha } = req.headers;

    const usuarioExisteBD = await Usuario.findOne({ usuario: usuario });

    if (!usuarioExisteBD)
        return res.status(400).send({ msg: '[ERRO]: Usuário não existe!' });

    //se ele passar da linha anterior
    //                                          //123               //$2s4sd564s3
    const senhaCorreta = await bcrypt.compare(senha, usuarioExisteBD.senha);
    if (senhaCorreta) { //senhaCorreta == true      (variáveis buleanas já possuem valor de verdadeiro ou falso)
        //pode deletar uma propriedade de um objeto
        delete usuarioExisteBD._id;
        delete usuarioExisteBD.senha;

        //se a senha está correta, criar o token para o usuário
        jwt.sign(usuarioExisteBD.toJSON(), chavePrivada, { expiresIn: '1d' }, (erro, token) => {
            if (erro)
                return res.status(500).send({ msg: '[ERRO]: Erro ao gerar JWT!' });
            //não é necessário o 'else', pois há o 'return'
            res.status(200).send({ token: token });
        });
    } else {
        res.status(401).send({ msg: '[ERRO]: Usuário ou senha errados!' });
    }
}