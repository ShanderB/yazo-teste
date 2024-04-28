import { Pool } from "pg";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

// Mensagens de erro
const ERRO_AUTENTICACAO = 'Usuário ou senha inválidos ou usuário inexistente.';

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