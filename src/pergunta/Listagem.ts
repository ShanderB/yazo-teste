import { Pool } from "pg";
import { dadosJWT } from "../common/validacaoTipoUsuario";
import { RespostaBanco } from "../interfaces/RespostaBanco";
import { Request, Response } from 'express';

export async function listagemPerguntas(req: Request, res: Response, pool: Pool) {
    const perguntas = await pool.query('SELECT * FROM perguntas');
    const dadosUsuario = dadosJWT(req, res, pool);

    if (perguntas.rows.length) {
        const respostasUsuario = await pool.query('SELECT idPergunta FROM respostas WHERE respondidoPor = $1', [dadosUsuario?.id]);

        const mapPergunta = perguntas.rows.map((pergunta: { id: number, pergunta: string, criadopor: number }) => {
            const respondido = respostasUsuario.rows.some((resposta: RespostaBanco) => resposta.idpergunta === pergunta.id);
            return {
                ...pergunta,
                respondido
            }
        })

        res.status(200).json(mapPergunta);
    } else {
        res.status(400).json({ message: 'Sem dados no banco.' });
    }
}