const express = require("express");
const contas = require("./controladores/contas");
const transacoes = require("./controladores/transacoes");
const senhas = require("./intermediarios/senhas");
const rotas = express();


rotas.get("/contas", senhas.verificarSenhaBanco, contas.listarContas);
rotas.post("/contas", contas.adicionarConta);
rotas.put("/contas/:numeroConta/usuario", contas.atualizarUsuario);
rotas.delete("/contas/:numeroConta", contas.removerConta);

rotas.post("/transacoes/depositar", transacoes.depositar);
rotas.post("/transacoes/sacar", senhas.verificarSenhaContaBody, transacoes.sacar);
rotas.post("/transacoes/transferir", senhas.verificarSenhaContaBody, transacoes.transferir);

rotas.get("/contas/saldo", senhas.verificarSenhaBanco, contas.imprimirSaldo);
rotas.get("/contas/extrato", senhas.verificarSenhaContaQuery, transacoes.extrato);


module.exports = rotas;













