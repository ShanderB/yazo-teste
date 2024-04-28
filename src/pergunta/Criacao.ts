import { dadosJWT } from "../common/validacaoTipoUsuario";
import { Request, Response } from 'express';
import { Pool } from "pg";

// Mensagens de erro
const ERRO_CAMPOS = 'Por favor, preencha todos os campos corretamente.';
const ERRO_PERGUNTA_EXISTE = 'Pergunta já existe.';
const ERRO_BANCO = 'Erro ao adicionar ao banco.';
const SUCESSO_BANCO = 'Adicionado a pergunta ao banco.';

export default async function criarPergunta(req: Request, res: Response, pool: Pool) {
    const { pergunta } = req.body;

    // Verifica se a pergunta foi fornecida
    if (!pergunta) {
        res.status(400).json({ message: ERRO_CAMPOS });
        return;
    }

    // Consulta para verificar se a pergunta já existe
    const hasPergunta = await pool.query('SELECT LOWER(pergunta) FROM perguntas WHERE LOWER(pergunta) = $1', [pergunta]);

    // Verifica se a pergunta já existe
    if (hasPergunta.rows.length) {
        res.status(400).json({ message: ERRO_PERGUNTA_EXISTE });
        return;
    }

    // Obtém os dados do usuário
    const dadosUsuario = dadosJWT(req, res, pool);

    // Consulta para inserir a nova pergunta
    const retornoBanco = await pool.query('INSERT INTO perguntas (pergunta, criadoPor) VALUES ($1, $2)', [pergunta, dadosUsuario?.id]);

    // Verifica se a inserção foi bem-sucedida
    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_BANCO });
        return;
    } else {
        res.status(500).json({ message: ERRO_BANCO });
        return;
    }
}