import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_REMOCAO = (id: string) => `Removida a pergunta "${id}" do banco.`;
const ERRO_REMOCAO = 'Erro ao remover a pergunta do banco.';

/**
 * @swagger
 * /pergunta/{id}:
 *   delete:
 *     tags:
 *       - Pergunta
 *     description: Deleta uma pergunta existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID da pergunta a ser deletada.
 *     responses:
 *       200:
 *         description: Pergunta deletada com sucesso.
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
 *         description: Erro ao deletar a pergunta.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function deletarPergunta(req: Request, res: Response, pool: Pool) {
    const { id } = req.params;

    // Verificar se a pergunta existe
    const perguntaExistente = await pool.query('SELECT * FROM perguntas WHERE id = $1', [id]);
    if (perguntaExistente.rowCount === 0) {
        return res.status(404).json({ message: `Pergunta com id ${id} não encontrada.` });
    }

    const response = await pool.query('DELETE FROM perguntas WHERE id = $1', [id]);
    if (response.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_REMOCAO(id) });
    } else {
        res.status(500).json({ message: ERRO_REMOCAO });
    }
}
