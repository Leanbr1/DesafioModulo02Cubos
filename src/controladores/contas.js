let { banco, contas } = require("../bancodedados");
const listarContas = (req, res) => {
    return res.status(200).json(contas);
};
const adicionarConta = (req, res) => {
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const UltimoIdCadastrado = Number(contas[contas.length - 1].numero) + 1;
    if (!nome || !cpf || !data_nascimento || !telefone || !email || !senha) {
        return res.status(400).json(
            { mensagem: `é necessario informar os campos: nome, cpf, data de nascimento, telefone, email e senha` });
    }
    const JaExiste = contas.find((conta) => {
        return conta.cpf === cpf || conta.email === email;
    })
    if (JaExiste) {
        return res.status(400).json({ mensagem: `cpf ou email ja cadastrado` });
    }
    contas.push({ numero: UltimoIdCadastrado, saldo: 0, usuario: { nome, cpf, data_nascimento, telefone, email, senha } });
    return res.status(201).send();
}
const atualizarUsuario = (req, res) => {
    const { numeroConta } = req.params;
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body;
    const tamanhoObjeto = Object.keys(req.body).length
    if (tamanhoObjeto < 1) {
        return res.status(400).json({ mensagem: "nenhum campo informado" });
    }
    const contaExistente = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });
    if (!contaExistente) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }
    if (cpf) {
        const cpfExistente = contas.find((conta) => {
            return conta.usuario.cpf === cpf;
        })
        if (cpfExistente) {
            return res.status(400).json({ mensagem: "cpf ja existente" });
        }
    }

    if (email) {
        const emailExistente = contas.find((conta) => {
            return conta.usuario.email === email;
        })
        if (emailExistente) {
            return res.status(400).json({ mensagem: "email ja existente" });
        }
    }

    if (nome) { contaExistente.usuario.nome = nome; }

    if (cpf) { contaExistente.usuario.cpf = cpf; }

    if (data_nascimento) { contaExistente.usuario.data_nascimento = data_nascimento; }

    if (telefone) { contaExistente.usuario.telefone = telefone; }

    if (email) { contaExistente.usuario.email = email; }

    if (senha) { contaExistente.usuario.senha = senha; }

    return res.status(201).json({ mensagem: "usuario atualizado" });

}
const removerConta = (req, res) => {
    const { numeroConta } = req.params;
    const contaAremover = contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });
    if (!contaAremover) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    contas = contas.filter((conta) => {
        return conta !== contaAremover;
    });
    return res.status(200).json({ mensagem: "Conta excluída com sucesso" });

}
const imprimirSaldo = (req, res) => {
    const { numero_conta } = req.query;
    if (!numero_conta) {
        return res.status(400).json({ mensagem: "numero da conta nao informado" });
    }
    const contaDesejada = contas.find((conta) => {
        return Number(numero_conta) === conta.numero;
    });
    if (!contaDesejada) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }
    return res.status(200).json({ saldo: contaDesejada.saldo });
}

module.exports = {
    listarContas,
    adicionarConta,
    atualizarUsuario,
    removerConta,
    imprimirSaldo
}