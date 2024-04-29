import { Pool } from "pg";
import { Request, Response } from 'express';
import { UsuarioTipo } from "../constants";

// Mensagens de erro e sucesso
const ERRO_CAMPOS = 'Por favor, preencha todos os campos corretamente.';
const ERRO_USUARIO_EXISTE = 'Usuário já existe.';
const ERRO_ADICIONAR_USUARIO = 'Erro ao adicionar novo usuário ao banco.';
const SUCESSO_ADICIONAR_USUARIO = (usuario: string) => `Adicionado "${usuario}" ao banco.`;

/**
 * @swagger
 * /usuario:
 *   post:
 *     tags:
 *      - Usuário
 *     description: Cria um novo usuário.
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
 *             tipo:
 *               type: integer
 *               description: Tipo do usuário. Deve ser 1 ou 2.
 *               enum: [1, 2]
 *     responses:
 *       200:
 *         description: Usuário criado com sucesso.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de sucesso com o usuário inserido na resposta.
 *       400:
 *         description: Erro na criação do usuário.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 *       500:
 *         description: Erro interno do servidor.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export default async function criarUsuario(req: Request, res: Response, pool: Pool) {
    const { usuario, senha, tipo } = req.body;

    if (!usuario || usuario.length > 40 || !senha || !tipo || (tipo !== UsuarioTipo.ORGANIZADOR && tipo !== UsuarioTipo.PARTICIPANTE)) {
        res.status(400).json({ message: ERRO_CAMPOS });
        return;
    }

    const hasUsuario = await pool.query('SELECT usuario FROM usuarios WHERE usuario = $1', [usuario]);

    if (hasUsuario.rows.length) {
        res.status(400).json({ message: ERRO_USUARIO_EXISTE });
        return;
    }

    const retornoBanco = await pool.query('INSERT INTO usuarios (usuario, senha, tipo) VALUES ($1, $2, $3)', [usuario, senha, tipo]);

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_ADICIONAR_USUARIO(usuario) });
        return;
    } else {
        res.status(500).json({ message: ERRO_ADICIONAR_USUARIO });
        return;
    }
}