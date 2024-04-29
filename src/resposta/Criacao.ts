import { Pool } from "pg";
import { dadosJWT } from "../common/validacaoTipoUsuario";
import { Request, Response } from 'express';

// Mensagens de erro
const ERRO_CAMPOS = 'Por favor, preencha todos os campos corretamente.';
const ERRO_PERGUNTA_NAO_EXISTE = 'Pergunta não existe.';
const ERRO_RESPOSTA_PROPIA = 'Não é possível responder uma pergunta criada por si mesmo.';
const ERRO_JA_RESPONDEU = 'Você já respondeu essa pergunta.';
const ERRO_ADICIONAR_RESPOSTA = 'Erro ao adicionar resposta ao banco.';
const SUCESSO_ADICIONAR_RESPOSTA = 'Adicionado resposta ao banco.';

/**
 * @swagger
 * /resposta:
 *   post:
 *     tags:
 *       - Resposta
 *     description: Cria uma nova resposta para uma pergunta.
 *     parameters:
 *       - in: body
 *         name: body
 *         description: Resposta a ser criada.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             idPergunta:
 *               type: integer
 *               description: ID da pergunta a ser respondida.
 *             resposta:
 *               type: string
 *               description: Texto da resposta.
 *     responses:
 *       200:
 *         description: Resposta criada com sucesso.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de sucesso.
 *       400:
 *         description: Erro ao criar a resposta.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 *       404:
 *         description: Pergunta não encontrada.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 *       500:
 *         description: Erro no servidor.
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: Mensagem de erro.
 */
export async function criarResposta(req: Request, res: Response, pool: Pool): Promise<void> {
    const { idPergunta, resposta } = req.body;

    if (!idPergunta || !resposta) {
        res.status(400).json({ message: ERRO_CAMPOS });
        return;
    }

    const hasPergunta = await pool.query('SELECT criadoPor FROM perguntas WHERE id = $1', [idPergunta]);

    if (!hasPergunta.rows.length) {
        res.status(404).json({ message: ERRO_PERGUNTA_NAO_EXISTE });
        return;
    }

    const dadosUsuario = dadosJWT(req, res, pool);

    if (hasPergunta.rows[0].criadopor == dadosUsuario?.usuarioId) {
        res.status(400).json({ message: ERRO_RESPOSTA_PROPIA });
        return;
    }

    const hasResposta = await pool.query(
        'SELECT idPergunta, respondidoPor FROM respostas WHERE idPergunta = $1 AND respondidoPor = $2',
        [idPergunta, dadosUsuario?.usuarioId]
    );

    if (hasResposta.rows.length) {
        res.status(400).json({ message: ERRO_JA_RESPONDEU });
        return;
    }

    const retornoBanco = await pool.query(
        'INSERT INTO respostas (idPergunta, respondidoPor, resposta) VALUES ($1, $2, $3)',
        [idPergunta, dadosUsuario?.usuarioId, resposta]
    );

    if (retornoBanco.rowCount === 1) {
        res.status(200).json({ message: SUCESSO_ADICIONAR_RESPOSTA });
        return;
    } else {
        res.status(500).json({ message: ERRO_ADICIONAR_RESPOSTA });
        return;
    }
}