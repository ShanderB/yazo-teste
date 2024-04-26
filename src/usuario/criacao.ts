import { Pool } from "pg";
import { Request, Response } from 'express';

export async function criarUsuario(req: Request, res: Response, pool: Pool) {
    const { nome, senha, tipo } = req.body;

    if (!nome || !senha || !tipo) {
        res.status(400).json({ message: 'Por favor, preencha todos os campos corretamente.' });
        return;
    }

    const retornoBanco = await pool.query('INSERT INTO usuarios (nome, senha, tipo) VALUES ($1, $2, $3)', [nome, senha, tipo]);

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: `Adicionado "${nome}" ao banco.` });
    } else {
        res.status(500).json({ message: 'Erro ao adicionar ao banco.' });
    }
}