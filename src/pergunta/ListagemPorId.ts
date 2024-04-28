import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro
const ERRO_LISTAGEM = 'Não há nada para listar nesta página.';
const ERRO_PERGUNTA_NAO_ENCONTRADA = 'Pergunta não encontrada.';
const ERRO_BUSCAR_RESPOSTAS = 'Erro ao buscar respostas.';

export default async function listagemPorId(req: Request, res: Response, pool: Pool) {
    const idPergunta = req.params.id;
    let page: number = parseInt(req.query.page as string) || 1;
    let limit: number = parseInt(req.query.limit as string) || 10;
    let offset: number = (page - 1) * limit;

    try {
        // Consulta para buscar a pergunta e suas respostas
        const { rows } = await pool.query(`
        SELECT perguntas.*, json_agg(respostas.*) AS respostas
        FROM perguntas
        LEFT JOIN (
            SELECT * FROM respostas ORDER BY id LIMIT $2 OFFSET $3
        ) AS respostas ON perguntas.id = respostas.idPergunta
        WHERE perguntas.id = $1
        GROUP BY perguntas.id`, [idPergunta, limit, offset]);

        // Verifica se a pergunta foi encontrada
        if (rows.length > 0) {
            const { respostas, ...pergunta } = rows[0];
            // Verifica se existem respostas para a pergunta
            if (!respostas || respostas[0] === null) {
                res.status(404).json({ message: ERRO_LISTAGEM });
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
            res.status(404).json({ message: ERRO_PERGUNTA_NAO_ENCONTRADA });
        }
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: ERRO_BUSCAR_RESPOSTAS });
    }
}