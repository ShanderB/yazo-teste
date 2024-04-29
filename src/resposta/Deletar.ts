import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_DELECAO = (id: string) => `Deletada a resposta "${id}" do banco.`;
const ERRO_DELECAO = 'Erro ao deletar a resposta do banco.';

/**
 * @swagger
 * /resposta/{id}:
 *   delete:
 *     tags:
 *       - Resposta
 *     description: Deleta uma resposta existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID da resposta a ser deletada.
 *     responses:
 *       200:
 *         description: Resposta deletada com sucesso.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de sucesso.
 *       404:
 *         description: Resposta não encontrada.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 *       500:
 *         description: Erro ao deletar a resposta.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function deletarResposta(req: Request, res: Response, pool: Pool) {
    const { id } = req.params;

    // Verificar se a resposta existe
    const respostaExistente = await pool.query('SELECT * FROM respostas WHERE id = $1', [id]);
    if (respostaExistente.rowCount === 0) {
        return res.status(404).json({ message: `Resposta com id ${id} não encontrada.` });
    }

    // Se a resposta existir, delete-a
    const response = await pool.query('DELETE FROM respostas WHERE id = $1', [id]);
    if (response.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_DELECAO(id) });
    } else {
        res.status(500).json({ message: ERRO_DELECAO });
    }
}