import { Pool } from "pg";
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export async function efetuarLogin(req: Request, res: Response, pool: Pool) {
    const { usuario, senha } = req.body;

    //TODO separar em algum arquivo.
    const retornoBanco = await pool.query('SELECT * FROM usuarios WHERE usuario = $1 AND senha = $2', [usuario, senha]);

    if (!retornoBanco.rows.length) {
        res.status(400).json({ message: 'Usuário ou senha inválidos ou usuário inexistente.' });
        return;
    }

    // Se a autenticação for bem-sucedida, crie um token JWT.
    const token = jwt.sign({ usuario: usuario, senha, usuarioId: retornoBanco.rows[0].id, tipo: retornoBanco.rows[0].tipo }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    // Envie o token de volta para o cliente.
    res.json({ token });
}