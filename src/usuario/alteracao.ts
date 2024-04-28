import { Pool } from "pg";
import { Request, Response } from 'express';

// Mensagens de erro e sucesso
const SUCESSO_ATUALIZACAO = (nome: string) => `Atualizado "${nome}" ao banco.`;
const ERRO_ATUALIZACAO = 'Erro ao atualizar no banco.';

export default async function alteracaoUsuario(req: Request, res: Response, pool: Pool) {
  const { id } = req.params;
  const { nome, senha, tipo } = req.body;

  const response = await pool.query('UPDATE usuarios SET nome = $1, senha = $2, tipo = $3 WHERE id = $4', [nome, senha, tipo, id]);
  if (response.rowCount === 1) {
    res.status(200).json({ message: SUCESSO_ATUALIZACAO(nome) });
  } else {
    res.status(500).json({ message: ERRO_ATUALIZACAO });
  }
}