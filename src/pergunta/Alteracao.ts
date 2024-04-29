import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_ATUALIZACAO = (texto: string) => `Atualizada a pergunta "${texto}" no banco.`;
const ERRO_ATUALIZACAO = 'Erro ao atualizar a pergunta no banco.';

/**
 * @swagger
 * /pergunta/{id}:
 *   put:
 *     tags:
 *       - Pergunta
 *     description: Atualiza uma pergunta existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID da pergunta a ser atualizada.
 *       - in: body
 *         name: body
 *         description: Dados da pergunta a serem atualizados.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             pergunta:
 *               type: string
 *               description: Texto da pergunta.
 *     responses:
 *       200:
 *         description: Pergunta atualizada com sucesso.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de sucesso.
 *       404:
 *         description: Pergunta não encontrada.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Pergunta não encontrada.
 *       500:
 *         description: Erro ao atualizar a pergunta.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function alteracaoPergunta(req: Request, res: Response, pool: Pool) {
    const { id } = req.params;
    const { pergunta } = req.body;

    // Verificar se a pergunta existe
    const perguntaExistente = await pool.query('SELECT * FROM perguntas WHERE id = $1', [id]);
    if (perguntaExistente.rowCount === 0) {
        return res.status(404).json({ message: `Pergunta com id ${id} não encontrada.` });
    }

    const response = await pool.query('UPDATE perguntas SET pergunta = $1 WHERE id = $2', [pergunta, id]);
    if (response.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_ATUALIZACAO(id) });
    } else {
        res.status(500).json({ message: ERRO_ATUALIZACAO });
    }
}