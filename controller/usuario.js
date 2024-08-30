const Usuario = require('../model/usuario.js');
const bcrypt = require('bcrypt');

exports.registrarUsuario = async (req, res) => {
    const usuario = req.headers.usuario;
    const senha = req.headers.senha;
    const email = req.headers.email;

    if (!usuario || !senha || !email)    //se não estiver vazio usuário, ou se não estiver vazio senha, ou se não estiver vazio email
        return res.status(400).send({ msg: '[ERRO]: Informe usuário, senha e email!' });

    try {
        const usuarioJaExiste = await Usuario.findOne({ usuario: usuario });    //findOne/find busca um elemento de acordo com o critério
        if (usuarioJaExiste) {
            return res.status(400).send({ msg: '[Erro]: usuário já cadastrado!' });
        }

        const senhaEncriptada = await bcrypt.hash(senha, 10);

        const novoUsuario = {
            usuario: usuario,
            email: email,
            senha: senhaEncriptada
        }

        await Usuario.create(novoUsuario);

        //pode fazer um return, mas não precisa, pois já está na úntima linha
        res.status(200).send({ msg: '[SUCESSO]: Usuário criado!', usuario: novoUsuario });

    } catch (erro) {
        console.log(erro);
        res.status(500).send({ msg: '[ERRO]: Erro ao registrar usuário!', detalhes: erro });
    }

}