import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro
const ERRO_LISTAGEM = 'Não há nada para listar nesta página.';
const ERRO_PERGUNTA_NAO_ENCONTRADA = 'Pergunta não encontrada.';
const ERRO_BUSCAR_RESPOSTAS = 'Erro ao buscar respostas.';

/**
 * @swagger
 * /listagemPorId/{id}:
 *   get:
 *     tags:
 *       - Pergunta
 *     description: Lista uma pergunta e suas respostas por ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID da pergunta.
 *       - in: query
 *         name: page
 *         type: integer
 *         description: Número da página (default é 1).
 *       - in: query
 *         name: limit
 *         type: integer
 *         description: Quantidade de respostas por página (default é 10).
 *     responses:
 *       200:
 *         description: Pergunta e respostas.
 *         schema:
 *           type: object
 *           properties:
 *             pergunta:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: ID da pergunta.
 *                 pergunta:
 *                   type: string
 *                   description: Texto da pergunta.
 *                 criadoPor:
 *                   type: integer
 *                   description: ID do usuário que criou a pergunta.
 *                 respondido:
 *                   type: boolean
 *                   description: Indica se a pergunta foi respondida pelo usuário.
 *             respostas:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     description: ID da resposta.
 *                   resposta:
 *                     type: string
 *                     description: Texto da resposta.
 *                   criadoPor:
 *                     type: integer
 *                     description: ID do usuário que criou a resposta.
 *             offset:
 *               type: integer
 *               description: Offset da paginação.
 *             limit:
 *               type: integer
 *               description: Limite da paginação.
 *             page:
 *               type: integer
 *               description: Número da página.
 *       404:
 *         description: Pergunta não encontrada ou sem respostas.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 *       500:
 *         description: Erro ao buscar respostas.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
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