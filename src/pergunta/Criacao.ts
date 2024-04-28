import { dadosJWT } from "../common/validacaoTipoUsuario";
import { Request, Response } from 'express';
import { Pool } from "pg";

export async function criarPergunta(req: Request, res: Response, pool: Pool) {
    const { pergunta } = req.body;

    if (!pergunta) {
        res.status(400).json({ message: 'Por favor, preencha todos os campos corretamente.' });
        return;
    }

    const hasPergunta = await pool.query('SELECT LOWER(pergunta) FROM perguntas WHERE LOWER(pergunta) = $1', [pergunta]);

    if (hasPergunta.rows.length) {
        res.status(400).json({ message: 'Pergunta já existe.' });
        return;
    }

    const dadosUsuario = dadosJWT(req, res, pool);

    const retornoBanco = await pool.query('INSERT INTO perguntas (pergunta, criadoPor) VALUES ($1, $2)', [pergunta, dadosUsuario?.id]);

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: `Adicionado a pergunta ao banco.` });
        return;
    } else {
        res.status(500).json({ message: 'Erro ao adicionar ao banco.' });
        return;
    }
}