import { Pool } from "pg";
import { Request, Response } from 'express';

export async function alteracaoUsuario(req: Request, res: Response, pool: Pool){
    const { id } = req.params;
    const { nome, senha, tipo } = req.body;
  
    const response = await pool.query('UPDATE usuarios SET nome = $1, senha = $2, tipo = $3 WHERE id = $4', [nome, senha, tipo, id]);
    if (response.rowCount === 1) {
      res.status(200).json({ message: `Atualizado "${nome}" ao banco.` });
    } else {
      res.status(500).json({ message: 'Erro ao atualizar no banco.' });
    }
}