import { Pool } from "pg";
import { Request, Response } from 'express';

export async function listagemPorId(req: Request, res: Response, pool: Pool) {
    const idPergunta = req.params.id;
    let page: number = parseInt(req.query.page as string) || 1;
    let limit: number = parseInt(req.query.limit as string) || 10;
    let offset: number = ((parseInt(req.query.page as string) || 1) - 1) * limit;

    try {
        const { rows } = await pool.query(`
        SELECT perguntas.*, json_agg(respostas.*) AS respostas
        FROM perguntas
        LEFT JOIN (
            SELECT * FROM respostas ORDER BY id LIMIT $2 OFFSET $3
        ) AS respostas ON perguntas.id = respostas.idPergunta
        WHERE perguntas.id = $1
        GROUP BY perguntas.id
    `, [idPergunta, limit, offset]);

        if (rows.length > 0) {
            const { respostas, ...pergunta } = rows[0];
            if (!respostas || respostas[0] === null) {
                res.status(404).json({ message: 'Não há nada para listar nesta página.' });
            } else {
                res.json({
                    pergunta: pergunta,
                    respostas: respostas,
                    offset: offset,
                    limit: limit,
                    page: page
                });
            }
        } else {
            res.status(404).json({ message: 'Pergunta não encontrada.' });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Erro ao buscar respostas.' });
    }

}