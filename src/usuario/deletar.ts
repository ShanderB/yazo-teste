import { Pool } from "pg";
import { Request, Response } from 'express';


export async function deletarUsuario(req: Request, res: Response, pool: Pool) {
    const { id } = req.params;

    const response = await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);

    if (response.rowCount === 1) {
        res.status(200).json({ message: `Removido "${id}" ao banco.` });
    } else {
        res.status(500).json({ message: 'Erro ao remover do banco.' });
    }
}