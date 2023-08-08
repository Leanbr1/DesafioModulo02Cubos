const { banco, contas } = require("../bancodedados");

const verificarSenhaBanco = (req, res, next) => {
    const { senha } = req.query;

    if (!senha) {
        return res.status(401).json({ mensagem: "favor inserir senha" });
    }

    if (senha !== banco.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    } else {
        next();
    }

}
const verificarSenhaContaBody = (req, res, next) => {
    const { senha, numero_conta, numero_conta_origem } = req.body;

    if (!senha) {
        return res.status(401).json({ mensagem: "favor inserir senha" });

    }
    const contaExistente = contas.find((conta) => {
        if (numero_conta) {
            return conta.numero === Number(numero_conta);
        } else if (numero_conta_origem) {
            return conta.numero === Number(numero_conta_origem);
        }
    });
    if (!contaExistente) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    if (senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    } else {
        next();
    }


}
const verificarSenhaContaQuery = (req, res, next) => {
    const { senha, numero_conta } = req.query;

    if (!senha) {
        return res.status(401).json({ mensagem: "favor inserir senha" });

    }
    const contaExistente = contas.find((conta) => {
        numero_conta
        return conta.numero === Number(numero_conta);
    });
    if (!contaExistente) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    if (senha !== contaExistente.usuario.senha) {
        return res.status(401).json({ mensagem: "Senha incorreta" });
    } else {
        next();
    }


}
module.exports = {
    verificarSenhaBanco,
    verificarSenhaContaBody,
    verificarSenhaContaQuery
}