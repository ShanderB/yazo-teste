import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_ATUALIZACAO = (nome: string) => `Atualizado "${nome}" ao banco.`;
const ERRO_ATUALIZACAO = 'Erro ao atualizar no banco.';

/**
 * @swagger
 * /usuario/{id}:
 *   put:
 *     tags:
 *       - Usuário
 *     description: Atualiza um usuário existente.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         type: integer
 *         description: ID do usuário a ser atualizado.
 *       - in: body
 *         name: body
 *         description: Dados do usuário a serem atualizados.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             nome:
 *               type: string
 *               description: Nome do usuário.
 *             senha:
 *               type: string
 *               description: Senha do usuário.
 *             tipo:
 *               type: integer
 *               description: Tipo do usuário. Pode ser 1 ou 2.
 *               enum: [1, 2]
 *     responses:
 *       200:
 *         description: Usuário atualizado com sucesso.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de sucesso.
 *       500:
 *         description: Erro ao atualizar o usuário.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function alteracaoUsuario(req: Request, res: Response, pool: Pool) {
  const { id } = req.params;
  const { nome, senha, tipo } = req.body;

  const response = await pool.query('UPDATE usuarios SET nome = $1, senha = $2, tipo = $3 WHERE id = $4', [nome, senha, tipo, id]);
  if (response.rowCount === 1) {
    res.status(200).json({ message: SUCESSO_ATUALIZACAO(nome) });
  } else {
    res.status(500).json({ message: ERRO_ATUALIZACAO });
  }
}