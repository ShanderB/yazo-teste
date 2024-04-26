import { Pool } from "pg";
import { Response } from 'express';

export async function listagemUsuarios(res: Response, pool: Pool) {
    const response = await pool.query('SELECT * FROM usuarios');
    if (response.rows.length) {
        res.status(200).json(response.rows);
    } else {
        res.status(400).json({ message: 'Sem dados no banco.' });
    }
}