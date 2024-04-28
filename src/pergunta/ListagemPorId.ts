import { Pool } from "pg";
import { Request, Response } from 'express';

export async function listagemPorId(req: Request, res: Response, pool: Pool) {
    const idPergunta = req.params.id;
    let page: number = parseInt(req.query.page as string) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    try {
        // Buscar as informações da pergunta
        const retornoPergunta = await pool.query('SELECT * FROM perguntas WHERE id = $1', [idPergunta]);

        // Buscar as respostas
        const retornoBanco = await pool.query('SELECT * FROM respostas WHERE idPergunta = $1 ORDER BY id LIMIT $2 OFFSET $3', [idPergunta, limit, offset]);

        res.json({
            pergunta: retornoPergunta.rows[0],
            respostas: retornoBanco.rows,
            offset: offset,
            limit: limit,
            page: page
        });
    } catch (err) {
        res.status(500).json({ message: 'Erro ao buscar respostas.' });
    }

}