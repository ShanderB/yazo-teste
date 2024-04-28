import { Pool } from "pg";
import { dadosJWT } from "../common/validacaoTipoUsuario";
import { Request, Response } from 'express';

export async function criarResposta(req: Request, res: Response, pool: Pool): Promise<void> {

    const { idPergunta, resposta } = req.body;

    if (!idPergunta || !resposta) {
        res.status(400).json({ message: 'Por favor, preencha todos os campos corretamente.' });
        return;
    }

    //TODO talvez posso remover. Se ao tentar inserir der erro, simplesmente ignora.
    const hasPergunta = await pool.query('SELECT criadoPor FROM perguntas WHERE id = $1', [idPergunta]);

    if (!hasPergunta.rows.length) {
        res.status(404).json({ message: 'Pergunta não existe.' });
        return;
    }

    const dadosUsuario = dadosJWT(req, res, pool);

    if (hasPergunta.rows[0].criadopor == dadosUsuario?.usuarioId) {
        res.status(400).json({ message: 'Não é possível responder uma pergunta criada por si mesmo.' });
        return;
    }

    const hasResposta = await pool.query('SELECT idPergunta, respondidoPor FROM respostas WHERE id = $1 AND respondidoPor = $2', [idPergunta, dadosUsuario?.id]);

    if (hasResposta.rows.length) {
        res.status(400).json({ message: 'Você já respondeu essa pergunta.' });
        return;
    }

    const retornoBanco = await pool.query('INSERT INTO respostas (idPergunta, respondidoPor, resposta) VALUES ($1, $2, $3)', [idPergunta, dadosUsuario?.id, resposta]);

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: `Adicionado resposta ao banco.` });
        return;
    } else {
        res.status(500).json({ message: 'Erro ao adicionar resposta ao banco.' });
        return;
    }
}