//lógica do BD
const Frutas = require("../model/frutas.js");

exports.listarFrutas = async (requisition, resposta) => {
    try {
        const frutas = await Frutas.find({});
        resposta.send(frutas);
    } catch (erro) {
        console.log(erro);
        resposta.send({ msg: '[ERRO]: Erro ao listar!', descricao: erro });
    }
}

exports.adicionarFruta = async (req, res) => {
    //req.body OU req.params OU req.query
    const novaFruta = req.headers;
    if (!novaFruta.nome || !novaFruta.preco) {
        res.send({ msg: '[ERRO]: Informar nome e preco!' })
    } else {
        try {
            await Frutas.create(novaFruta);
            res.send({ msg: '[SUCESSO]: Produto adicionado!' });
        } catch (erro) {
            console.log(erro);
            res.send({ msg: '[ERRO]: Erro ao cadastrar' });
        }

    }

    /** Pode ser assim
     * return res.send({ msg:'[ERRO]: Informar nome e preco!' })
        try {
            await Frutas.create(novaFruta);
            res.send({ msg:'[SUCESSO]: Produto adicionado!' });
        } catch(erro) {
            console.log(erro);
            res.send({ msg: '[ERRO]: Erro ao cadastrar' });
        }
     */
}

exports.editarFruta = async (req, res) => {
    const fruta = req.headers;
    if (!fruta.nome || fruta.preco) {
        return res.send({ msg: '[ERRO]: Informar nome e preco' });
    }
    try {
        const frutaEditada = await Frutas.findOneAndUpdate({ nome: fruta.nome }, { preco: fruta.preco });
        if (frutaEditada == null)
            res.send({ msg: '[AVISO]: Fruta não existe no BD!' })
        else
            res.send({ msg: '[SUCESSO]: Fruta editada' })
    } catch (erro) {
        console.log(erro);
        res.send({ msg: '[ERRO]: Erro ao editar!', detalhes: erro });
    }
}

exports.removerFruta = async (req, res) => {
    const fruta = req.headers;
    if (!fruta.nome)
        return res.send({ msg: '[ERRO]: Informar nome' });
    try {
        const frutaEditada = await Frutas.findOneAndDelete({ nome: fruta.nome });
        if (frutaEditada == null)
            res.send({ msg: '[AVISO]: Fruta não existe no BD!' })
        else
            res.send({ msg: '[SUCESSO]: Fruta removida!' })
    } catch (erro) {
        console.log(erro);
        res.send({ msg: '[ERRO]: Erro ao remover!', detalhes: erro });
    }
}