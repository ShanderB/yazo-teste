import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_ATUALIZACAO = (id: string) => `Atualizada a resposta "${id}" no banco.`;
const ERRO_ATUALIZACAO = 'Erro ao atualizar a resposta no banco.';

/**
 * @swagger
 * /resposta/{id}:
 *   put:
 *     tags:
 *       - Resposta
 *     description: Atualiza uma resposta existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID da resposta a ser atualizada.
 *       - in: body
 *         name: body
 *         description: Dados da resposta a serem atualizados.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             resposta:
 *               type: string
 *               description: Texto da resposta.
 *     responses:
 *       200:
 *         description: Resposta atualizada com sucesso.
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
 *         description: Erro ao atualizar a resposta.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function alteracaoResposta(req: Request, res: Response, pool: Pool) {
    const { id } = req.params;
    const { resposta } = req.body;

    // Verificar se a resposta existe
    const respostaExistente = await pool.query('SELECT * FROM respostas WHERE id = $1', [id]);
    if (respostaExistente.rowCount === 0) {
        return res.status(404).json({ message: `Resposta com id ${id} não encontrada.` });
    }

    // Se a resposta existir, atualize-a
    const response = await pool.query('UPDATE respostas SET resposta = $1 WHERE id = $2', [resposta, id]);
    if (response.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_ATUALIZACAO(id) });
    } else {
        res.status(500).json({ message: ERRO_ATUALIZACAO });
    }
}