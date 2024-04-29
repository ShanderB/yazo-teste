import { Pool } from "pg";
import { Response } from 'express';

// Mensagens de erro
const ERRO_SEM_DADOS = 'Sem dados no banco.';

/**
 * @swagger
 * /listagemUsuarios:
 *   get:
 *     tags:
 *       - Usuário
 *     description: Lista todos os usuários.
 *     responses:
 *       200:
 *         description: Lista de usuários.
 *         schema:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 description: Nome do usuário.
 *               senha:
 *                 type: string
 *                 description: Senha do usuário.
 *               tipo:
 *                 type: integer
 *                 description: Tipo do usuário. Pode ser 1 ou 2.
 *       400:
 *         description: Sem dados no banco.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function listagemUsuarios(res: Response, pool: Pool) {
    const response = await pool.query('SELECT * FROM usuarios');
    if (response.rows.length) {
        res.status(200).json(response.rows);
    } else {
        res.status(400).json({ message: ERRO_SEM_DADOS });
    }
}