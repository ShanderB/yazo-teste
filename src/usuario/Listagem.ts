import { Pool } from "pg";
import { Response } from 'express';

// Mensagens de erro
const ERRO_SEM_DADOS = 'Sem dados no banco.';

export default async function listagemUsuarios(res: Response, pool: Pool) {
    const response = await pool.query('SELECT * FROM usuarios');
    if (response.rows.length) {
        res.status(200).json(response.rows);
    } else {
        res.status(400).json({ message: ERRO_SEM_DADOS });
    }
}