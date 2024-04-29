import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_REMOCAO = (id: string) => `Removido "${id}" do banco.`;
const ERRO_REMOCAO = 'Erro ao remover do banco.';

/**
 * @swagger
 * /usuario/{id}:
 *   delete:
 *     tags:
 *       - Usuário
 *     description: Deleta um usuário existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID do usuário a ser deletado.
 *     responses:
 *       200:
 *         description: Usuário deletado com sucesso.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de sucesso.
 *       500:
 *         description: Erro ao deletar o usuário.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function deletarUsuario(req: Request, res: Response, pool: Pool) {
    const { id } = req.params;

    const response = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    if (response.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_REMOCAO(id) });
    } else {
        res.status(500).json({ message: ERRO_REMOCAO });
    }
}