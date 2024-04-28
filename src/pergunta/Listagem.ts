import { Pool } from "pg";
import { dadosJWT } from "../common/validacaoTipoUsuario";
import { RespostaBanco } from "../interfaces/RespostaBanco";
import { Request, Response } from 'express';

// Mensagens de erro
const ERRO_SEM_DADOS = 'Sem dados no banco.';

export default async function listagemPerguntas(req: Request, res: Response, pool: Pool) {
    // Consulta para buscar todas as perguntas
    const perguntas = await pool.query('SELECT * FROM perguntas');

    // Obtém os dados do usuário
    const dadosUsuario = dadosJWT(req, res, pool);

    // Verifica se existem perguntas
    if (perguntas.rows.length) {
        // Consulta para buscar as respostas do usuário
        const respostasUsuario = await pool.query('SELECT idPergunta FROM respostas WHERE respondidoPor = $1', [dadosUsuario?.id]);

        // Mapeia as perguntas para incluir se foram respondidas pelo usuário
        const perguntasRespondidas = perguntas.rows.map((pergunta: { id: number, pergunta: string, criadopor: number }) => {
            const respondido = respostasUsuario.rows.some((resposta: RespostaBanco) => resposta.idpergunta === pergunta.id);
            return {
                ...pergunta,
                respondido
            }
        })

        res.status(200).json(perguntasRespondidas);
    } else {
        res.status(400).json({ message: ERRO_SEM_DADOS });
    }
}