import { Pool } from "pg";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Mensagens de erro
const ERRO_AUTENTICACAO = 'Usuário ou senha inválidos ou usuário inexistente.';

/**
 * @swagger
 * /login:
 *   post:
 *     tags:
 *      - Login
 *     description: Autenticação do usuário previamente cadastrado.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Dados do usuário
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             usuario:
 *               type: string
 *               maxLength: 40
 *               description: Nome do usuário.
 *             senha:
 *               type: string
 *               description: Senha do usuário.
 *     responses:
 *       200:
 *         description: Retorna o token JWT
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *               description: Token JWT.
 *       400:
 *         description: Usuário ou senha inválidos ou usuário inexistente.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export async function efetuarLogin(req: Request, res: Response, pool: Pool) {
    const { usuario, senha } = req.body;

    // Consulta para buscar o usuário no banco de dados
    const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2', [usuario, senha]);

    // Verifica se o usuário existe
    if (!retornoBanco.rows.length) {
        res.status(400).json({ message: ERRO_AUTENTICACAO });
        return;
    }

    // Se a autenticação for bem-sucedida, crie um token JWT.
    const usuarioBanco = retornoBanco.rows[0];
    const payload = {
        usuario: usuario,
        senha,
        usuarioId: usuarioBanco.id,
        tipo: usuarioBanco.tipo
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: '1h' });

    res.json({ token });
}