let { banco, contas, saques, depositos, transferencias } = require("../bancodedados");
const { format, utcToZonedTime } = require("date-fns-tz");



const depositar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!numero_conta || !valor) {
        res.status(400).json({ mensagem: "numero_conta e valor sao obrigatorios" });
    }
    if (Number(valor) <= 0) {
        return res.status(400).json({ mensagem: "valor para deposito invalido" });
    }
    const contaParaDeposito = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })
    if (!contaParaDeposito) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    contaParaDeposito.saldo += Number(valor);

    const date = new Date()
    const timeZone = "America/Sao_Paulo"
    const zoneDate = utcToZonedTime(date, timeZone)

    const pattern = 'dd-MM-yyyy HH:mm:ss'
    const data = format(zoneDate, pattern, { timeZone: "America/Sao_Paulo" });
    depositos.push(
        {
            data,
            numero_conta,
            valor
        }
    )
    return res.status(200).json({ mensagem: "deposito realizado com sucesso" });
}
const sacar = (req, res) => {
    const { numero_conta, valor } = req.body;
    if (!numero_conta || !valor) {
        return res.status(400).json({ mensagem: "numero_conta e valor sao obrigatorios" });
    }
    const contaParaSaque = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    })
    if (Number(valor) > contaParaSaque.saldo) {
        return res.status(400).json({ mensagem: "valor para saque invalido" });
    }
    if (!contaParaSaque) {
        return res.status(404).json({ mensagem: "conta nao encontrada" });
    }

    contaParaSaque.saldo -= Number(valor);
    const date = new Date()
    const timeZone = "America/Sao_Paulo"
    const zoneDate = utcToZonedTime(date, timeZone)

    const pattern = 'dd-MM-yyyy HH:mm:ss'
    const data = format(zoneDate, pattern, { timeZone: "America/Sao_Paulo" });
    saques.push(
        {
            data,
            numero_conta,
            valor
        }
    )
    return res.status(200).json({ mensagem: "saque realizado com sucesso" });
}
const transferir = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body;
    if (!numero_conta_origem || !numero_conta_destino || !valor || !senha || numero_conta_destino === numero_conta_origem) {
        return res.status(400).json({ mensagem: "numero da conta de origem, numero da conta de destino, valor e senha sao obrigatorios" });
    }

    const contaOrigem = contas.find((conta) => {
        return conta.numero === Number(numero_conta_origem);
    });
    if (!contaOrigem) {
        return res.status(404).json({ mensagem: "conta de origem nao encontrada" });
    }

    const contaDestino = contas.find((conta) => {
        return conta.numero === Number(numero_conta_destino);
    })
    if (!contaDestino) {
        return res.status(404).json({ mensagem: "conta de destino nao encontrada" });
    }

    if (valor > contaOrigem) {
        return res.status(400).json({ mensagem: "saldo insuficiente para transferencia" });
    }
    contaOrigem.saldo -= valor;
    contaDestino.saldo += valor;
    const date = new Date()
    const timeZone = "America/Sao_Paulo"
    const zoneDate = utcToZonedTime(date, timeZone)

    const pattern = 'dd-MM-yyyy HH:mm:ss'
    const data = format(zoneDate, pattern, { timeZone: "America/Sao_Paulo" });
    transferencias.push(
        {
            data,
            numero_conta_origem,
            numero_conta_destino,
            valor
        }
    )

    return res.status(200).json({ mensagem: "transferencia realizada com sucesso" });
}
const extrato = (req, res) => {
    const { numero_conta } = req.query;
    if (!numero_conta) {
        return res.status(400).json({ mensagem: "favor inserir numero da conta" });
    }
    const conta = contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });
    if (!conta) {
        res.status(404).json({ mensagem: "conta nao encontrada" });
    }
    const depositosDaConta = depositos.filter((deposito) => {
        return deposito.numero_conta === Number(numero_conta);
    })
    const saquesDaConta = saques.filter((saque) => {
        return saque.numero_conta === Number(numero_conta);
    })
    const transferenciasRecebidas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === Number(numero_conta);
    })
    const transferenciasEnviadas = transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === Number(numero_conta);
    })

    return res.status(200).json({ depositos: depositosDaConta, saques: saquesDaConta, transferenciasEnviadas, transferenciasRecebidas });
}

module.exports = {
    depositar,
    sacar,
    transferir,
    extrato
}